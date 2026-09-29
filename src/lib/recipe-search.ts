import Fuse, { type FuseResultMatch, type IFuseOptions } from 'fuse.js';
import type { Recipe } from './recipe-source';

export type MatchedField = 'title' | 'tags' | 'ingredients';

export interface SearchResult {
  recipe: Recipe;
  matchedField: MatchedField;
}

// Title outranks Tag outranks Ingredient; Steps and Notes are absent on purpose — bulk that only produces noisy matches.
const FIELD_PRIORITY: Record<MatchedField, number> = { title: 0, tags: 1, ingredients: 2 };

// The Visitor-facing label for each matched field, shown as "Matched <label>".
export const MATCHED_FIELD_LABEL: Record<MatchedField, string> = { title: 'title', tags: 'tag', ingredients: 'ingredient' };

// Weighted keys express the relevance ladder; threshold tuned tight enough that a short Ingredient word like "salt" doesn't fuzzy-match an unrelated query, loose enough that a one- or two-character title typo still hits.
const FUSE_OPTIONS: IFuseOptions<Recipe> = {
  keys: [
    { name: 'title', weight: 3 },
    { name: 'tags', weight: 2 },
    { name: 'ingredients', weight: 1 },
  ],
  includeMatches: true,
  ignoreLocation: true,
  threshold: 0.35,
};

// The highest-priority field a hit matched on, per the Title > Tag > Ingredient ladder.
function bestMatchedField(matches: ReadonlyArray<FuseResultMatch>): MatchedField {
  let best: MatchedField = 'ingredients';
  for (const match of matches) {
    const key = match.key as MatchedField;
    if (key in FIELD_PRIORITY && FIELD_PRIORITY[key] < FIELD_PRIORITY[best]) best = key;
  }
  return best;
}

// Builds an in-memory Fuse index once per load, re-searched (not rebuilt) on every keystroke; revisit for a build-time index once the collection passes roughly 200 Recipes, the point where shipping every Ingredient and Tag unindexed threatens the two-second load budget.
export function createRecipeSearchIndex(recipes: Recipe[]): (query: string) => SearchResult[] {
  const fuse = new Fuse(recipes, FUSE_OPTIONS);

  return (query: string): SearchResult[] => {
    const trimmed = query.trim();
    if (!trimmed) return [];

    return fuse
      .search(trimmed)
      .map((hit) => ({ recipe: hit.item, matchedField: bestMatchedField(hit.matches ?? []) }))
      .sort((a, b) => FIELD_PRIORITY[a.matchedField] - FIELD_PRIORITY[b.matchedField]);
  };
}
