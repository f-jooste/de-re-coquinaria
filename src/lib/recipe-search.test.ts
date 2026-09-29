import { describe, expect, it } from 'vitest';
import { createRecipeSearchIndex } from './recipe-search';
import { makeRecipe } from './testing/recipe-fixture';

describe('createRecipeSearchIndex', () => {
  it('returns no results for an empty or blank query', () => {
    const search = createRecipeSearchIndex([makeRecipe({ slug: 'a', title: 'Mango Lassi' })]);
    expect(search('')).toEqual([]);
    expect(search('   ')).toEqual([]);
  });

  it('finds a Recipe by an exact title match', () => {
    const search = createRecipeSearchIndex([makeRecipe({ slug: 'a', title: 'Mango Lassi' })]);
    const results = search('Mango Lassi');
    expect(results).toHaveLength(1);
    expect(results[0].recipe.slug).toBe('a');
    expect(results[0].matchedField).toBe('title');
  });

  it('finds a Recipe by Tag and reports the Tag as the matched field', () => {
    const search = createRecipeSearchIndex([
      makeRecipe({ slug: 'a', title: 'Chickpea Curry', tags: ['weeknight'] }),
    ]);
    const results = search('weeknight');
    expect(results).toHaveLength(1);
    expect(results[0].matchedField).toBe('tags');
  });

  it('finds a Recipe by Ingredient and reports the Ingredient as the matched field', () => {
    const search = createRecipeSearchIndex([
      makeRecipe({ slug: 'a', title: 'Chickpea Curry', ingredients: ['400g coconut milk'] }),
    ]);
    const results = search('coconut milk');
    expect(results).toHaveLength(1);
    expect(results[0].matchedField).toBe('ingredients');
  });

  it('forgives a one- or two-character typo in a title', () => {
    const search = createRecipeSearchIndex([makeRecipe({ slug: 'a', title: 'Chicken Tinga Tacos' })]);
    expect(search('Chiken Tinga Tacos')[0]?.recipe.slug).toBe('a');
    expect(search('Chicken Tnga Tocos')[0]?.recipe.slug).toBe('a');
  });

  it('orders a title match above a Tag match, which outranks an Ingredient match', () => {
    const search = createRecipeSearchIndex([
      makeRecipe({ slug: 'by-ingredient', title: 'Dinner bowl', ingredients: ['salmon fillet'] }),
      makeRecipe({ slug: 'by-tag', title: 'Weeknight plate', tags: ['salmon'] }),
      makeRecipe({ slug: 'by-title', title: 'Salmon miso', tags: [], ingredients: [] }),
    ]);
    const results = search('salmon');
    expect(results.map((result) => result.recipe.slug)).toEqual(['by-title', 'by-tag', 'by-ingredient']);
    expect(results.map((result) => result.matchedField)).toEqual(['title', 'tags', 'ingredients']);
  });

  it('does not search Steps or Notes', () => {
    const search = createRecipeSearchIndex([
      makeRecipe({
        slug: 'a',
        title: 'Chickpea Curry',
        steps: ['Simmer the coconut milk gently for ten minutes.'],
        notes: 'Great with basmati rice on the side.',
      }),
    ]);
    expect(search('basmati')).toEqual([]);
    expect(search('simmer')).toEqual([]);
  });

  it('returns an empty list for a query matching nothing', () => {
    const search = createRecipeSearchIndex([makeRecipe({ slug: 'a', title: 'Mango Lassi' })]);
    expect(search('xylophone quantum')).toEqual([]);
  });
});
