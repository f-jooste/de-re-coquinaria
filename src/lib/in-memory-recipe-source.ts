import type { Recipe, CategoryDefinition } from './recipe-source';
import { RecipeSourceBase } from './recipe-source-base';
import { isVisible } from './recipe-filtering';
import { CATEGORIES } from './categories';

// Test-only RecipeSource: routes render against this, never against JSON, so tests survive the Supabase swap unedited.
export class InMemoryRecipeSource extends RecipeSourceBase {
  constructor(recipes: Recipe[], categories: readonly CategoryDefinition[] = CATEGORIES) {
    super(recipes.filter(isVisible), categories);
  }
}
