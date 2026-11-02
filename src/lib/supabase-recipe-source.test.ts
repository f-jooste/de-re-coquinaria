import { describe, expect, it } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseRecipeSource } from './supabase-recipe-source';

type Result = { data: unknown; error: { message: string } | null };

// Fake client: every query-builder call chains; awaiting yields the per-table result.
function fakeClient(results: { recipes: Result; categories: Result }): SupabaseClient {
  return {
    from(table: 'recipes' | 'categories') {
      const builder: Record<string, unknown> = {};
      for (const method of ['select', 'eq', 'is', 'order', 'overrideTypes']) builder[method] = () => builder;
      builder.then = (resolve: (r: Result) => unknown) => resolve(results[table]);
      return builder;
    },
  } as unknown as SupabaseClient;
}

const ok = (data: unknown): Result => ({ data, error: null });

describe('SupabaseRecipeSource.create guard', () => {
  it('throws when the Recipes query errors', async () => {
    const client = fakeClient({ recipes: { data: null, error: { message: 'boom' } }, categories: ok([]) });
    await expect(SupabaseRecipeSource.create(client)).rejects.toThrow(/Recipes/);
  });

  it('throws when the Categories query errors', async () => {
    const client = fakeClient({ recipes: ok([]), categories: { data: null, error: { message: 'boom' } } });
    await expect(SupabaseRecipeSource.create(client)).rejects.toThrow(/Categories/);
  });

  it('throws when the Recipes result is null', async () => {
    const client = fakeClient({ recipes: ok(null), categories: ok([]) });
    await expect(SupabaseRecipeSource.create(client)).rejects.toThrow(/null/);
  });

  it('throws when the Categories result is null', async () => {
    const client = fakeClient({ recipes: ok([]), categories: ok(null) });
    await expect(SupabaseRecipeSource.create(client)).rejects.toThrow(/null/);
  });

  it('accepts zero Recipes as an empty site', async () => {
    const client = fakeClient({ recipes: ok([]), categories: ok([]) });
    const source = await SupabaseRecipeSource.create(client);
    expect(source.getAllRecipes()).toEqual([]);
  });
});
