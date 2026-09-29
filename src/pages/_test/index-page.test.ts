import { describe, expect, it } from 'vitest';
import IndexPage from '../index.astro';
import { makeRecipe } from '../../lib/testing/recipe-fixture';
import { InMemoryRecipeSource } from '../../lib/in-memory-recipe-source';
import { createContainer } from '../../lib/testing/astro-container';

// Renders the page against a second, in-memory RecipeSource — the one test seam this milestone
// establishes — never against a JSON file.

async function renderHome(overridesList: Parameters<typeof makeRecipe>[0][]) {
  const source = new InMemoryRecipeSource(overridesList.map((overrides) => makeRecipe(overrides)));
  const container = await createContainer();
  const html = await container.renderToString(IndexPage, {
    props: { categories: source.getCategoriesWithCounts(), recipes: source.getAllRecipes() },
  });
  return html;
}

describe('Home page', () => {
  it('shows all six Category tiles in the canonical order', async () => {
    const html = await renderHome([]);
    const names = ['Drinks', 'Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Snacks'];
    const positions = names.map((name) => html.indexOf(name));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('shows the search box in its designed position', async () => {
    const html = await renderHome([]);
    expect(html).toMatch(/<input id="q" class="input search-input"[^>]*type="search"/);
  });

  it('lists the recent strip newest-first', async () => {
    const html = await renderHome([
      { slug: 'older', title: 'Older dish', createdAt: '2026-01-01T00:00:00.000Z' },
      { slug: 'newer', title: 'Newer dish', createdAt: '2026-02-01T00:00:00.000Z' },
    ]);
    expect(html.indexOf('Newer dish')).toBeGreaterThanOrEqual(0);
    expect(html.indexOf('Newer dish')).toBeLessThan(html.indexOf('Older dish'));
  });

  it('caps the recent strip, keeping only the newest', async () => {
    const overrides = Array.from({ length: 10 }, (_, i) => ({
      slug: `recipe-${i}`,
      title: `Dish ${i}`,
      createdAt: `2026-01-${String(i + 1).padStart(2, '0')}T00:00:00.000Z`,
    }));
    const html = await renderHome(overrides);
    expect(html).toContain('Dish 9');
    expect(html).toContain('Dish 2');
    expect(html).not.toContain('Dish 1<');
    expect(html).not.toContain('Dish 0<');
  });

  it('excludes Draft and Archived Recipes from the recent strip', async () => {
    const html = await renderHome([
      { slug: 'draft', title: 'Draft dish', status: 'draft' },
      { slug: 'archived', title: 'Archived dish', archivedAt: '2026-01-01T00:00:00.000Z' },
      { slug: 'live', title: 'Live dish' },
    ]);
    expect(html).toContain('Live dish');
    expect(html).not.toContain('Draft dish');
    expect(html).not.toContain('Archived dish');
  });

  it('renders a calm empty state when there are no Recipes yet', async () => {
    const html = await renderHome([]);
    expect(html.toLowerCase()).toMatch(/no recipes/);
  });

  it('links a recent card to its own Recipe page through the base-path helper', async () => {
    const html = await renderHome([{ slug: 'chicken-tinga-tacos' }]);
    expect(html).toMatch(/<a class="card" href="[^"]*\/recipes\/chicken-tinga-tacos\/"/);
  });

  it('links to the all-Recipes view through the base-path helper', async () => {
    const html = await renderHome([]);
    expect(html).toMatch(/href="[^"]*\/recipes\/"[^>]*>All recipes<\/a>/);
  });

  it('shows no sign-in, add or edit control, and no Draft badge', async () => {
    const html = await renderHome([{ slug: 'a', title: 'A dish' }]);
    const lower = html.toLowerCase();
    expect(lower).not.toContain('sign in');
    expect(lower).not.toContain('add recipe');
    expect(html).not.toContain('badge-draft');
  });
});
