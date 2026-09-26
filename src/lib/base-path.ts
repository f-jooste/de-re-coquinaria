// Joins a root-relative path with Astro's BASE_URL; the one way internal links are built.
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  return `${base.endsWith('/') ? base : `${base}/`}${path.replace(/^\//, '')}`;
}
