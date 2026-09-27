import type { Recipe } from './recipe-source';

// The design file's card meta line: prep/cook time and servings, omitted entirely when none are recorded.
export function recipeMetaLine(recipe: Recipe): string | null {
  const parts: string[] = [];
  if (recipe.prepMinutes !== null) parts.push(`${recipe.prepMinutes} min prep`);
  if (recipe.cookMinutes !== null) parts.push(`${recipe.cookMinutes} min cook`);
  if (recipe.servings !== null) parts.push(`Serves ${recipe.servings}`);
  return parts.length > 0 ? parts.join(' · ') : null;
}
