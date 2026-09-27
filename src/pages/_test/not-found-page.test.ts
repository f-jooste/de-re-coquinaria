import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import NotFoundPage from '../404.astro';
import { makeRecipe } from '../../lib/testing/recipe-fixture';
import { InMemoryRecipeSource } from '../../lib/in-memory-recipe-source';

async function renderNotFound(overridesList: Parameters<typeof makeRecipe>[0][] = []) {
  const source = new InMemoryRecipeSource(overridesList.map((overrides) => makeRecipe(overrides)));
  const container = await AstroContainer.create();
  const html = await container.renderToString(NotFoundPage, {
    props: { categories: source.getCategoriesWithCounts() },
  });
  return html;
}

describe('Not-found page', () => {
  it('renders a genuine not-found message', async () => {
    const html = await renderNotFound();
    expect(html).toContain('404');
    expect(html.toLowerCase()).toContain("we can't find that page");
  });

  it('offers a search box', async () => {
    const html = await renderNotFound();
    expect(html).toMatch(/<input id="q" class="input search-input"[^>]*type="search"/);
  });

  it('offers the six Category tiles, in the canonical order', async () => {
    const html = await renderNotFound();
    const names = ['Drinks', 'Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Snacks'];
    const positions = names.map((name) => html.indexOf(name));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('shows no sign-in, add or edit control, and no Draft badge', async () => {
    const html = await renderNotFound();
    const lower = html.toLowerCase();
    expect(lower).not.toContain('sign in');
    expect(lower).not.toContain('add recipe');
    expect(html).not.toContain('badge-draft');
  });
});
