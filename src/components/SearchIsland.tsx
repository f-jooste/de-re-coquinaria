import { useMemo, useState } from 'react';
import { createRecipeSearchIndex, MATCHED_FIELD_LABEL, type SearchResult } from '../lib/recipe-search';
import { placeholderTile } from '../lib/placeholder-tile';
import { withBase } from '../lib/base-path';
import type { Recipe } from '../lib/recipe-source';

interface Props {
  recipes: Recipe[];
}

// One row in the results panel: a Recipe's tile, title and which field it matched on.
function ResultRow({ result }: { result: SearchResult }) {
  const { recipe, matchedField } = result;
  const tile = placeholderTile(recipe.title);
  return (
    <a className="search-result" href={withBase(`/recipes/${recipe.slug}/`)}>
      <span className="search-result-tile" style={{ background: tile.bg, color: tile.fg }}>
        {tile.initial}
      </span>
      <span className="search-result-body">
        <span className="search-result-title">{recipe.title}</span>
        <span className="hint">Matched {MATCHED_FIELD_LABEL[matchedField]}</span>
      </span>
    </a>
  );
}

// The Visitor-facing search island: types into the box, sees Recipes appear, no submit and no page load.
export default function SearchIsland({ recipes }: Props) {
  const [query, setQuery] = useState('');
  const search = useMemo(() => createRecipeSearchIndex(recipes), [recipes]);
  const results = useMemo(() => search(query), [search, query]);
  const isSearching = query.trim().length > 0;

  return (
    <div className="search-box">
      <label htmlFor="q" className="search-label">
        Search recipes
      </label>
      <div className="search-field">
        <svg
          className="search-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id="q"
          className="input search-input"
          type="search"
          autoComplete="off"
          placeholder="Search by title, ingredient or tag"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <p className="hint">Typos are forgiven. Results appear as you type.</p>

      {isSearching && results.length > 0 && (
        <div className="search-results" role="region" aria-label="Search results">
          <div className="sec-label search-results-label">Best match first</div>
          {results.map((result) => (
            <ResultRow key={result.recipe.slug} result={result} />
          ))}
        </div>
      )}

      {isSearching && results.length === 0 && (
        <div className="search-empty">
          <div className="search-empty-title">Nothing matches that yet</div>
          <p className="hint">Try a different spelling, an ingredient, or browse a category below.</p>
        </div>
      )}
    </div>
  );
}
