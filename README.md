# De Re Coquinaria

On the subject of cooking.

A recipe site for me and my girlfriend, created to solve the age-old question of "What's for dinner".
Tailored to our taste buds.

Live site: https://f-jooste.github.io/de-re-coquinaria/

Status: static MVP. Six Recipes, no Hero Photos, no Admin write path yet (see below).

## What's here

Astro renders one static page per Recipe, plus the Category, Tag, home, all-Recipes and 404
pages, from six Recipes checked into `src/data/recipes/` as JSON. Search runs client-side
against a Fuse.js index built from that same data. Every internal link goes through Astro's
base-path helper (`src/lib/base-path.ts`); a lint script fails the build on a hardcoded
internal path, because that's what keeps a later host move a config change instead of a
rewrite.

Every route reads Recipes through the `RecipeSource` interface (`src/lib/recipe-source.ts`),
never through the JSON files directly.

All six Recipes are Published. Draft and Archived are handled in code (filtering, validation,
the 404 fallback for a non-visible slug) and exercised by tests, but nothing in the checked-in
data currently exercises them end to end.

No load-time figure to publish yet since this is only six recipes with no Hero Photos.

## File structure

```
src/
├── components/     Astro components, plus the SearchIsland React island
├── data/recipes/   one JSON file per Recipe
├── layouts/        BaseLayout
├── lib/            RecipeSource, routing, filtering, search, validation
├── pages/          routes: /, /recipes, /recipes/[slug], /categories/[slug], /tags/[slug], 404
└── styles/         global.css

scripts/
└── lint-hardcoded-paths.mjs
```

## Deferred: Supabase and the nightly build

Recipes move into Supabase, a nightly build turns every Published one
into the static pages, and an Admin gets a Live View and a
write path.
