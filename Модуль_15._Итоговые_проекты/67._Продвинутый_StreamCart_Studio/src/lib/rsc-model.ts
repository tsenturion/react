export type BoundaryPreset = {
  id: 'server-first' | 'balanced-islands' | 'client-heavy';
  label: string;
  clientBundleKb: number;
  hydrationPressure: string;
  fit: string;
  nodes: readonly {
    id: string;
    label: string;
    layer: 'server' | 'client';
    asyncMs?: number;
    clientBundleKb?: number;
  }[];
};

export const boundaryPresets: readonly BoundaryPreset[] = [
  {
    id: 'server-first',
    label: 'Server-first витрина',
    clientBundleKb: 66,
    hydrationPressure: 'Низкое: только search, variant picker и sticky cart.',
    fit: 'Лучший выбор для landing и PDP, где контент важнее, чем произвольная клиентская композиция.',
    nodes: [
      {
        id: 'hero',
        label: 'Главный баннер и мерч-копирайт',
        layer: 'server',
        asyncMs: 20,
      },
      { id: 'inventory', label: 'Снимок наличия', layer: 'server', asyncMs: 45 },
      {
        id: 'recommendations',
        label: 'Рекомендованные товары',
        layer: 'server',
        asyncMs: 75,
      },
      {
        id: 'variant-picker',
        label: 'Выбор варианта',
        layer: 'client',
        clientBundleKb: 18,
      },
      { id: 'mini-cart', label: 'Мини-корзина', layer: 'client', clientBundleKb: 21 },
      { id: 'search', label: 'Живой поиск', layer: 'client', clientBundleKb: 27 },
    ],
  },
  {
    id: 'balanced-islands',
    label: 'Сбалансированные islands',
    clientBundleKb: 104,
    hydrationPressure:
      'Среднее: каталог и PDP уже читают в основном с сервера, но островов больше.',
    fit: 'Подходит продуктам, где интерактивные filters и personalization часто видны above the fold.',
    nodes: [
      {
        id: 'hero',
        label: 'Главный баннер и мерч-копирайт',
        layer: 'server',
        asyncMs: 20,
      },
      { id: 'inventory', label: 'Снимок наличия', layer: 'server', asyncMs: 45 },
      { id: 'search', label: 'Живой поиск', layer: 'client', clientBundleKb: 29 },
      { id: 'filters', label: 'Фасетные фильтры', layer: 'client', clientBundleKb: 24 },
      { id: 'mini-cart', label: 'Мини-корзина', layer: 'client', clientBundleKb: 22 },
      { id: 'ugc', label: 'Виджет рейтингов', layer: 'client', clientBundleKb: 29 },
    ],
  },
  {
    id: 'client-heavy',
    label: 'Client-heavy поддерево',
    clientBundleKb: 178,
    hydrationPressure: 'Высокое: почти весь экран ждёт клиентского оживления.',
    fit: 'Оставлять так стоит только для внутренних инструментов, а не для коммерческого входа.',
    nodes: [
      {
        id: 'hero',
        label: 'Контейнер главного баннера',
        layer: 'client',
        clientBundleKb: 28,
      },
      { id: 'inventory', label: 'Виджет наличия', layer: 'client', clientBundleKb: 26 },
      {
        id: 'recommendations',
        label: 'Сетка рекомендаций',
        layer: 'client',
        clientBundleKb: 34,
      },
      { id: 'filters', label: 'Фасетные фильтры', layer: 'client', clientBundleKb: 29 },
      { id: 'mini-cart', label: 'Мини-корзина', layer: 'client', clientBundleKb: 27 },
      { id: 'ugc', label: 'Виджет рейтингов', layer: 'client', clientBundleKb: 34 },
    ],
  },
] as const;

export function findBoundaryPreset(id: BoundaryPreset['id']) {
  return boundaryPresets.find((preset) => preset.id === id) ?? boundaryPresets[0];
}
