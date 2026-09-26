import type { Recipe } from './recipe-source';
import { RecipeSourceBase } from './recipe-source-base';
import { isVisible } from './recipe-filtering';

// Test-only RecipeSource: routes render against this, never against JSON, so tests survive the Supabase swap unedited.
export class InMemoryRecipeSource extends RecipeSourceBase {
  constructor(recipes: Recipe[]) {
    super(recipes.filter(isVisible));
  }
}
