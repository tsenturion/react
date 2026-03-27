export type CatalogProduct = {
  id: string;
  title: string;
  department: 'outerwear' | 'footwear' | 'equipment';
  price: number;
  freshnessScore: number;
  marginClass: 'core' | 'premium';
};

export type CompilerScenario = {
  id: 'manual-memo' | 'compiler-aware' | 'over-memoized';
  label: string;
  commitMs: number;
  rerenders: number;
  note: string;
};

export const catalogProducts: readonly CatalogProduct[] = [
  {
    id: 'p1',
    title: 'Штормовая куртка Aurora',
    department: 'outerwear',
    price: 23990,
    freshnessScore: 96,
    marginClass: 'premium',
  },
  {
    id: 'p2',
    title: 'Утеплённый жилет Summit',
    department: 'outerwear',
    price: 14990,
    freshnessScore: 74,
    marginClass: 'core',
  },
  {
    id: 'p3',
    title: 'Базовый слой Tundra',
    department: 'outerwear',
    price: 6990,
    freshnessScore: 61,
    marginClass: 'core',
  },
  {
    id: 'p4',
    title: 'Кроссовки Drift Trail',
    department: 'footwear',
    price: 13490,
    freshnessScore: 84,
    marginClass: 'core',
  },
  {
    id: 'p5',
    title: 'Ботинки Ridge Expedition',
    department: 'footwear',
    price: 21990,
    freshnessScore: 89,
    marginClass: 'premium',
  },
  {
    id: 'p6',
    title: 'Сандалии Harbor Camp',
    department: 'footwear',
    price: 9590,
    freshnessScore: 52,
    marginClass: 'core',
  },
  {
    id: 'p7',
    title: 'Рюкзак Signal Climbing Pack',
    department: 'equipment',
    price: 17990,
    freshnessScore: 71,
    marginClass: 'premium',
  },
  {
    id: 'p8',
    title: 'Рюкзак Northline Day Pack',
    department: 'equipment',
    price: 11490,
    freshnessScore: 65,
    marginClass: 'core',
  },
  {
    id: 'p9',
    title: 'Горелка Summit Stove Kit',
    department: 'equipment',
    price: 8290,
    freshnessScore: 57,
    marginClass: 'core',
  },
  {
    id: 'p10',
    title: 'Парка Polar Transit',
    department: 'outerwear',
    price: 28990,
    freshnessScore: 98,
    marginClass: 'premium',
  },
  {
    id: 'p11',
    title: 'Флис Cinder Quarter Zip',
    department: 'outerwear',
    price: 10990,
    freshnessScore: 68,
    marginClass: 'core',
  },
  {
    id: 'p12',
    title: 'Подходные кроссовки Granite',
    department: 'footwear',
    price: 14490,
    freshnessScore: 76,
    marginClass: 'premium',
  },
] as const;

export const compilerScenarios: readonly CompilerScenario[] = [
  {
    id: 'manual-memo',
    label: 'Ручная цепочка memo',
    commitMs: 18,
    rerenders: 9,
    note: 'Слишком много ручной мемоизации, сложнее поддержка и слабый выигрыш при изменениях списка.',
  },
  {
    id: 'compiler-aware',
    label: 'Код под React Compiler + transitions',
    commitMs: 9,
    rerenders: 4,
    note: 'Чистые компоненты, вычисляемые данные прямо в рендере и переходы для необязательных обновлений.',
  },
  {
    id: 'over-memoized',
    label: 'Чрезмерная мемоизация',
    commitMs: 14,
    rerenders: 6,
    note: 'Часть работы ушла в обслуживание зависимостей и ухудшила читаемость кода.',
  },
] as const;

export function scoreProductSearch(product: CatalogProduct, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return product.freshnessScore;
  }

  const title = product.title.toLowerCase();
  const startsWith = title.startsWith(normalizedQuery) ? 80 : 0;
  const includes = title.includes(normalizedQuery) ? 35 : 0;

  return startsWith + includes + product.freshnessScore;
}
