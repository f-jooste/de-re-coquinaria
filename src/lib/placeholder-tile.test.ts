import { describe, expect, it } from 'vitest';
import { placeholderTile } from './placeholder-tile';

describe('placeholderTile', () => {
  it('uses the title\'s first letter, uppercased, as the initial', () => {
    expect(placeholderTile('miso salmon').initial).toBe('M');
  });

  it('is deterministic for the same title', () => {
    expect(placeholderTile('Chicken tinga tacos')).toEqual(placeholderTile('Chicken tinga tacos'));
  });

  it('colours two differently-titled Recipes distinguishably', () => {
    const a = placeholderTile('Chicken tinga tacos');
    const b = placeholderTile('Miso salmon');
    expect(a.bg).not.toBe(b.bg);
  });
});
