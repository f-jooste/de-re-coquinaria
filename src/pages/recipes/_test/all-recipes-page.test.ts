import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import AllRecipesPage from '../index.astro';
import { makeRecipe } from '../../../lib/testing/recipe-fixture';
import { InMemoryRecipeSource } from '../../../lib/in-memory-recipe-source';

// Renders the page against a second, in-memory RecipeSource — the one test seam this milestone
// establishes — never against a JSON file.

async function renderAllRecipes(overridesList: Parameters<typeof makeRecipe>[0][]) {
  const source = new InMemoryRecipeSource(overridesList.map((overrides) => makeRecipe(overrides)));
  const container = await AstroContainer.create();
  const html = await container.renderToString(AllRecipesPage, { props: { recipes: source.getAllRecipes() } });
  return html;
}

describe('All-recipes page', () => {
  it('renders a breadcrumb back to home', async () => {
    const html = await renderAllRecipes([makeRecipe({ slug: 'a' })]);
    expect(html).toMatch(/Home<\/a>/);
  });

  it('shows its live Recipe count', async () => {
    const html = await renderAllRecipes([makeRecipe({ slug: 'a' }), makeRecipe({ slug: 'b' })]);
    expect(html).toContain('2 recipes');
  });

  it('lists every Recipe newest-first, with no cap', async () => {
    const overrides = Array.from({ length: 10 }, (_, i) => ({
      slug: `recipe-${i}`,
      title: `Dish ${i}`,
      createdAt: `2026-01-${String(i + 1).padStart(2, '0')}T00:00:00.000Z`,
    }));
    const html = await renderAllRecipes(overrides);
    expect(html.indexOf('Dish 9')).toBeGreaterThanOrEqual(0);
    expect(html.indexOf('Dish 9')).toBeLessThan(html.indexOf('Dish 0'));
    expect(html).toContain('10 recipes');
  });

  it('excludes Draft and Archived Recipes', async () => {
    const html = await renderAllRecipes([
      { slug: 'draft', title: 'Draft dish', status: 'draft' },
      { slug: 'archived', title: 'Archived dish', archivedAt: '2026-01-01T00:00:00.000Z' },
      { slug: 'live', title: 'Live dish' },
    ]);
    expect(html).toContain('Live dish');
    expect(html).not.toContain('Draft dish');
    expect(html).not.toContain('Archived dish');
  });

  it('renders a calm empty state, not a bare page, when there are no Recipes', async () => {
    const html = await renderAllRecipes([]);
    expect(html).toContain('0 recipes');
    expect(html.toLowerCase()).toMatch(/no recipes/);
  });

  it('links a Recipe card to its own Recipe page through the base-path helper', async () => {
    const html = await renderAllRecipes([{ slug: 'chicken-tinga-tacos' }]);
    expect(html).toMatch(/<a class="card" href="[^"]*\/recipes\/chicken-tinga-tacos\/"/);
  });

  it('shows a card Category, since the listing crosses Categories', async () => {
    const html = await renderAllRecipes([{ slug: 'a', categories: ['lunch'] }]);
    expect(html).toContain('Lunch');
  });
});
