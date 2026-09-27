// The domain shape of a Recipe, carrying every field from docs/schema.sql.
export interface Recipe {
  slug: string;
  title: string;
  ingredients: string[];
  steps: string[];
  prepMinutes: number | null;
  cookMinutes: number | null;
  servings: number | null;
  notes: string | null;
  heroPath: string | null;
  status: 'draft' | 'published';
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  categories: string[];
  tags: string[];
}

export interface CategoryWithCount {
  slug: string;
  name: string;
  order: number;
  tileBg: string;
  count: number;
}

// The only thing that knows where Recipes come from; every implementation filters to Published, non-Archived internally.
export interface RecipeSource {
  getAllRecipes(): Recipe[];
  getRecipeBySlug(slug: string): Recipe | undefined;
  getRecipesByCategory(categorySlug: string): Recipe[];
  getRecipesByTag(tagSlug: string): Recipe[];
  getCategoriesWithCounts(): CategoryWithCount[];
}
