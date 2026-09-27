import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import TagPage from '../[slug].astro';
import { makeRecipe } from '../../../lib/testing/recipe-fixture';
import { InMemoryRecipeSource } from '../../../lib/in-memory-recipe-source';
import { buildTagRoutes } from '../../../lib/tag-routes';

// Renders the page against a second, in-memory RecipeSource — the one test seam this milestone
// establishes — never against a JSON file.

async function renderTag(overridesList: Parameters<typeof makeRecipe>[0][], tagSlug: string) {
  const source = new InMemoryRecipeSource(overridesList.map((overrides) => makeRecipe(overrides)));
  const route = buildTagRoutes(source).find((r) => r.params.slug === tagSlug)!;
  const container = await AstroContainer.create();
  const html = await container.renderToString(TagPage, { props: route.props });
  return html;
}

describe('Tag page', () => {
  it('renders a breadcrumb back to home and the Tag display name', async () => {
    const html = await renderTag([makeRecipe({ slug: 'a', tags: ['mexican'] })], 'mexican');
    expect(html).toMatch(/Home<\/a>/);
    expect(html).toContain('Mexican');
  });

  it('lists every Recipe carrying that Tag across Categories, newest-first', async () => {
    const html = await renderTag(
      [
        { slug: 'older', title: 'Older dish', createdAt: '2026-01-01T00:00:00.000Z', categories: ['dinner'], tags: ['mexican'] },
        { slug: 'newer', title: 'Newer dish', createdAt: '2026-02-01T00:00:00.000Z', categories: ['lunch'], tags: ['mexican'] },
      ],
      'mexican',
    );
    expect(html.indexOf('Newer dish')).toBeGreaterThanOrEqual(0);
    expect(html.indexOf('Newer dish')).toBeLessThan(html.indexOf('Older dish'));
  });

  it('excludes a Recipe not carrying the Tag', async () => {
    const html = await renderTag(
      [
        makeRecipe({ slug: 'has-tag', title: 'Has tag', tags: ['mexican'] }),
        makeRecipe({ slug: 'no-tag', title: 'No tag', tags: ['other'] }),
      ],
      'mexican',
    );
    expect(html).toContain('Has tag');
    expect(html).not.toContain('No tag');
  });

  it('collapses differently-cased Tags onto the same page', async () => {
    const html = await renderTag(
      [
        makeRecipe({ slug: 'a', title: 'Dish A', tags: ['Mexican'] }),
        makeRecipe({ slug: 'b', title: 'Dish B', tags: ['mexican'] }),
      ],
      'mexican',
    );
    expect(html).toContain('Dish A');
    expect(html).toContain('Dish B');
  });

  it('links a Recipe card to its own Recipe page', async () => {
    const html = await renderTag([makeRecipe({ slug: 'chicken-tinga-tacos', tags: ['mexican'] })], 'mexican');
    expect(html).toMatch(/<a class="card" href="[^"]*\/recipes\/chicken-tinga-tacos\/"/);
  });

  it("shows a card's Category, since a Tag listing crosses Categories where a Category page does not", async () => {
    const html = await renderTag([makeRecipe({ slug: 'a', categories: ['lunch'], tags: ['mexican'] })], 'mexican');
    expect(html).toContain('Lunch');
  });

  it('shows both Categories on a card for a Recipe belonging to two', async () => {
    const html = await renderTag([makeRecipe({ slug: 'a', categories: ['dinner', 'lunch'], tags: ['mexican'] })], 'mexican');
    expect(html).toContain('Dinner · Lunch');
  });
});
