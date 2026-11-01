import { defineConfig } from 'vitest/config';

// RLS suite only; needs a running local Supabase (see `npm run test:rls`).
export default defineConfig({ test: { include: ['tests/rls/**/*.test.ts'], fileParallelism: false } });
