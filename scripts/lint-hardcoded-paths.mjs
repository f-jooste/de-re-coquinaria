#!/usr/bin/env node
// Fails if src/ has a hardcoded root-relative href/src (bypasses the base-path helper).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const SRC_DIR = join(import.meta.dirname, '..', 'src');
const EXTENSIONS = new Set(['.astro', '.tsx', '.ts', '.jsx', '.js']);
// href="/foo", src='/bar', ... — a literal leading "/" that isn't "//" (protocol-relative).
const HARDCODED_PATH = /\b(href|src)\s*=\s*(["'])(\/(?!\/)[^"']*)\2/g;

function collectFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return collectFiles(path);
    return EXTENSIONS.has(path.slice(path.lastIndexOf('.'))) ? [path] : [];
  });
}

const violations = [];
for (const file of collectFiles(SRC_DIR)) {
  const contents = readFileSync(file, 'utf8');
  const lines = contents.split('\n');
  lines.forEach((line, index) => {
    for (const match of line.matchAll(HARDCODED_PATH)) {
      violations.push(`${relative(process.cwd(), file)}:${index + 1}: hardcoded path "${match[3]}" — use the base-path helper (src/lib/base-path.ts) instead`);
    }
  });
}

if (violations.length > 0) {
  console.error('Hardcoded internal path(s) found:\n' + violations.join('\n'));
  process.exit(1);
}

console.log('No hardcoded internal paths found.');
