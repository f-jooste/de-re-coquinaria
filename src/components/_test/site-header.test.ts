import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import SiteHeader from '../SiteHeader.astro';

async function renderHeader() {
  const container = await AstroContainer.create();
  return container.renderToString(SiteHeader);
}

describe('SiteHeader', () => {
  it('links the logo home through the base-path helper', async () => {
    const html = await renderHeader();
    expect(html).toMatch(/<a class="site-logo" href="[^"]*\/"[^>]*>/);
  });

  it('links to all Recipes and to the Categories, both through the base-path helper', async () => {
    const html = await renderHeader();
    expect(html).toMatch(/href="[^"]*\/recipes\/"[^>]*>All recipes<\/a>/);
    expect(html).toMatch(/href="[^"]*\/#categories"[^>]*>Categories<\/a>/);
  });

  it('shows no sign-in, add or edit control', async () => {
    const html = await renderHeader();
    const lower = html.toLowerCase();
    expect(lower).not.toContain('sign in');
    expect(lower).not.toContain('add recipe');
    expect(lower).not.toContain('log out');
  });
});
