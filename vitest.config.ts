/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// getViteConfig (not defineConfig) so Astro's Vite plugin is active, letting the Container API render .astro files in tests.
export default getViteConfig({
  test: {
    passWithNoTests: true,
  },
});
