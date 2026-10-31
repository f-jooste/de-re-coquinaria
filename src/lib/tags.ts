import type { Recipe, TagWithName } from './recipe-source';

export type { TagWithName };

// Canonicalises a Tag string for comparison and for its URL Slug.
export function tagSlug(tag: string): string {
  return tag.trim().toLowerCase();
}

// The label shown for a Tag, derived from its canonical Slug (e.g. "make-ahead" -> "Make Ahead").
export function tagDisplayName(tag: string): string {
  return tagSlug(tag)
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// The distinct Tags carried by the given Recipes, alphabetically by canonical Slug.
export function distinctTags(recipes: Recipe[]): TagWithName[] {
  const names = new Map<string, string>();
  for (const recipe of recipes) {
    for (const tag of recipe.tags) {
      if (!names.has(tag.slug)) names.set(tag.slug, tag.name);
    }
  }
  return [...names.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([slug, name]) => ({ slug, name }));
}
