import { RecipeSourceBase } from './recipe-source-base';
import { isVisible } from './recipe-filtering';
import { parseRecipe, assertUniqueSlugs } from './recipe-validation';

// Bundled at build time (not read from disk at runtime) so every Recipe's JSON ships with the build.
const recipeModules = import.meta.glob('../data/recipes/*.json', { eager: true, import: 'default' }) as Record<
  string,
  unknown
>;

// Reads local JSON files, one per Recipe, validating each and failing loudly by file and field on breach.
export class JsonRecipeSource extends RecipeSourceBase {
  constructor() {
    const entries = Object.entries(recipeModules)
      .map(([path, raw]) => {
        const file = path.split('/').pop() ?? path;
        return { file, recipe: parseRecipe(file, raw) };
      })
      .sort((a, b) => a.file.localeCompare(b.file));
    assertUniqueSlugs(entries);
    super(entries.map((entry) => entry.recipe).filter(isVisible));
  }
}
