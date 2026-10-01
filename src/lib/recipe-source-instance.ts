import { JsonRecipeSource } from './json-recipe-source';
import type { RecipeSource } from './recipe-source';

// Memoised across the whole process so a build only ever constructs one source.
let cached: Promise<RecipeSource> | null = null;

// The one place a page may reach for Recipe data. Every route imports this, never JSON files.
export function getRecipeSource(): Promise<RecipeSource> {
  cached ??= Promise.resolve(new JsonRecipeSource());
  return cached;
}
