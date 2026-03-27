export type OverviewFocus =
  | 'all'
  | 'priorities'
  | 'transitions'
  | 'deferred'
  | 'lists'
  | 'tradeoffs';

export const concurrentGuideCards = [
  {
    id: 'urgent-vs-non-urgent',
    focus: 'priorities',
    title: 'Не все обновления должны блокировать ввод одинаково',
    summary:
      'Текст в input и тяжёлый пересчёт списка имеют разную срочность, хотя запускаются одним пользовательским действием.',
    whyItMatters:
      'Concurrent React помогает разделять срочный feedback и несрочную визуальную работу без ручного low-level scheduler-кода.',
  },
  {
    id: 'transition-keeps-intent-clear',
    focus: 'transitions',
    title:
      'Transition нужен там, где можно принять небольшое отставание ради отзывчивости',
    summary:
      'Фильтр, сортировка, таб с аналитикой и тяжёлый search-result могут обновляться как background work.',
    whyItMatters:
      'Так ввод, клик и быстрый UI-feedback остаются плавными, даже если следующий render дорогой.',
  },
  {
    id: 'deferred-value-is-about-consumers',
    focus: 'deferred',
    title: 'useDeferredValue замедляет не input, а потребителя значения ниже по дереву',
    summary:
      'Input обновляется сразу, а тяжёлый subtree получает чуть более позднюю версию значения.',
    whyItMatters:
      'Это особенно полезно для поиска и фильтрации, где список может чуть отстать, но typing должен остаться живым.',
  },
  {
    id: 'heavy-lists-amplify-priority-issues',
    focus: 'lists',
    title: 'Чем шире и тяжелее список, тем заметнее выигрывает разделение приоритетов',
    summary:
      'На маленьком UI concurrent APIs могут почти не ощущаться, а на больших projection и списках эффект становится очевидным.',
    whyItMatters:
      'Поэтому учебные sandboxes темы строятся вокруг search, filtering и list-heavy screens.',
  },
  {
    id: 'concurrent-does-not-replace-architecture',
    focus: 'tradeoffs',
    title: 'Concurrent APIs не исправляют плохую архитектуру автоматически',
    summary:
      'Если bottleneck вызван лишним состоянием, неудачной структурой данных или безумно широкой перерисовкой, одного `startTransition` мало.',
    whyItMatters:
      'Важно сначала понять причину лагов, а уже потом выбирать between `useTransition`, `useDeferredValue` и обычной оптимизацией.',
  },
] as const;

export function parseOverviewFocus(value: string | null): OverviewFocus {
  switch (value) {
    case 'priorities':
    case 'transitions':
    case 'deferred':
    case 'lists':
    case 'tradeoffs':
      return value;
    default:
      return 'all';
  }
}

export function filterGuideCardsByFocus(focus: OverviewFocus) {
  if (focus === 'all') {
    return concurrentGuideCards;
  }

  return concurrentGuideCards.filter((item) => item.focus === focus);
}
