import { describe, expect, it } from 'vitest';
import { buildCategoryRoutes } from './category-routes';
import { InMemoryRecipeSource } from './in-memory-recipe-source';
import { makeRecipe } from './testing/recipe-fixture';

describe('buildCategoryRoutes', () => {
  it('produces a route for all six Categories, including ones with no Recipes', () => {
    const routes = buildCategoryRoutes(new InMemoryRecipeSource([]));
    expect(routes.map((route) => route.params.slug)).toEqual([
      'drinks',
      'breakfast',
      'lunch',
      'dinner',
      'desserts',
      'snacks-and-sides',
    ]);
    expect(routes.every((route) => route.props.recipes.length === 0)).toBe(true);
    expect(routes.every((route) => route.props.category.count === 0)).toBe(true);
  });

  it("scopes a route's Recipes to its own Category, including a Recipe in two Categories", () => {
    const both = makeRecipe({ slug: 'both', categories: ['dinner', 'lunch'] });
    const routes = buildCategoryRoutes(new InMemoryRecipeSource([both]));
    const dinner = routes.find((route) => route.params.slug === 'dinner')!;
    const lunch = routes.find((route) => route.params.slug === 'lunch')!;
    const breakfast = routes.find((route) => route.params.slug === 'breakfast')!;
    expect(dinner.props.recipes.map((r) => r.slug)).toEqual(['both']);
    expect(lunch.props.recipes.map((r) => r.slug)).toEqual(['both']);
    expect(breakfast.props.recipes).toEqual([]);
  });
});
