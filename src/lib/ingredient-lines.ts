export interface IngredientLine {
  text: string;
  heading: boolean;
}

// An Ingredient line ending in a colon groups what follows it, e.g. "For the sauce:".
export function parseIngredientLines(ingredients: string[]): IngredientLine[] {
  return ingredients.map((text) => ({ text, heading: text.trim().endsWith(':') }));
}
