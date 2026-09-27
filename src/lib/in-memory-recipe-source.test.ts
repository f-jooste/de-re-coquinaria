import { describe, expect, it } from 'vitest';
import { InMemoryRecipeSource } from './in-memory-recipe-source';
import { makeRecipe } from './testing/recipe-fixture';

describe('InMemoryRecipeSource', () => {
  it('orders getAllRecipes newest-first', () => {
    const older = makeRecipe({ slug: 'older', createdAt: '2026-01-01T00:00:00.000Z' });
    const newer = makeRecipe({ slug: 'newer', createdAt: '2026-02-01T00:00:00.000Z' });
    const source = new InMemoryRecipeSource([older, newer]);
    expect(source.getAllRecipes().map((r) => r.slug)).toEqual(['newer', 'older']);
  });

  it('excludes Draft Recipes from every listing and from lookup by Slug', () => {
    const draft = makeRecipe({ slug: 'draft-recipe', status: 'draft' });
    const source = new InMemoryRecipeSource([draft]);
    expect(source.getAllRecipes()).toEqual([]);
    expect(source.getRecipeBySlug('draft-recipe')).toBeUndefined();
  });

  it('excludes Archived Recipes from every listing and from lookup by Slug', () => {
    const archived = makeRecipe({ slug: 'archived-recipe', archivedAt: '2026-01-15T00:00:00.000Z' });
    const source = new InMemoryRecipeSource([archived]);
    expect(source.getAllRecipes()).toEqual([]);
    expect(source.getRecipeBySlug('archived-recipe')).toBeUndefined();
  });

  it('finds a Published, non-Archived Recipe by its Slug', () => {
    const recipe = makeRecipe({ slug: 'findable' });
    const source = new InMemoryRecipeSource([recipe]);
    expect(source.getRecipeBySlug('findable')?.slug).toBe('findable');
  });

  it('lists a Recipe under every Category it belongs to', () => {
    const both = makeRecipe({ slug: 'both', categories: ['dinner', 'lunch'] });
    const source = new InMemoryRecipeSource([both]);
    expect(source.getRecipesByCategory('dinner').map((r) => r.slug)).toEqual(['both']);
    expect(source.getRecipesByCategory('lunch').map((r) => r.slug)).toEqual(['both']);
    expect(source.getRecipesByCategory('breakfast')).toEqual([]);
  });

  it('lists Recipes carrying a Tag', () => {
    const tagged = makeRecipe({ slug: 'tagged', tags: ['weeknight'] });
    const source = new InMemoryRecipeSource([tagged]);
    expect(source.getRecipesByTag('weeknight').map((r) => r.slug)).toEqual(['tagged']);
    expect(source.getRecipesByTag('other')).toEqual([]);
  });

  it('matches a Tag by its lowercase canonical form regardless of stored or queried casing', () => {
    const tagged = makeRecipe({ slug: 'tagged', tags: ['Mexican'] });
    const source = new InMemoryRecipeSource([tagged]);
    expect(source.getRecipesByTag('mexican').map((r) => r.slug)).toEqual(['tagged']);
    expect(source.getRecipesByTag('MEXICAN').map((r) => r.slug)).toEqual(['tagged']);
  });

  it('returns all six Categories with counts, including a zero count', () => {
    const dinnerRecipe = makeRecipe({ slug: 'dinner-only', categories: ['dinner'] });
    const source = new InMemoryRecipeSource([dinnerRecipe]);
    const counts = source.getCategoriesWithCounts();
    expect(counts.map((c) => c.slug)).toEqual([
      'drinks',
      'breakfast',
      'lunch',
      'dinner',
      'desserts',
      'snacks-and-sides',
    ]);
    expect(counts.find((c) => c.slug === 'dinner')?.count).toBe(1);
    expect(counts.find((c) => c.slug === 'drinks')?.count).toBe(0);
  });
});
