/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// getViteConfig (not defineConfig) so Astro's Vite plugin is active, letting the Container API render .astro files in tests.
export default getViteConfig({
  test: {
    passWithNoTests: true,
    exclude: ['**/node_modules/**', 'tests/rls/**'], // RLS suite needs local Supabase; run via test:rls
  },
});
