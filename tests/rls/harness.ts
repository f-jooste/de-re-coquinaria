import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Reads a required env var or throws.
const requireEnv = (k: string): string => {
  const v = process.env[k];
  if (!v) throw new Error(`${k} not set; run via \`npm run test:rls\` with local Supabase started`);
  return v;
};

export const API_URL = requireEnv('SUPABASE_URL');
export const ANON_KEY = requireEnv('SUPABASE_ANON_KEY');
const SERVICE_KEY = requireEnv('SUPABASE_SERVICE_ROLE_KEY');

const opts = { auth: { persistSession: false, autoRefreshToken: false } };

// Anon-key client, no session.
export const anonClient = (): SupabaseClient => createClient(API_URL, ANON_KEY, opts);

// Service-role client; bypasses RLS, so only for user admin, ground truth and canary.
export const serviceClient = (): SupabaseClient => createClient(API_URL, SERVICE_KEY, opts);

// Admin-API-created user signed in via anon key; returns the session client, its JWT and user id.
export async function signedInClient(): Promise<{ client: SupabaseClient; accessToken: string; userId: string }> {
  const email = `rls-${crypto.randomUUID()}@example.test`;
  const password = crypto.randomUUID();
  const created = await serviceClient().auth.admin.createUser({ email, password, email_confirm: true });
  if (created.error) throw created.error;
  const client = anonClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || !data.session) throw error ?? new Error('no session');
  return { client, accessToken: data.session.access_token, userId: created.data.user.id };
}

// Decodes a JWT payload without verifying.
export const jwtClaims = (jwt: string): Record<string, unknown> =>
  JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString());
