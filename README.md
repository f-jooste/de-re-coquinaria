# De Re Coquinaria

A recipe site for a household of two. Anyone can read it. Exactly two people can write to it,
and there is no way to sign up.

Live site: not yet deployed.

Status: spec complete, implementation not started.

## Why it exists

Our recipes were spread across bookmarks, screenshots, links buried in chat history and one
paper cookbook. Finding something we had cooked before meant remembering where we had put it,
and half the time the link was dead or the recipe sat under a thousand words about the author's
childhood. This holds only the recipes we actually cook, and opens on a phone in a kitchen.

## How it works

Recipes live in Postgres on Supabase. The public site never queries it.

A nightly build reads every Published, non-Archived Recipe and writes one static page per
Recipe, plus the Category, Tag and index pages and a single search-index JSON file. Visitors
get plain static HTML, so page load does not depend on query latency, and the site keeps
working when the free-tier database pauses after a week of inactivity.

Admins are the exception. When a session exists, the same pages render from live database rows
instead of the last build, which is how Drafts become visible and searchable before they are
public. The cost is one full fetch on the first page view per session. There are two Admins, so
that is fine.

One consequence is worth knowing about up front. Publishing a Recipe does not deploy it. It reaches
Visitors at the next nightly build, or sooner if someone triggers the build by hand. That was a
deliberate trade against build minutes on free hosting.

Row-level security in Postgres is the only real authorisation boundary. Anonymous requests can
read Published, non-Archived Recipes and nothing else, including no Tag associations for
anything unpublished. Because the policies do the work, the anon key is publishable and CI
holds no secret.

## Stack

Astro with React islands, TypeScript, Supabase (Postgres, Auth, Storage), deployed to GitHub
Pages under a sub-path.

Every internal link goes through Astro's base-path helper. Hardcoded internal paths are not
allowed, because that one rule is what keeps a later move to Cloudflare Pages a config change
rather than a rewrite.

## Tests

Two seams, deliberately.

Most of the spec is covered by rendering routes against an in-memory Recipe source: Category
listings, Tag filters, ordering, search relevance and typo tolerance, Draft visibility, Slug
stability across a rename. Tests assert on rendered output, never on call counts or component
structure.

The second seam runs against a local Postgres and is blunt on purpose. As the anonymous role,
selecting a Draft returns nothing and every write fails. As an authenticated role, each of
those succeeds. This is separate from the first seam because it is enforced inside the database
and because the anon key is public, so a wrong policy leaks live data.

No end-to-end browser tests. On a two-Admin site they would duplicate the first seam and add
flakiness.

