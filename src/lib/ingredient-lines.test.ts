import { describe, expect, it } from 'vitest';
import { parseIngredientLines } from './ingredient-lines';

describe('parseIngredientLines', () => {
  it('marks a colon-suffixed line as a heading', () => {
    const lines = parseIngredientLines(['For the sauce:', '1 tomato']);
    expect(lines).toEqual([
      { text: 'For the sauce:', heading: true },
      { text: '1 tomato', heading: false },
    ]);
  });

  it('marks no line as a heading when none end in a colon', () => {
    const lines = parseIngredientLines(['1 egg', '1 cup flour']);
    expect(lines.every((line) => !line.heading)).toBe(true);
  });
});
