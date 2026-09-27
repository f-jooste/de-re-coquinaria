import { describe, expect, it } from 'vitest';
import { recipeMetaLine } from './recipe-meta';
import { makeRecipe } from './testing/recipe-fixture';

describe('recipeMetaLine', () => {
  it('joins prep time, cook time and servings when all are recorded', () => {
    const recipe = makeRecipe({ prepMinutes: 15, cookMinutes: 30, servings: 4 });
    expect(recipeMetaLine(recipe)).toBe('15 min prep · 30 min cook · Serves 4');
  });

  it('omits an unrecorded field rather than leaving an empty label', () => {
    const recipe = makeRecipe({ prepMinutes: 15, cookMinutes: null, servings: null });
    expect(recipeMetaLine(recipe)).toBe('15 min prep');
  });

  it('returns null when no time or serving is recorded', () => {
    const recipe = makeRecipe({ prepMinutes: null, cookMinutes: null, servings: null });
    expect(recipeMetaLine(recipe)).toBeNull();
  });
});
