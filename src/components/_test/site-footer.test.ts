import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import SiteFooter from '../SiteFooter.astro';

async function renderFooter() {
  const container = await AstroContainer.create();
  return container.renderToString(SiteFooter);
}

describe('SiteFooter', () => {
  it('links to all Recipes and to the Categories, both through the base-path helper', async () => {
    const html = await renderFooter();
    expect(html).toMatch(/href="[^"]*\/recipes\/"[^>]*>All recipes<\/a>/);
    expect(html).toMatch(/href="[^"]*\/#categories"[^>]*>Categories<\/a>/);
  });

  it('shows no sign-in control', async () => {
    const html = await renderFooter();
    expect(html.toLowerCase()).not.toContain('sign in');
  });
});
