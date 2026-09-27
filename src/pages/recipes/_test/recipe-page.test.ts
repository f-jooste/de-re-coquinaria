import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import RecipePage from '../[slug].astro';
import { makeRecipe } from '../../../lib/testing/recipe-fixture';
import { placeholderTile } from '../../../lib/placeholder-tile';
import { InMemoryRecipeSource } from '../../../lib/in-memory-recipe-source';

// Renders the page against a second, in-memory RecipeSource — the one test seam this
// milestone establishes — never against a JSON file.

async function renderRecipe(overrides: Parameters<typeof makeRecipe>[0] = {}) {
  const fixture = makeRecipe(overrides);
  const recipe = new InMemoryRecipeSource([fixture]).getRecipeBySlug(fixture.slug)!;
  const container = await AstroContainer.create();
  const html = await container.renderToString(RecipePage, { props: { recipe } });
  return { html, recipe };
}

describe('Recipe page', () => {
  it('renders the title, breadcrumb, Ingredients, Steps, Categories and Tags', async () => {
    const { html } = await renderRecipe({
      slug: 'chicken-tinga-tacos',
      title: 'Chicken tinga tacos',
      ingredients: ['For the sauce:', '3 ripe tomatoes, quartered'],
      steps: ['Simmer the chicken.', 'Blend the sauce.'],
      categories: ['dinner'],
      tags: ['mexican', 'chicken'],
    });

    expect(html).toContain('Chicken tinga tacos');
    expect(html).toMatch(/Home<\/a>/);
    expect(html).toMatch(/>Dinner<\/a>/);
    expect(html).toContain('Simmer the chicken.');
    expect(html).toContain('3 ripe tomatoes, quartered');
    expect(html).toContain('Mexican');
    expect(html).toContain('Chicken');
  });

  it('links a Tag chip to its canonical lowercase Tag Slug and shows its display name', async () => {
    const { html } = await renderRecipe({ tags: ['Make-Ahead'] });
    expect(html).toMatch(/<a class="chip chip-lg" href="[^"]*\/tags\/make-ahead\/"[^>]*>Make Ahead<\/a>/);
  });

  it('renders a colon-suffixed Ingredient line as a heading', async () => {
    const { html } = await renderRecipe({ ingredients: ['For the sauce:', '1 tomato'] });
    expect(html).toMatch(/<li class="ing-h"[^>]*>For the sauce:<\/li>/);
    expect(html).not.toMatch(/<li class="ing-h"[^>]*>1 tomato<\/li>/);
  });

  it('renders Steps numbered and each in its own list item', async () => {
    const { html } = await renderRecipe({ steps: ['First step.', 'Second step.', 'Third step.'] });
    const matches = html.match(/<li[^>]*><span[^>]*>/g) ?? [];
    expect(matches.length).toBe(3);
    expect(html).toContain('First step.');
    expect(html).toContain('Third step.');
  });

  it('omits the Notes section entirely when there are no Notes', async () => {
    const { html } = await renderRecipe({ notes: null });
    expect(html).not.toContain('Notes');
  });

  it('renders the Notes section when Notes are recorded', async () => {
    const { html } = await renderRecipe({ notes: 'Keeps for three days.' });
    expect(html).toContain('Notes');
    expect(html).toContain('Keeps for three days.');
  });

  it('renders prep time, cook time and servings when recorded', async () => {
    const { html } = await renderRecipe({ prepMinutes: 15, cookMinutes: 30, servings: 4 });
    expect(html).toContain('15 min');
    expect(html).toContain('30 min');
    expect(html).toMatch(/Serves<\/span>[^<]*<strong[^>]*>4<\/strong>/);
  });

  it('renders no empty labels or dangling separators when no times or servings are recorded', async () => {
    const { html } = await renderRecipe({ prepMinutes: null, cookMinutes: null, servings: null });
    expect(html).not.toContain('Prep');
    expect(html).not.toContain('Cook');
    expect(html).not.toContain('Serves');
  });

  it('omits the Tags row when a Recipe carries no Tags', async () => {
    const { html } = await renderRecipe({ tags: [] });
    expect(html).not.toContain('Tags');
  });

  it('renders the initial-letter placeholder tile, coloured from a hash of the title', async () => {
    const { html, recipe } = await renderRecipe({ title: 'Miso salmon' });
    const tile = placeholderTile(recipe.title);
    expect(html).toContain(`background: ${tile.bg}`);
    expect(html).toContain('>M<');
  });

});
