import { describe, expect, it } from 'vitest';
import { buildTagRoutes } from './tag-routes';
import { InMemoryRecipeSource } from './in-memory-recipe-source';
import { makeRecipe } from './testing/recipe-fixture';

describe('buildTagRoutes', () => {
  it('produces one route per Tag actually carried by a visible Recipe', () => {
    const source = new InMemoryRecipeSource([
      makeRecipe({ slug: 'a', tags: ['mexican', 'weeknight'] }),
      makeRecipe({ slug: 'b', tags: ['mexican'] }),
    ]);
    const routes = buildTagRoutes(source);
    expect(routes.map((route) => route.params.slug)).toEqual(['mexican', 'weeknight']);
  });

  it("scopes a route's Recipes to that Tag, across Categories", () => {
    const tacos = makeRecipe({ slug: 'tacos', categories: ['dinner'], tags: ['mexican'] });
    const quesadillas = makeRecipe({ slug: 'quesadillas', categories: ['lunch'], tags: ['mexican'] });
    const curry = makeRecipe({ slug: 'curry', categories: ['dinner'], tags: ['spicy'] });
    const routes = buildTagRoutes(new InMemoryRecipeSource([tacos, quesadillas, curry]));
    const mexicanRoute = routes.find((route) => route.params.slug === 'mexican')!;
    expect(mexicanRoute.props.recipes.map((r) => r.slug).sort()).toEqual(['quesadillas', 'tacos']);
  });

  it('collapses differently-cased Tags into a single route by canonical Slug', () => {
    const routes = buildTagRoutes(
      new InMemoryRecipeSource([
        makeRecipe({ slug: 'a', tags: ['Mexican'] }),
        makeRecipe({ slug: 'b', tags: ['mexican'] }),
      ]),
    );
    expect(routes.map((route) => route.params.slug)).toEqual(['mexican']);
    expect(routes[0].props.recipes.map((r) => r.slug).sort()).toEqual(['a', 'b']);
  });

  it('produces no route for a Tag only carried by a Draft Recipe', () => {
    const draft = makeRecipe({ slug: 'hidden', status: 'draft', tags: ['secret'] });
    expect(buildTagRoutes(new InMemoryRecipeSource([draft]))).toEqual([]);
  });

  it('produces no route for a Tag only carried by an Archived Recipe', () => {
    const archived = makeRecipe({ slug: 'hidden', archivedAt: '2026-01-01T00:00:00.000Z', tags: ['secret'] });
    expect(buildTagRoutes(new InMemoryRecipeSource([archived]))).toEqual([]);
  });
});
