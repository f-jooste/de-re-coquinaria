import type { Recipe } from './recipe-source';
import { tagSlug } from './tags';

// The Category page's Tag filter rule: every Recipe when no Tag is selected, otherwise only
// those carrying it. The client script mechanically mirrors this against each card's data-tags.
export function filterRecipesByTag(recipes: Recipe[], tag: string | null): Recipe[] {
  if (!tag) return recipes;
  const canonical = tagSlug(tag);
  return recipes.filter((recipe) => recipe.tags.some((recipeTag) => tagSlug(recipeTag) === canonical));
}
