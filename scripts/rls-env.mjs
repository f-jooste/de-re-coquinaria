// Runs a command with SUPABASE_URL/ANON/SERVICE keys taken from the local `supabase status`.
import { execFileSync, spawnSync } from 'node:child_process';

const out = execFileSync('npx', ['supabase', 'status', '-o', 'env'], { encoding: 'utf8' });
const env = Object.fromEntries(
  out.split('\n').map((l) => l.match(/^(\w+)="?(.*?)"?$/)).filter(Boolean).map((m) => [m[1], m[2]]),
);
const [cmd, ...args] = process.argv.slice(2);
const r = spawnSync(cmd, args, {
  stdio: 'inherit',
  env: {
    ...process.env,
    SUPABASE_URL: env.API_URL,
    SUPABASE_ANON_KEY: env.ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: env.SERVICE_ROLE_KEY,
  },
});
process.exit(r.status ?? 1);
