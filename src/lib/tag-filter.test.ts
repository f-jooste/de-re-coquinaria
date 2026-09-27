import { describe, expect, it } from 'vitest';
import { filterRecipesByTag } from './tag-filter';
import { makeRecipe } from './testing/recipe-fixture';

describe('filterRecipesByTag', () => {
  it('narrows to Recipes carrying the given Tag', () => {
    const recipes = [makeRecipe({ slug: 'a', tags: ['mexican'] }), makeRecipe({ slug: 'b', tags: ['weeknight'] })];
    expect(filterRecipesByTag(recipes, 'mexican').map((r) => r.slug)).toEqual(['a']);
  });

  it('matches by canonical form regardless of casing', () => {
    const recipes = [makeRecipe({ slug: 'a', tags: ['Mexican'] })];
    expect(filterRecipesByTag(recipes, 'MEXICAN').map((r) => r.slug)).toEqual(['a']);
  });

  it('restores every Recipe when no Tag is selected, the same as clearing the filter', () => {
    const recipes = [makeRecipe({ slug: 'a', tags: ['mexican'] }), makeRecipe({ slug: 'b', tags: [] })];
    expect(filterRecipesByTag(recipes, null)).toEqual(recipes);
    expect(filterRecipesByTag(recipes, '')).toEqual(recipes);
  });
});
