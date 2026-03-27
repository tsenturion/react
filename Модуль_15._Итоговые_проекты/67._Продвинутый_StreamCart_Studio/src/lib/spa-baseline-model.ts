export type BaselineMetric = {
  label: string;
  value: string;
  detail: string;
  tone: 'accent' | 'cool' | 'dark';
};

export type WaterfallStep = {
  label: string;
  startMs: number;
  durationMs: number;
  owner: 'html' | 'js' | 'data';
};

export const spaBaselineMetrics: readonly BaselineMetric[] = [
  {
    label: 'JS shipped on catalog entry',
    value: '272 KB',
    detail:
      'Каталог, фильтры, мини-корзина и часть checkout logic едут одним клиентским пакетом.',
    tone: 'accent',
  },
  {
    label: 'Time to useful product grid',
    value: '2.9 s',
    detail: 'Сначала приходит shell, затем JS, потом клиент делает запрос за товарами.',
    tone: 'dark',
  },
  {
    label: 'Bundle saved after mixed architecture',
    value: '108 KB',
    detail:
      'Read-heavy части переходят в server-first слой и не гидратируются без необходимости.',
    tone: 'cool',
  },
] as const;

export const catalogWaterfall: readonly WaterfallStep[] = [
  { label: 'HTML shell', startMs: 0, durationMs: 130, owner: 'html' },
  { label: 'Main JS bundle', startMs: 130, durationMs: 760, owner: 'js' },
  { label: 'Catalog API request', startMs: 910, durationMs: 460, owner: 'data' },
  { label: 'Recommendations API', startMs: 1370, durationMs: 340, owner: 'data' },
] as const;

export const spaStillFits = [
  'Внутренние fulfillment и merchandising панели.',
  'Repeat-use интерфейсы с длинной клиентской сессией и низкой SEO ценностью.',
  'Интенсивные browser-driven инструменты с drag and drop и офлайн-кешем.',
] as const;

export function getTotalWaterfallTime(steps: readonly WaterfallStep[]) {
  return Math.max(...steps.map((step) => step.startMs + step.durationMs));
}
