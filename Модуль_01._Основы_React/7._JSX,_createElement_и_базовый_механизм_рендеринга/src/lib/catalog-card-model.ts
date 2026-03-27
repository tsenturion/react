import type { StatusTone } from './learning-model';

export type StockState = 'available' | 'low' | 'sold-out';
export type CardDensity = 'comfortable' | 'compact';
export type PricingMode = 'full' | 'installment';
export type ShowcaseTone = 'balanced' | 'launch' | 'intensive';

export type CardControls = {
  tone: ShowcaseTone;
  stockState: StockState;
  density: CardDensity;
  pricingMode: PricingMode;
  highlightCount: number;
  showBadge: boolean;
};

export type CardViewModel = {
  title: string;
  subtitle: string;
  badgeLabel: string | null;
  badgeClassName: string;
  priceLine: string;
  priceHint: string;
  stockLabel: string;
  stockTone: StatusTone;
  highlights: string[];
  ctaLabel: string;
  ctaDisabled: boolean;
  rootClassName: string;
  buttonClassName: string;
};

export const defaultCardControls: CardControls = {
  tone: 'balanced',
  stockState: 'available',
  density: 'comfortable',
  pricingMode: 'full',
  highlightCount: 3,
  showBadge: true,
};

const toneMeta: Record<
  ShowcaseTone,
  { title: string; subtitle: string; badgeLabel: string; badgeClassName: string }
> = {
  balanced: {
    title: 'Каталог уроков по React',
    subtitle: 'Ровный сценарий для объяснения JSX как описания интерфейса.',
    badgeLabel: 'JSX first',
    badgeClassName: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  },
  launch: {
    title: 'Стартовая витрина курса',
    subtitle: 'Подсветка важных блоков через чистые данные, а не ручные DOM-операции.',
    badgeLabel: 'Запуск',
    badgeClassName: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
  },
  intensive: {
    title: 'Интенсив по базовому рендерингу',
    subtitle: 'Один и тот же UI можно описать JSX или через createElement.',
    badgeLabel: 'Глубокий разбор',
    badgeClassName: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  },
};

const highlightPool = [
  'JSX остаётся выражением JavaScript, а не отдельным шаблонизатором.',
  'Изменение данных меняет описание интерфейса до обновления DOM.',
  'Fragment помогает убрать лишнюю обёртку и сохранить структуру.',
  'Сложные вычисления лучше вынести до возврата JSX.',
  'createElement показывает, что JSX всего лишь удобная запись.',
] as const;

export function buildCardViewModel(controls: CardControls): CardViewModel {
  const tone = toneMeta[controls.tone];
  const isSoldOut = controls.stockState === 'sold-out';

  const priceLine =
    controls.pricingMode === 'full' ? '12 900 ₽ за весь модуль' : '2 150 ₽ / неделя';
  const priceHint =
    controls.pricingMode === 'full'
      ? 'Одна строка описывает уже готовое значение, без сборки DOM вручную.'
      : 'Даже формат цены остаётся просто данными, которые JSX вставляет в структуру.';

  const stockMeta: Record<StockState, { label: string; tone: StatusTone; cta: string }> =
    {
      available: {
        label: 'Доступно прямо сейчас',
        tone: 'success',
        cta: 'Открыть лабораторию',
      },
      low: {
        label: 'Осталось мало мест',
        tone: 'warn',
        cta: 'Забронировать место',
      },
      'sold-out': {
        label: 'Набор закрыт',
        tone: 'error',
        cta: 'Встать в лист ожидания',
      },
    };

  const densityClass =
    controls.density === 'compact' ? 'gap-3 p-4 text-sm' : 'gap-5 p-6 text-[15px]';

  return {
    title: tone.title,
    subtitle: tone.subtitle,
    badgeLabel: controls.showBadge ? tone.badgeLabel : null,
    badgeClassName: tone.badgeClassName,
    priceLine,
    priceHint,
    stockLabel: stockMeta[controls.stockState].label,
    stockTone: stockMeta[controls.stockState].tone,
    highlights: highlightPool.slice(0, controls.highlightCount),
    ctaLabel: stockMeta[controls.stockState].cta,
    ctaDisabled: isSoldOut,
    rootClassName: `flex h-full flex-col rounded-[28px] border border-slate-200 bg-white shadow-lg ${densityClass}`,
    buttonClassName: isSoldOut
      ? 'cursor-not-allowed rounded-2xl bg-slate-200 px-4 py-3 font-semibold text-slate-500'
      : 'rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800',
  };
}

export function summarizeCardViewModel(viewModel: CardViewModel) {
  return {
    rootType: 'article',
    visibleChildren: String(5 + viewModel.highlights.length),
    expressionCount: viewModel.badgeLabel ? '6 выражений' : '5 выражений',
  };
}

const quote = (value: string) => JSON.stringify(value);

export function buildJsxCardSnippet(viewModel: CardViewModel) {
  const badgeBlock = viewModel.badgeLabel
    ? `      <span className="${viewModel.badgeClassName}">${viewModel.badgeLabel}</span>\n`
    : '';
  const highlightLines = viewModel.highlights
    .map((item) => `        <li key={${quote(item)}}>{${quote(item)}}</li>`)
    .join('\n');

  return [
    '<article className={viewModel.rootClassName}>',
    '  <header className="space-y-3">',
    badgeBlock.trimEnd(),
    `    <h3>{${quote(viewModel.title)}}</h3>`,
    `    <p>{${quote(viewModel.subtitle)}}</p>`,
    '  </header>',
    '  <ul>',
    highlightLines,
    '  </ul>',
    '  <footer className="mt-auto flex items-center justify-between gap-3">',
    `    <div><strong>{${quote(viewModel.priceLine)}}</strong><p>{${quote(viewModel.priceHint)}}</p></div>`,
    `    <button disabled={${String(viewModel.ctaDisabled)}}>{${quote(viewModel.ctaLabel)}}</button>`,
    '  </footer>',
    '</article>',
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildCreateElementCardSnippet(viewModel: CardViewModel) {
  return [
    "React.createElement('article', { className: viewModel.rootClassName },",
    "  React.createElement('header', { className: 'space-y-3' },",
    viewModel.badgeLabel
      ? `    React.createElement('span', { className: '${viewModel.badgeClassName}' }, ${quote(viewModel.badgeLabel)}),`
      : '    null,',
    `    React.createElement('h3', null, ${quote(viewModel.title)}),`,
    `    React.createElement('p', null, ${quote(viewModel.subtitle)}),`,
    '  ),',
    "  React.createElement('ul', null, ...viewModel.highlights.map((item) =>",
    "    React.createElement('li', { key: item }, item),",
    '  )),',
    "  React.createElement('footer', { className: 'mt-auto flex items-center justify-between gap-3' }, ...),",
    ')',
  ].join('\n');
}
