import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import { anonClient, jwtClaims, serviceClient, signedInClient } from './harness';

// Unique per run so a crashed run cannot collide with the next.
const run = crypto.randomUUID().slice(0, 8);
const slug = (s: string) => `rls-${run}-${s}`;
const CAT = slug('c');
const TAG = slug('t');

// Minimal valid recipe row.
const recipe = (s: string, extra: object = {}) => ({ slug: slug(s), title: s, ingredients: ['x'], steps: ['y'], ...extra });
const categoryRow = { slug: CAT, name: 'c', sort_order: 9, tile_bg: '#000' };

const ids = { draft: '', archived: '', published: '' };
const unpublished = () => [ids.draft, ids.archived];
const all = () => Object.values(ids);

let admin: SupabaseClient;
let adminToken: string;
let adminId: string;
const anon = anonClient();
const svc = serviceClient();

beforeAll(async () => {
  ({ client: admin, accessToken: adminToken, userId: adminId } = await signedInClient());
  const must = <T extends { error: unknown }>(r: T): T => {
    if (r.error) throw r.error;
    return r;
  };
  must(await admin.from('categories').insert(categoryRow));
  must(await admin.from('tags').insert({ slug: TAG, name: 't' }));
  const { data } = must(
    await admin
      .from('recipes')
      .insert([
        recipe('draft', { status: 'draft' }),
        recipe('archived', { status: 'published', archived_at: new Date().toISOString() }),
        recipe('published', { status: 'published' }),
      ])
      .select('id, slug'),
  );
  for (const r of data!) ids[r.slug.split('-').pop() as keyof typeof ids] = r.id;
  must(await admin.from('recipe_categories').insert(all().map((id) => ({ recipe_id: id, category_slug: CAT }))));
  must(await admin.from('recipe_tags').insert(all().map((id) => ({ recipe_id: id, tag_slug: TAG }))));
});

afterAll(async () => {
  // Service role cleanup so it works even if the authenticated session or a test broke midway.
  await svc.from('recipes').delete().like('slug', `rls-${run}-%`);
  await svc.from('tags').delete().eq('slug', TAG);
  await svc.from('categories').delete().eq('slug', CAT);
  if (adminId) await svc.auth.admin.deleteUser(adminId);
});

describe('harness sanity', () => {
  it('authenticated session JWT carries the authenticated role', () => {
    expect(jwtClaims(adminToken).role).toBe('authenticated');
  });

  it('canary: service role sees unpublished rows anon cannot, so a service-key harness would be caught', async () => {
    const s = await svc.from('recipes').select('id').in('id', unpublished());
    expect(s.data).toHaveLength(2);
    const a = await anon.from('recipes').select('id').in('id', unpublished());
    expect(a.data).toEqual([]);
    // Authenticated role is not service role: it cannot read auth admin API.
    expect((await admin.auth.admin.listUsers()).error).not.toBeNull();
  });

  it('anonymous signup is disabled', async () => {
    const { error } = await anonClient().auth.signUp({ email: `${slug('x')}@example.test`, password: crypto.randomUUID() });
    expect(error).not.toBeNull();
  });
});

