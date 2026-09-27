import { describe, expect, it } from 'vitest';
import { tagSlug, tagDisplayName, distinctTags } from './tags';
import { makeRecipe } from './testing/recipe-fixture';

describe('tagSlug', () => {
  it('lowercases and trims a Tag to its canonical form', () => {
    expect(tagSlug('  Mexican ')).toBe('mexican');
  });
});

describe('tagDisplayName', () => {
  it('capitalises a single-word Tag', () => {
    expect(tagDisplayName('mexican')).toBe('Mexican');
  });

  it('capitalises each hyphen-separated word of a Tag', () => {
    expect(tagDisplayName('make-ahead')).toBe('Make Ahead');
  });

  it('derives the display name from the canonical form regardless of input casing', () => {
    expect(tagDisplayName('MAKE-AHEAD')).toBe('Make Ahead');
  });
});

describe('distinctTags', () => {
  it('collects the distinct canonical Tags across Recipes, alphabetically by Slug', () => {
    const recipes = [
      makeRecipe({ slug: 'a', tags: ['weeknight', 'mexican'] }),
      makeRecipe({ slug: 'b', tags: ['Mexican', 'chicken'] }),
    ];
    expect(distinctTags(recipes)).toEqual([
      { slug: 'chicken', name: 'Chicken' },
      { slug: 'mexican', name: 'Mexican' },
      { slug: 'weeknight', name: 'Weeknight' },
    ]);
  });
});
