import type { Recipe, RecipeSource } from './recipe-source';

export interface RecipeRoute {
  params: { slug: string };
  props: { recipe: Recipe };
}

// Builds the Recipe page's static path list from any RecipeSource — the seam tests substitute an in-memory implementation into.
export function buildRecipeRoutes(source: RecipeSource): RecipeRoute[] {
  return source.getAllRecipes().map((recipe) => ({
    params: { slug: recipe.slug },
    props: { recipe },
  }));
}