describe('anonymous role', () => {
  it('selecting a Draft returns nothing', async () => {
    const { data, error } = await anon.from('recipes').select('id').eq('id', ids.draft);
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it('selecting an Archived Recipe returns nothing', async () => {
    const { data, error } = await anon.from('recipes').select('id').eq('id', ids.archived);
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it('still sees the Published Recipe', async () => {
    const { data } = await anon.from('recipes').select('id').eq('id', ids.published);
    expect(data).toHaveLength(1);
  });

  it.each(['recipe_categories', 'recipe_tags'] as const)('%s of unpublished Recipes return nothing', async (table) => {
    const { data, error } = await anon.from(table).select('recipe_id').in('recipe_id', unpublished());
    expect(error).toBeNull();
    expect(data).toEqual([]);
    const pub = await anon.from(table).select('recipe_id').eq('recipe_id', ids.published);
    expect(pub.data).toHaveLength(1);
  });

  // Per table: insert row, and an update patch + key per target row. Update/delete under RLS match zero rows, not error.
  type Case = { row: () => object; key: (id: string) => object; patch: object };
  const cases: Record<string, Case> = {
    recipes: { row: () => recipe('anon-new'), key: (id) => ({ id }), patch: { title: 'hacked' } },
    categories: { row: () => ({ ...categoryRow, slug: slug('anon-c') }), key: () => ({ slug: CAT }), patch: { name: 'hacked' } },
    tags: { row: () => ({ slug: slug('anon-t'), name: 't' }), key: () => ({ slug: TAG }), patch: { name: 'hacked' } },
    recipe_categories: {
      row: () => ({ recipe_id: ids.published, category_slug: 'lunch' }),
      key: (id) => ({ recipe_id: id }),
      patch: { category_slug: 'lunch' },
    },
    recipe_tags: {
      row: () => ({ recipe_id: ids.published, tag_slug: 'sweet' }),
      key: (id) => ({ recipe_id: id }),
      patch: { tag_slug: 'sweet' },
    },
  };

  it.each(Object.keys(cases))('insert, update and delete on %s each fail', async (table) => {
    const c = cases[table];
    const before = await svc.from(table).select('*', { count: 'exact', head: true });

    const ins = await anon.from(table).insert(c.row() as never);
    expect(ins.error?.code).toBe('42501'); // RLS/permission denied, not an unrelated constraint failure

    // Targets: every row of every status, not only the visible one.
    for (const id of all()) {
      const upd = await anon.from(table).update(c.patch).match(c.key(id)).select();
      expect(upd.data ?? []).toEqual([]);
      const del = await anon.from(table).delete().match(c.key(id)).select();
      expect(del.data ?? []).toEqual([]);
    }

    // Ground truth: row count unchanged, and no row carries the patch.
    const after = await svc.from(table).select('*', { count: 'exact', head: true });
    expect(after.count).toBe(before.count);
    const patched = Object.entries(c.patch)[0];
    if (table === 'recipes' || table === 'categories' || table === 'tags') {
      const hit = await svc.from(table).select('*', { count: 'exact', head: true }).eq(patched[0], patched[1] as string);
      expect(hit.count).toBe(0);
    } else {
      const hit = await svc.from(table).select('*').in('recipe_id', all()).eq(patched[0], patched[1] as string);
      // Join rows already holding the patched value were seeded by nobody here: fixture rows use CAT / TAG.
      expect(hit.data).toEqual([]);
    }
  });
});

describe('authenticated role (real signed-in session)', () => {
  it('selects a Draft', async () => {
    const { data } = await admin.from('recipes').select('id').eq('id', ids.draft);
    expect(data).toHaveLength(1);
  });

  it('selects an Archived Recipe', async () => {
    const { data } = await admin.from('recipes').select('id').eq('id', ids.archived);
    expect(data).toHaveLength(1);
  });

  it.each(['recipe_categories', 'recipe_tags'] as const)('reads %s of unpublished Recipes', async (table) => {
    const { data } = await admin.from(table).select('recipe_id').in('recipe_id', unpublished());
    expect(data).toHaveLength(2);
  });

  it('insert, update and delete succeed on every table', async () => {
    const ok = (r: { error: unknown; data: unknown[] | null }) => {
      expect(r.error).toBeNull();
      expect(r.data).toHaveLength(1);
    };
    const c2 = slug('auth-c');
    const t2 = slug('auth-t');
    const s = slug('auth-r');
    ok(await admin.from('categories').insert({ ...categoryRow, slug: c2 }).select());
    ok(await admin.from('categories').update({ name: 'c2' }).eq('slug', c2).select());
    ok(await admin.from('tags').insert({ slug: t2, name: 't' }).select());
    ok(await admin.from('tags').update({ name: 't2' }).eq('slug', t2).select());
    const ins = await admin.from('recipes').insert(recipe('auth-r')).select();
    ok(ins);
    const id = ins.data![0].id;
    ok(await admin.from('recipes').update({ title: 'renamed' }).eq('slug', s).select());
    ok(await admin.from('recipe_categories').insert({ recipe_id: id, category_slug: c2 }).select());
    ok(await admin.from('recipe_categories').update({ category_slug: CAT }).eq('recipe_id', id).select());
    ok(await admin.from('recipe_tags').insert({ recipe_id: id, tag_slug: t2 }).select());
    ok(await admin.from('recipe_tags').update({ tag_slug: TAG }).eq('recipe_id', id).select());
    ok(await admin.from('recipe_categories').delete().eq('recipe_id', id).select());
    ok(await admin.from('recipe_tags').delete().eq('recipe_id', id).select());
    ok(await admin.from('recipes').delete().eq('id', id).select());
    ok(await admin.from('tags').delete().eq('slug', t2).select());
    ok(await admin.from('categories').delete().eq('slug', c2).select());
  });
});
