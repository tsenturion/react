export type OverviewFocus =
  | 'all'
  | 'routes'
  | 'components'
  | 'fallbacks'
  | 'perception'
  | 'tradeoffs';

export const lazyLoadingGuideCards = [
  {
    id: 'routes-own-data-and-code',
    focus: 'routes',
    title: 'Маршрут часто становится первым естественным split point',
    summary:
      'Экран сам по себе уже отделён URL, пользовательским сценарием и собственным набором тяжёлых зависимостей.',
    whyItMatters:
      'Когда route chunk грузится отдельно, shell навигации может остаться живым, а первый payload уменьшается без дробления каждой кнопки.',
  },
  {
    id: 'components-should-pay-on-demand',
    focus: 'components',
    title:
      'Тяжёлый widget имеет смысл грузить по намерению, а не на каждый initial paint',
    summary:
      'Редко используемые preview-studio, analytics panel или rich editor лучше живут за local Suspense boundary.',
    whyItMatters:
      'Так интерфейс показывает важный экран сразу, а тяжёлый блок приходит только тогда, когда он действительно нужен.',
  },
  {
    id: 'fallback-scope-is-a-product-decision',
    focus: 'fallbacks',
    title:
      'Fallback граница управляет не только loading UI, но и тем, что исчезает со страницы',
    summary:
      'Глобальная boundary может заменить весь workspace spinner-экраном, хотя реально грузится только один widget.',
    whyItMatters:
      'От placement Suspense зависит, сохранится ли контекст, фокус и ощущение устойчивости интерфейса.',
  },
  {
    id: 'perception-beats-raw-split',
    focus: 'perception',
    title:
      'Пользователь чувствует не размер chunk, а то, что осталось доступным во время ожидания',
    summary:
      'Skeleton, сохранённый layout и быстрый shell часто воспринимаются лучше, чем голый spinner на пустом экране.',
    whyItMatters:
      'Code splitting без продуманного loading UX может сделать приложение формально легче, но субъективно медленнее.',
  },
  {
    id: 'tradeoffs-of-oversplitting',
    focus: 'tradeoffs',
    title: 'Слишком мелкое дробление приносит лишние запросы и сложность orchestration',
    summary:
      'Если разбить tiny-controls и frequently-used widgets на отдельные chunks, сеть и fallback-логика начнут мешать сильнее, чем помогать.',
    whyItMatters:
      'Split стратегия работает только когда она завязана на реальные сценарии, вес зависимостей и частоту использования.',
  },
] as const;

export function parseOverviewFocus(value: string | null): OverviewFocus {
  switch (value) {
    case 'routes':
    case 'components':
    case 'fallbacks':
    case 'perception':
    case 'tradeoffs':
      return value;
    default:
      return 'all';
  }
}

export function filterGuideCardsByFocus(focus: OverviewFocus) {
  if (focus === 'all') {
    return lazyLoadingGuideCards;
  }

  return lazyLoadingGuideCards.filter((item) => item.focus === focus);
}
