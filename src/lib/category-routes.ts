import type { CategoryWithCount, Recipe, RecipeSource } from './recipe-source';

export interface CategoryRoute {
  params: { slug: string };
  props: { category: CategoryWithCount; recipes: Recipe[] };
}

// Builds all six Category pages from any RecipeSource — the set is closed, so an empty Category still gets a route.
export function buildCategoryRoutes(source: RecipeSource): CategoryRoute[] {
  return source.getCategoriesWithCounts().map((category) => ({
    params: { slug: category.slug },
    props: { category, recipes: source.getRecipesByCategory(category.slug) },
  }));
}
