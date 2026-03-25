export type OverviewFocus =
  | 'all'
  | 'action-state'
  | 'status'
  | 'optimistic'
  | 'ux'
  | 'architecture';

type OverviewCard = {
  id: Exclude<OverviewFocus, 'all'>;
  title: string;
  summary: string;
};

const overviewCards: readonly OverviewCard[] = [
  {
    id: 'action-state',
    title: 'useActionState делает submit-result частью формы',
    summary:
      'Вместо отдельного pending/error/success orchestration-кода форма получает следующий state из action и может локально выразить validation, ошибку сервера и успешный итог отправки.',
  },
  {
    id: 'status',
    title: 'useFormStatus раздаёт pending и payload snapshot из ближайшей формы',
    summary:
      'Кнопка, сайдбар или inline status-компонент могут знать, что именно сейчас отправляется, без props drilling и без ручного прокидывания loading-флагов.',
  },
  {
    id: 'optimistic',
    title: 'useOptimistic отделяет ожидаемый UI от подтверждённой сервером истины',
    summary:
      'Вы показываете мгновенный результат заранее, но сохраняете границу между optimistic overlay и реальным подтверждённым состоянием данных.',
  },
  {
    id: 'ux',
    title: 'Pending/error/result UX проектируется как единый поток',
    summary:
      'React 19 hooks полезны не сами по себе, а когда форма явно показывает: отправка началась, что именно сейчас происходит, что подтвердил сервер и что нужно откатить.',
  },
  {
    id: 'architecture',
    title: 'Новая модель уменьшает ручную glue-логику вокруг формы',
    summary:
      'Форма начинает описывать async действие структурой разметки и action-моделью, а не коллекцией отдельной state-машины вокруг onSubmit и effect-синхронизации.',
  },
] as const;

export function parseOverviewFocus(value: string | null): OverviewFocus {
  if (
    value === 'action-state' ||
    value === 'status' ||
    value === 'optimistic' ||
    value === 'ux' ||
    value === 'architecture'
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
