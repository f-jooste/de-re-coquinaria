import type { Recipe } from './recipe-source';

export interface TagWithName {
  slug: string;
  name: string;
}

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
  const slugs = new Set<string>();
  for (const recipe of recipes) {
    for (const tag of recipe.tags) slugs.add(tagSlug(tag));
  }
  return [...slugs].sort().map((slug) => ({ slug, name: tagDisplayName(slug) }));
}
