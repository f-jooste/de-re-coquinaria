import type { Recipe, RecipeSource, CategoryWithCount } from './recipe-source';
import { sortNewestFirst, categoriesWithCounts } from './recipe-filtering';
import { tagSlug } from './tags';

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

  // Canonicalised, unlike getRecipesByCategory: Categories are a closed set already validated
  // against known Slugs at the data boundary, but Tags are open and freeform, so casing can drift.
  getRecipesByTag(slug: string): Recipe[] {
    const canonical = tagSlug(slug);
    return sortNewestFirst(this.visible.filter((recipe) => recipe.tags.some((tag) => tagSlug(tag) === canonical)));
  }

  getCategoriesWithCounts(): CategoryWithCount[] {
    return categoriesWithCounts(this.visible);
  }
}
