import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    passWithNoTests: true, // no tests yet, ticket 02 adds them; else empty suite fails CI
  },
});
