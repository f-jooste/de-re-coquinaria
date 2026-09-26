import { describe, expect, it } from 'vitest';
import { buildRecipeRoutes } from './recipe-routes';
import { InMemoryRecipeSource } from './in-memory-recipe-source';
import { makeRecipe } from './testing/recipe-fixture';

describe('buildRecipeRoutes', () => {
  it("derives a Recipe's route from its stored Slug, independent of its title", () => {
    const recipe = makeRecipe({ slug: 'a-very-different-slug', title: 'Totally Different Title Entirely' });
    const routes = buildRecipeRoutes(new InMemoryRecipeSource([recipe]));
    expect(routes).toEqual([{ params: { slug: 'a-very-different-slug' }, props: { recipe } }]);
  });

  it('produces no route for a Draft Recipe', () => {
    const draft = makeRecipe({ slug: 'draft-recipe', status: 'draft' });
    expect(buildRecipeRoutes(new InMemoryRecipeSource([draft]))).toEqual([]);
  });

  it('produces no route for an Archived Recipe', () => {
    const archived = makeRecipe({ slug: 'archived-recipe', archivedAt: '2026-01-01T00:00:00.000Z' });
    expect(buildRecipeRoutes(new InMemoryRecipeSource([archived]))).toEqual([]);
  });
});
