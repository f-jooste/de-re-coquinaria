import type { Recipe } from './recipe-source';
import { isCategorySlug } from './categories';

// Replaces the database constraints docs/schema.sql states but nothing here enforces; every failure names the file and field.

// Throws naming the file, field and violation.
function fail(file: string, field: string, message: string): never {
  throw new Error(`${file}: ${field} ${message}`);
}

// Requires a string, or throws.
function requireString(file: string, field: string, value: unknown): string {
  if (typeof value !== 'string') fail(file, field, 'must be a string');
  return value as string;
}

// Requires a non-blank string, or throws.
function requireNonEmptyString(file: string, field: string, value: unknown): string {
  const str = requireString(file, field, value);
  if (str.trim().length === 0) fail(file, field, 'must not be empty');
  return str;
}

// Requires a string or null, or throws.
function requireNullableString(file: string, field: string, value: unknown): string | null {
  if (value === null) return null;
  return requireString(file, field, value);
}

// Requires an array of strings, or throws.
function requireStringArray(file: string, field: string, value: unknown): string[] {
  if (!Array.isArray(value) || !value.every((item) => typeof item === 'string')) {
    fail(file, field, 'must be an array of strings');
  }
  return value as string[];
}

// Requires a non-empty array of strings, or throws.
function requireNonEmptyStringArray(file: string, field: string, value: unknown): string[] {
  const arr = requireStringArray(file, field, value);
  if (arr.length === 0) fail(file, field, 'must have at least one entry');
  return arr;
}

// Requires null or an integer no smaller than `min`, or throws.
function requireNullableInteger(file: string, field: string, value: unknown, min: number): number | null {
  if (value === null) return null;
  if (typeof value !== 'number' || !Number.isInteger(value) || value < min) {
    fail(file, field, `must be null or an integer >= ${min}`);
  }
  return value;
}

// Requires "draft" or "published", or throws.
function requireStatus(file: string, field: string, value: unknown): 'draft' | 'published' {
  if (value !== 'draft' && value !== 'published') fail(file, field, 'must be "draft" or "published"');
  return value;
}

// Requires at least one Category Slug, each in the closed set, or throws.
function requireCategories(file: string, field: string, value: unknown): string[] {
  const categories = requireNonEmptyStringArray(file, field, value);
  for (const slug of categories) {
    if (!isCategorySlug(slug)) fail(file, field, `references unknown category "${slug}"`);
  }
  return categories;
}

// Validates one Recipe file's parsed JSON, returning the typed Recipe or throwing on the first violation.
export function parseRecipe(file: string, raw: unknown): Recipe {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error(`${file}: is not a valid Recipe object`);
  }
  const r = raw as Record<string, unknown>;

  return {
    slug: requireNonEmptyString(file, 'slug', r.slug),
    title: requireNonEmptyString(file, 'title', r.title),
    ingredients: requireNonEmptyStringArray(file, 'ingredients', r.ingredients),
    steps: requireNonEmptyStringArray(file, 'steps', r.steps),
    prepMinutes: requireNullableInteger(file, 'prepMinutes', r.prepMinutes, 0),
    cookMinutes: requireNullableInteger(file, 'cookMinutes', r.cookMinutes, 0),
    servings: requireNullableInteger(file, 'servings', r.servings, 1),
    notes: requireNullableString(file, 'notes', r.notes),
    heroPath: requireNullableString(file, 'heroPath', r.heroPath),
    status: requireStatus(file, 'status', r.status),
    archivedAt: requireNullableString(file, 'archivedAt', r.archivedAt),
    createdAt: requireNonEmptyString(file, 'createdAt', r.createdAt),
    updatedAt: requireNonEmptyString(file, 'updatedAt', r.updatedAt),
    categories: requireCategories(file, 'categories', r.categories),
    tags: requireStringArray(file, 'tags', r.tags),
  };
}

// Enforces the uniqueness a unique index on `slug` would give in Postgres, naming both offending files.
export function assertUniqueSlugs(entries: Array<{ file: string; recipe: Recipe }>): void {
  const seen = new Map<string, string>();
  for (const { file, recipe } of entries) {
    const existing = seen.get(recipe.slug);
    if (existing) {
      throw new Error(`${file}: slug "${recipe.slug}" is already used by ${existing}`);
    }
    seen.set(recipe.slug, file);
  }
}
