import type { Recipe, RecipeSource } from './recipe-source';
import { distinctTags, type TagWithName } from './tags';

export interface TagRoute {
  params: { slug: string };
  props: { tag: TagWithName; recipes: Recipe[] };
}

// Builds one route per Tag actually carried by a visible Recipe — the open Tag set has no fixed list to iterate.
export function buildTagRoutes(source: RecipeSource): TagRoute[] {
  return distinctTags(source.getAllRecipes()).map((tag) => ({
    params: { slug: tag.slug },
    props: { tag, recipes: source.getRecipesByTag(tag.slug) },
  }));
}
