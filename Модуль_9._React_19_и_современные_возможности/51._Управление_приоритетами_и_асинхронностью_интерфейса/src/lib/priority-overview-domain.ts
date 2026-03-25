export type OverviewFocus =
  | 'all'
  | 'urgent'
  | 'transition'
  | 'deferred'
  | 'effect-event'
  | 'activity';

type OverviewCard = {
  id: Exclude<OverviewFocus, 'all'>;
  title: string;
  summary: string;
};

const overviewCards: readonly OverviewCard[] = [
  {
    id: 'urgent',
    title:
      'Urgent и non-urgent обновления живут в одном интерфейсе, но не равны по приоритету',
    summary:
      'Ввод, курсор, immediate feedback и базовые controls должны оставаться срочными. Тяжёлые списки, дополнительные панели и вторичные вычисления можно планировать отдельно.',
  },
  {
    id: 'transition',
    title: 'Transition API помогает снять давление с срочного ввода',
    summary:
      'useTransition нужен там, где интерфейс должен показывать pending для background update. startTransition полезен, когда нужно просто понизить приоритет обновления без отдельного pending-state.',
  },
  {
    id: 'deferred',
    title: 'useDeferredValue даёт отстающее представление, а не дебаунс запросов',
    summary:
      'Deferred value не отменяет запросы и не заменяет throttle. Он позволяет держать input свежим, пока тяжёлое представление догоняет текущий ввод.',
  },
  {
    id: 'effect-event',
    title: 'useEffectEvent отделяет реактивную подписку от актуальной логики реакции',
    summary:
      'Если effect должен оставаться подписанным на внешний источник, но читать свежую тему, фильтр или форматирование, useEffectEvent убирает ложные resubscribe.',
  },
  {
    id: 'activity',
    title:
      'Activity нужен для управления видимостью поддерева без потери его локальной работы',
    summary:
      'Это не замена обычному conditional render по умолчанию. Activity полезен там, где hidden subtree должен сохранить draft, selection или другой локальный прогресс.',
  },
] as const;

export function parseOverviewFocus(value: string | null): OverviewFocus {
  if (
    value === 'urgent' ||
    value === 'transition' ||
    value === 'deferred' ||
    value === 'effect-event' ||
    value === 'activity'
  ) {
    return value;
  }

  return 'all';
}

export function filterOverviewCardsByFocus(focus: OverviewFocus) {
  if (focus === 'all') {
    return overviewCards;
  }

  return overviewCards.filter((item) => item.id === focus);
}
