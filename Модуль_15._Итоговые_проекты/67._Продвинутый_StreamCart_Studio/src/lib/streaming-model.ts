export type StreamingPhase = {
  label: string;
  atMs: number;
  detail: string;
};

export type StreamingChoice = {
  mode: 'spa' | 'ssr' | 'streaming';
  firstUsefulHtmlMs: number;
  interactionReadyMs: number;
  note: string;
};

export const streamingTimeline: readonly StreamingPhase[] = [
  {
    label: 'Shell flushed',
    atMs: 110,
    detail: 'Hero, price anchor и навигация уходят сразу в HTML.',
  },
  {
    label: 'Inventory boundary',
    atMs: 210,
    detail: 'Наличие подтягивается отдельно, не блокируя основной контент.',
  },
  {
    label: 'Recommendations boundary',
    atMs: 340,
    detail: 'Вторичный коммерческий блок приезжает последним и не держит первый экран.',
  },
] as const;

export const streamingChoices: readonly StreamingChoice[] = [
  {
    mode: 'spa',
    firstUsefulHtmlMs: 890,
    interactionReadyMs: 1710,
    note: 'Почти весь смысл появляется только после загрузки JS и client fetch.',
  },
  {
    mode: 'ssr',
    firstUsefulHtmlMs: 170,
    interactionReadyMs: 780,
    note: 'HTML приезжает быстро, но вторичные блоки ждут полного server render pass.',
  },
  {
    mode: 'streaming',
    firstUsefulHtmlMs: 110,
    interactionReadyMs: 760,
    note: 'Shell приходит раньше, а slow sections раскрываются независимо друг от друга.',
  },
] as const;
