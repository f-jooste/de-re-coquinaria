import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import CategoryTileGrid from '../CategoryTileGrid.astro';
import { InMemoryRecipeSource } from '../../lib/in-memory-recipe-source';
import { makeRecipe } from '../../lib/testing/recipe-fixture';

async function renderGrid(overridesList: Parameters<typeof makeRecipe>[0][]) {
  const source = new InMemoryRecipeSource(overridesList.map((overrides) => makeRecipe(overrides)));
  const categories = source.getCategoriesWithCounts();
  const container = await AstroContainer.create();
  return container.renderToString(CategoryTileGrid, { props: { categories } });
}

describe('CategoryTileGrid', () => {
  it('renders all six Categories in the canonical order', async () => {
    const html = await renderGrid([]);
    const names = ['Drinks', 'Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Snacks'];
    const positions = names.map((name) => html.indexOf(name));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('renders a Category with no Recipes normally, with a count of zero', async () => {
    const html = await renderGrid([]);
    expect(html).toContain('Drinks');
    expect(html).toMatch(/0 recipes/);
  });

  it('shows a live count for a Category holding Recipes', async () => {
    const html = await renderGrid([makeRecipe({ slug: 'a', categories: ['dinner'] })]);
    expect(html).toMatch(/1 recipes/);
  });

  it("links a tile to its Category page through the base-path helper", async () => {
    const html = await renderGrid([]);
    expect(html).toMatch(/<a class="tile" href="[^"]*\/categories\/dinner\/"/);
  });
});
