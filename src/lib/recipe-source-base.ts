import type { Recipe, RecipeSource, CategoryWithCount } from './recipe-source';
import { sortNewestFirst, categoriesWithCounts } from './recipe-filtering';

// Shared query behaviour for every RecipeSource; subclasses just supply the already-visible Recipes.
export abstract class RecipeSourceBase implements RecipeSource {
  protected constructor(protected readonly visible: Recipe[]) {}

  getAllRecipes(): Recipe[] {
    return sortNewestFirst(this.visible);
  }

  getRecipeBySlug(slug: string): Recipe | undefined {
    return this.visible.find((recipe) => recipe.slug === slug);
  }

  getRecipesByCategory(categorySlug: string): Recipe[] {
    return sortNewestFirst(this.visible.filter((recipe) => recipe.categories.includes(categorySlug)));
  }

  getRecipesByTag(tagSlug: string): Recipe[] {
    return sortNewestFirst(this.visible.filter((recipe) => recipe.tags.includes(tagSlug)));
  }

  getCategoriesWithCounts(): CategoryWithCount[] {
    return categoriesWithCounts(this.visible);
  }
}
