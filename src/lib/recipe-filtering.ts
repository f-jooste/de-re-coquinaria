import type { Recipe, CategoryWithCount } from './recipe-source';
import { CATEGORIES } from './categories';

// Shared query logic so every RecipeSource implementation filters and orders identically.

// True for a Published, non-Archived Recipe.
export function isVisible(recipe: Recipe): boolean {
  return recipe.status === 'published' && recipe.archivedAt === null;
}

// Orders Recipes by creation timestamp, newest first.
export function sortNewestFirst(recipes: Recipe[]): Recipe[] {
  return [...recipes].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// The six Categories with a live count of the given (already-visible) Recipes.
export function categoriesWithCounts(visibleRecipes: Recipe[]): CategoryWithCount[] {
  return CATEGORIES.map((category) => ({
    ...category,
    count: visibleRecipes.filter((recipe) => recipe.categories.includes(category.slug)).length,
  }));
}
