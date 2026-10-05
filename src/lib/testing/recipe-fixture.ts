import type { Recipe, CategoryDefinition } from '../recipe-source';
import { CATEGORIES } from '../categories';

// Builds a well-formed Recipe for tests, so each test only states the fields it cares about.
export function makeRecipe(overrides: Partial<Recipe> = {}): Recipe {
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
    tags: [],
    ...overrides,
  };
}

// The canonical six Categories for tests, or a given set when one not of six is needed.
export function makeCategories(categories: readonly CategoryDefinition[] = CATEGORIES): CategoryDefinition[] {
  return [...categories];
}
