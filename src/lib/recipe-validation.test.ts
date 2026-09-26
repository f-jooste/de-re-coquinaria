import { describe, expect, it } from 'vitest';
import { parseRecipe, assertUniqueSlugs } from './recipe-validation';

function wellFormedRaw(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    slug: 'well-formed',
    title: 'Well formed recipe',
    ingredients: ['1 egg'],
    steps: ['Cook the egg.'],
    prepMinutes: null,
    cookMinutes: null,
    servings: null,
    notes: null,
    heroPath: null,
    status: 'published',
    archivedAt: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    categories: ['dinner'],
    tags: [],
    ...overrides,
  };
}

describe('parseRecipe', () => {
  it('passes a well-formed recipe', () => {
    const recipe = parseRecipe('well-formed.json', wellFormedRaw());
    expect(recipe.slug).toBe('well-formed');
    expect(recipe.title).toBe('Well formed recipe');
  });

  it('fails on an empty title, naming the file and field', () => {
    expect(() => parseRecipe('bad.json', wellFormedRaw({ title: '   ' }))).toThrow(/bad\.json/);
    expect(() => parseRecipe('bad.json', wellFormedRaw({ title: '   ' }))).toThrow(/title/);
  });

  it('fails with no Ingredients, naming the file and field', () => {
    expect(() => parseRecipe('bad.json', wellFormedRaw({ ingredients: [] }))).toThrow(/bad\.json/);
    expect(() => parseRecipe('bad.json', wellFormedRaw({ ingredients: [] }))).toThrow(/ingredients/);
  });

  it('fails with no Steps, naming the file and field', () => {
    expect(() => parseRecipe('bad.json', wellFormedRaw({ steps: [] }))).toThrow(/bad\.json/);
    expect(() => parseRecipe('bad.json', wellFormedRaw({ steps: [] }))).toThrow(/steps/);
  });

  it('fails with no Categories, naming the file and field', () => {
    expect(() => parseRecipe('bad.json', wellFormedRaw({ categories: [] }))).toThrow(/bad\.json/);
    expect(() => parseRecipe('bad.json', wellFormedRaw({ categories: [] }))).toThrow(/categories/);
  });

  it('fails when a Category Slug is outside the closed set, naming the file, field and slug', () => {
    expect(() => parseRecipe('bad.json', wellFormedRaw({ categories: ['brunch'] }))).toThrow(/bad\.json/);
    expect(() => parseRecipe('bad.json', wellFormedRaw({ categories: ['brunch'] }))).toThrow(/brunch/);
  });

  it('fails when servings is zero, matching the schema\'s servings > 0 constraint', () => {
    expect(() => parseRecipe('bad.json', wellFormedRaw({ servings: 0 }))).toThrow(/servings/);
  });

  it('passes prepMinutes and cookMinutes of zero', () => {
    const recipe = parseRecipe('ok.json', wellFormedRaw({ prepMinutes: 0, cookMinutes: 0 }));
    expect(recipe.prepMinutes).toBe(0);
    expect(recipe.cookMinutes).toBe(0);
  });
});

describe('assertUniqueSlugs', () => {
  it('passes when every slug is unique', () => {
    const a = parseRecipe('a.json', wellFormedRaw({ slug: 'a' }));
    const b = parseRecipe('b.json', wellFormedRaw({ slug: 'b' }));
    expect(() => assertUniqueSlugs([{ file: 'a.json', recipe: a }, { file: 'b.json', recipe: b }])).not.toThrow();
  });

  it('fails when two Recipes share a Slug, naming both files', () => {
    const a = parseRecipe('a.json', wellFormedRaw({ slug: 'dup' }));
    const b = parseRecipe('b.json', wellFormedRaw({ slug: 'dup' }));
    expect(() =>
      assertUniqueSlugs([
        { file: 'a.json', recipe: a },
        { file: 'b.json', recipe: b },
      ]),
    ).toThrow(/a\.json/);
    expect(() =>
      assertUniqueSlugs([
        { file: 'a.json', recipe: a },
        { file: 'b.json', recipe: b },
      ]),
    ).toThrow(/b\.json/);
  });
});
