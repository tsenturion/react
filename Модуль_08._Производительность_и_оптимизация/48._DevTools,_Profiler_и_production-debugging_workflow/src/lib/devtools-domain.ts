export type OverviewFocus =
  | 'all'
  | 'devtools'
  | 'profiler'
  | 'browser'
  | 'tracks'
  | 'workflow';

export const overviewCards = [
  {
    id: 'devtools-map',
    focus: 'devtools',
    title: 'Сначала карта дерева',
    summary:
      'React DevTools помогает увидеть границы компонентов, providers, props и частоту обновлений до того, как вы пойдёте глубже в timing.',
  },
  {
    id: 'profiler-commits',
    focus: 'profiler',
    title: 'Потом commit timing',
    summary:
      'React Profiler показывает, какие commits были дорогими, где actualDuration расходится с baseDuration и какой subtree греет CPU.',
  },
  {
    id: 'browser-trace',
    focus: 'browser',
    title: 'Потом browser trace',
    summary:
      'Performance panel нужен там, где проблема может жить не только в React: layout, paint, network, long task и сторонний JavaScript.',
  },
  {
    id: 'tracks',
    focus: 'tracks',
    title: 'Tracks связывают событие и лаг',
    summary:
      'Performance tracks помогают увидеть interaction как цепочку: input, render, commit, network и paint, а не как один размытый таймлайн.',
  },
  {
    id: 'workflow',
    focus: 'workflow',
    title: 'Workflow важнее инструмента',
    summary:
      'Нормальная диагностика идёт от симптома и воспроизводимости к evidence, а не от случайного включения любого профайлера.',
  },
  {
    id: 'anti-toy',
    focus: 'workflow',
    title: 'Не игрушка, а рабочий процесс',
    summary:
      'Даже в учебном проекте расследование должно проходить через реальные сигналы: ререндеры, commit duration, browser trace и candidate fix.',
  },
] as const;

export function parseOverviewFocus(value: string | null): OverviewFocus {
  if (
    value === 'devtools' ||
    value === 'profiler' ||
    value === 'browser' ||
    value === 'tracks' ||
    value === 'workflow'
  ) {
    return value;
  }

  return 'all';
}

export function filterOverviewCardsByFocus(focus: OverviewFocus) {
  if (focus === 'all') {
    return overviewCards;
  }

  return overviewCards.filter((item) => item.focus === focus);
}
