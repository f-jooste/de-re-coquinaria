import { RecipeSourceBase } from './recipe-source-base';
import { supabase } from './supabase-client';
import { tagDisplayName } from './tags';
import type { CategoryDefinition, Recipe } from './recipe-source';

const RECIPE_COLUMNS =
  'slug,title,ingredients,steps,prep_minutes,cook_minutes,servings,notes,hero_path,status,archived_at,created_at,updated_at,recipe_categories(category_slug),recipe_tags(tags(slug,name))';

interface RecipeRow {
  slug: string;
  title: string;
  ingredients: string[];
  steps: string[];
  prep_minutes: number | null;
  cook_minutes: number | null;
  servings: number | null;
  notes: string | null;
  hero_path: string | null;
  status: 'draft' | 'published';
  archived_at: string | null;
  created_at: string;
  updated_at: string;
  recipe_categories: Array<{ category_slug: string }>;
  recipe_tags: Array<{ tags: { slug: string; name: string | null } | null }>;
}

interface CategoryRow {
  slug: string;
  name: string;
  sort_order: number;
  tile_bg: string;
}

// Maps one Postgres row (with its joined Categories and Tags) to the domain Recipe shape.
// tagDisplayName() is the fallback for a Tag row carrying no stored name.
function toRecipe(row: RecipeRow): Recipe {
  return {
    slug: row.slug,
    title: row.title,
    ingredients: row.ingredients,
    steps: row.steps,
    prepMinutes: row.prep_minutes,
    cookMinutes: row.cook_minutes,
    servings: row.servings,
    notes: row.notes,
    heroPath: row.hero_path,
    status: row.status,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    categories: row.recipe_categories.map((join) => join.category_slug),
    tags: row.recipe_tags
      .filter((join): join is { tags: { slug: string; name: string | null } } => join.tags !== null)
      .map((join) => ({ slug: join.tags.slug, name: join.tags.name ?? tagDisplayName(join.tags.slug) })),
  };
}

async function fetchVisibleRecipes(): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select(RECIPE_COLUMNS)
    .eq('status', 'published')
    .is('archived_at', null)
    .order('created_at', { ascending: false })
    .overrideTypes<RecipeRow[], { merge: false }>();
  if (error) throw new Error(`Supabase: failed to read Recipes: ${error.message}`);
  return (data ?? []).map(toRecipe);
}

async function fetchCategories(): Promise<CategoryDefinition[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('slug,name,sort_order,tile_bg')
    .order('sort_order')
    .overrideTypes<CategoryRow[], { merge: false }>();
  if (error) throw new Error(`Supabase: failed to read Categories: ${error.message}`);
  return (data ?? []).map((row) => ({ slug: row.slug, name: row.name, order: row.sort_order, tileBg: row.tile_bg }));
}

// Reads every Published, non-Archived Recipe with its Categories and Tags, and the Category set, from Postgres.
export class SupabaseRecipeSource extends RecipeSourceBase {
  private constructor(recipes: Recipe[], categories: CategoryDefinition[]) {
    super(recipes, categories);
  }

  static async create(): Promise<SupabaseRecipeSource> {
    const [recipes, categories] = await Promise.all([fetchVisibleRecipes(), fetchCategories()]);
    return new SupabaseRecipeSource(recipes, categories);
  }
}
