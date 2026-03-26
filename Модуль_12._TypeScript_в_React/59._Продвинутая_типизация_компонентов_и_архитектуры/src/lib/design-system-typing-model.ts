export type RecipeTone = 'brand' | 'neutral' | 'danger';
export type RecipeSize = 'sm' | 'md' | 'lg';
export type RecipeEmphasis = 'solid' | 'soft' | 'outline';

type RecipeBase = {
  id: string;
  title: string;
  tone: RecipeTone;
  size: RecipeSize;
  emphasis: RecipeEmphasis;
  icon: 'spark' | 'arrow' | 'shield';
};

export type ActionRecipe = RecipeBase & {
  mode: 'action';
  buttonLabel: string;
};

export type LinkRecipe = RecipeBase & {
  mode: 'link';
  buttonLabel: string;
  href: string;
  external: boolean;
};

export type PrimitiveRecipe = ActionRecipe | LinkRecipe;

export const primitiveRecipes: readonly PrimitiveRecipe[] = [
  {
    id: 'publish',
    title: 'Publish release',
    mode: 'action',
    tone: 'brand',
    size: 'lg',
    emphasis: 'solid',
    icon: 'spark',
    buttonLabel: 'Publish now',
  },
  {
    id: 'docs',
    title: 'Open migration guide',
    mode: 'link',
    tone: 'neutral',
    size: 'md',
    emphasis: 'outline',
    icon: 'arrow',
    buttonLabel: 'Read docs',
    href: 'https://react.dev/learn/typescript',
    external: true,
  },
  {
    id: 'destroy',
    title: 'Delete legacy token',
    mode: 'action',
    tone: 'danger',
    size: 'sm',
    emphasis: 'soft',
    icon: 'shield',
    buttonLabel: 'Remove token',
  },
] as const;

export type PrimitiveRecipeId = (typeof primitiveRecipes)[number]['id'];

export function getPrimitiveRecipe(id: PrimitiveRecipeId): PrimitiveRecipe {
  return primitiveRecipes.find((recipe) => recipe.id === id) ?? primitiveRecipes[0];
}

export function resolveRecipeTokens(recipe: PrimitiveRecipe): readonly string[] {
  const toneToken: Record<RecipeTone, string> = {
    brand: 'bg-sky-700 text-white border-sky-700',
    neutral: 'bg-white text-slate-900 border-slate-300',
    danger: 'bg-rose-100 text-rose-950 border-rose-300',
  };

  const sizeToken: Record<RecipeSize, string> = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  };

  const emphasisToken: Record<RecipeEmphasis, string> = {
    solid: 'shadow-lg',
    soft: 'shadow-sm',
    outline: 'bg-transparent',
  };

  return [toneToken[recipe.tone], sizeToken[recipe.size], emphasisToken[recipe.emphasis]];
}

export function describeRecipe(recipe: PrimitiveRecipe): string {
  return `${recipe.mode} · ${recipe.tone} · ${recipe.size} · ${recipe.emphasis}`;
}

export const recipeUnionSnippet = `type PrimitiveRecipe =
  | (RecipeBase & { mode: 'action'; buttonLabel: string })
  | (RecipeBase & { mode: 'link'; buttonLabel: string; href: string; external: boolean });`;

export const tokenMapSnippet = `const toneToken: Record<RecipeTone, string> = {
  brand: 'bg-sky-700 text-white border-sky-700',
  neutral: 'bg-white text-slate-900 border-slate-300',
  danger: 'bg-rose-100 text-rose-950 border-rose-300',
};`;
