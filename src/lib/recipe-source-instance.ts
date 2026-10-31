import { SupabaseRecipeSource } from './supabase-recipe-source';
import type { RecipeSource } from './recipe-source';

// Memoised across the whole process so a build only ever constructs one source.
let cached: Promise<RecipeSource> | null = null;

// The one place a page may reach for Recipe data. Every route imports this, never Supabase directly.
export function getRecipeSource(): Promise<RecipeSource> {
  cached ??= SupabaseRecipeSource.create();
  return cached;
}
