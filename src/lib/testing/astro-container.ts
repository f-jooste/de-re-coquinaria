import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import reactRenderer from '@astrojs/react/server.js';

// A container able to render pages that host a React island (SearchIsland), not just plain .astro files.
export async function createContainer() {
  const container = await AstroContainer.create();
  container.addServerRenderer({ renderer: reactRenderer, name: '@astrojs/react' });
  return container;
}
