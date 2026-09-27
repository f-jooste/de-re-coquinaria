import { describe, expect, it } from 'vitest';
import { JsonRecipeSource } from './json-recipe-source';

describe('JsonRecipeSource', () => {
  it('reads both shipped Recipes as Published and passing validation', () => {
    const source = new JsonRecipeSource();
    const slugs = source.getAllRecipes().map((r) => r.slug);
    expect(slugs).toContain('chicken-tinga-tacos');
    expect(slugs).toContain('miso-salmon');
  });

  it('orders the shipped Recipes newest-first', () => {
    const source = new JsonRecipeSource();
    const createdAts = source.getAllRecipes().map((r) => r.createdAt);
    const sorted = [...createdAts].sort((a, b) => b.localeCompare(a));
    expect(createdAts).toEqual(sorted);
  });

  it('finds a Recipe by its Slug', () => {
    const source = new JsonRecipeSource();
    expect(source.getRecipeBySlug('miso-salmon')?.title).toBe('Miso salmon');
    expect(source.getRecipeBySlug('does-not-exist')).toBeUndefined();
  });
});
