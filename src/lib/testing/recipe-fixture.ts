import type { Recipe, CategoryDefinition, TagWithName } from '../recipe-source';
import { tagSlug, tagDisplayName } from '../tags';

// The canonical six Categories, inlined here because this fixture is the only place left that
// needs the closed set written down: production code gets it from the database (ADR 0004).
const CANONICAL_CATEGORIES: readonly CategoryDefinition[] = [
  { slug: 'drinks', name: 'Drinks', order: 0, tileBg: '#D3E3E6' },
  { slug: 'breakfast', name: 'Breakfast', order: 1, tileBg: '#F5E2AE' },
  { slug: 'lunch', name: 'Lunch', order: 2, tileBg: '#DFE8CE' },
  { slug: 'dinner', name: 'Dinner', order: 3, tileBg: '#F3D3C3' },
  { slug: 'desserts', name: 'Desserts', order: 4, tileBg: '#EFD6DF' },
  { slug: 'snacks-and-sides', name: 'Snacks & sides', order: 5, tileBg: '#E3DAEE' },
];

// Overrides accept bare Tag strings (as most tests still write them) alongside the TagWithName[]
// shape a real RecipeSource hands back (some tests pass an already-built Recipe's tags straight
// through) — makeRecipe derives the name for a bare string the same way the Supabase source's
// tagDisplayName() fallback would for a Tag row carrying no stored name.
type RecipeOverrides = Omit<Partial<Recipe>, 'tags'> & { tags?: Array<string | TagWithName> };

// Builds a well-formed Recipe for tests, so each test only states the fields it cares about.
export function makeRecipe(overrides: RecipeOverrides = {}): Recipe {
  const { tags, ...rest } = overrides;
  return {
    slug: 'fixture-recipe',
    title: 'Fixture recipe',
    ingredients: ['1 fixture ingredient'],
    steps: ['Do the fixture step.'],
    prepMinutes: null,
    cookMinutes: null,
    servings: null,
    notes: null,
    heroPath: null,
    status: 'published',
    archivedAt: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    categories: ['dinner'],
    tags: (tags ?? []).map((raw) => (typeof raw === 'string' ? { slug: tagSlug(raw), name: tagDisplayName(raw) } : raw)),
    ...rest,
  };
}

// The canonical six Categories for tests, or a given set when one not of six is needed.
export function makeCategories(categories: readonly CategoryDefinition[] = CANONICAL_CATEGORIES): CategoryDefinition[] {
  return [...categories];
}
