import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import CategoryPage from '../[slug].astro';
import { makeRecipe } from '../../../lib/testing/recipe-fixture';
import { InMemoryRecipeSource } from '../../../lib/in-memory-recipe-source';

// Renders the page against a second, in-memory RecipeSource — the one test seam this milestone
// establishes — never against a JSON file.

async function renderCategory(overridesList: Parameters<typeof makeRecipe>[0][], categorySlug = 'dinner') {
  const source = new InMemoryRecipeSource(overridesList.map((overrides) => makeRecipe(overrides)));
  const category = source.getCategoriesWithCounts().find((c) => c.slug === categorySlug)!;
  const recipes = source.getRecipesByCategory(categorySlug);
  const container = await AstroContainer.create();
  const html = await container.renderToString(CategoryPage, { props: { category, recipes } });
  return html;
}

describe('Category page', () => {
  it('renders a breadcrumb back to home and the Category name', async () => {
    const html = await renderCategory([makeRecipe({ slug: 'a', categories: ['dinner'] })]);
    expect(html).toMatch(/Home<\/a>/);
    expect(html).toContain('Dinner');
  });

  it('shows its live Recipe count', async () => {
    const html = await renderCategory([
      makeRecipe({ slug: 'a', categories: ['dinner'] }),
      makeRecipe({ slug: 'b', categories: ['dinner'] }),
    ]);
    expect(html).toContain('2 recipes');
  });

  it('lists its Recipes newest-first', async () => {
    const html = await renderCategory([
      { slug: 'older', title: 'Older dish', createdAt: '2026-01-01T00:00:00.000Z', categories: ['dinner'] },
      { slug: 'newer', title: 'Newer dish', createdAt: '2026-02-01T00:00:00.000Z', categories: ['dinner'] },
    ]);
    expect(html.indexOf('Newer dish')).toBeGreaterThanOrEqual(0);
    expect(html.indexOf('Newer dish')).toBeLessThan(html.indexOf('Older dish'));
  });

  it('shows a Recipe that belongs to two Categories', async () => {
    const html = await renderCategory([
      { slug: 'both', title: 'Shared dish', categories: ['dinner', 'lunch'] },
    ]);
    expect(html).toContain('Shared dish');
  });

  it('renders a calm empty state, not a bare page, when the Category holds no Recipes', async () => {
    const html = await renderCategory([], 'drinks');
    expect(html).toContain('0 recipes');
    expect(html.toLowerCase()).toMatch(/no recipes/);
    expect(html).not.toMatch(/class="card"/);
  });

  it('links a Recipe card to its own Recipe page', async () => {
    const html = await renderCategory([{ slug: 'chicken-tinga-tacos', categories: ['dinner'] }]);
    expect(html).toMatch(/<a class="card" href="[^"]*\/recipes\/chicken-tinga-tacos\/"/);
  });
});
