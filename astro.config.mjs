import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],

  // Sole sub-path location; links must use BASE_URL (src/lib/base-path.ts) so moving host is config-only.
  site: 'https://f-jooste.github.io',
  base: '/de-re-coquinaria',

  // Pinned (not left default) so GH Pages and a future Cloudflare Pages migration resolve URLs identically.
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
