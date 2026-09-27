// The closed, ordered Category set. Single source of truth for the validator and every page.
export interface CategoryDefinition {
  slug: string;
  name: string;
  order: number;
  tileBg: string;
}

export const CATEGORIES: readonly CategoryDefinition[] = [
  { slug: 'drinks', name: 'Drinks', order: 0, tileBg: '#D3E3E6' },
  { slug: 'breakfast', name: 'Breakfast', order: 1, tileBg: '#F5E2AE' },
  { slug: 'lunch', name: 'Lunch', order: 2, tileBg: '#DFE8CE' },
  { slug: 'dinner', name: 'Dinner', order: 3, tileBg: '#F3D3C3' },
  { slug: 'desserts', name: 'Desserts', order: 4, tileBg: '#EFD6DF' },
  { slug: 'snacks-and-sides', name: 'Snacks & sides', order: 5, tileBg: '#E3DAEE' },
];

// True when a slug is one of the closed Category set.
export function isCategorySlug(slug: string): boolean {
  return CATEGORIES.some((category) => category.slug === slug);
}

// The display name for a Category slug, or undefined if it is not in the closed set.
export function categoryName(slug: string): string | undefined {
  return CATEGORIES.find((category) => category.slug === slug)?.name;
}
