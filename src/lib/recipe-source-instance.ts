import { JsonRecipeSource } from './json-recipe-source';
import type { RecipeSource } from './recipe-source';

// The one place a page may reach for Recipe data. Every route imports this, never JSON files.
export const recipeSource: RecipeSource = new JsonRecipeSource();
