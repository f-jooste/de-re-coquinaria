import { createClient } from '@supabase/supabase-js';

// Committed, not a secret: RLS restricts anonymous reads to Published, non-Archived rows (ADR
// 0001), so the anon key is safe to publish and CI has nothing to configure or leak.
export const SUPABASE_URL = 'https://xieqnlyzlprcezhecqly.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_sgHffLzlgVeIMEx8Xd7fFA_BSiZyjGc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
