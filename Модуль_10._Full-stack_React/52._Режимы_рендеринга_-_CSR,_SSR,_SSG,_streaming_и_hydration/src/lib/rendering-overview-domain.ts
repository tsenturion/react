export type OverviewFocus =
  | 'all'
  | 'modes'
  | 'hydration'
  | 'streaming'
  | 'debugging'
  | 'architecture';

export type OverviewCard = {
  id: string;
  title: string;
  blurb: string;
  focus: Exclude<OverviewFocus, 'all'>;
  whyItMatters: string;
  typicalFailure: string;
};

export const overviewCards: readonly OverviewCard[] = [
  {
    id: 'html-arrival',
    title: 'Когда пользователь видит первый полезный HTML',
    blurb:
      'CSR ждёт JavaScript, SSR и SSG отдают готовую разметку, а streaming SSR показывает shell раньше полного ответа.',
    focus: 'modes',
    whyItMatters:
      'Это влияет на perceived performance, SEO и на то, какая часть экрана вообще доступна до boot клиента.',
    typicalFailure:
      'Выбрать CSR для контентной страницы и потом компенсировать пустой экран спиннером и тяжёлой клиентской загрузкой.',
  },
  {
    id: 'hydration-contract',
    title: 'Hydration как контракт между сервером и клиентом',
    blurb:
      'После SSR и SSG клиент не рисует страницу с нуля, а пытается присоединиться к уже существующему HTML.',
    focus: 'hydration',
    whyItMatters:
      'Если сервер и клиент вычисляют разную разметку, React не может безопасно продолжить работу без предупреждений и лишних перерисовок.',
    typicalFailure:
      'Рендерить время, случайные значения, browser-only ветки и locale-форматирование прямо в первом проходе без стабилизации.',
  },
  {
    id: 'streaming-boundaries',
    title: 'Streaming и selective hydration',
    blurb:
      'Streaming разбивает ответ на части, а selective hydration даёт приоритет тем поддеревьям, с которыми пользователь уже пытается взаимодействовать.',
    focus: 'streaming',
    whyItMatters:
      'Именно так большой экран перестаёт быть монолитом: shell приходит рано, тяжёлые острова догружаются по мере готовности.',
    typicalFailure:
      'Сделать один общий fallback на весь экран и потерять смысл streaming из-за слишком крупной границы Suspense.',
  },
  {
    id: 'mismatch-debugging',
    title: 'Mismatch debugging как отдельный навык',
    blurb:
      'Проблема не в warning как таковом, а в том, что расхождение обычно указывает на нестабильный initial render и хрупкую архитектуру.',
    focus: 'debugging',
    whyItMatters:
      'Если источник mismatch не локализован, страница может вести себя по-разному при build, SSR, hydration и клиентской навигации.',
    typicalFailure:
      'Лечить warning suppressHydrationWarning без понимания, почему сервер и клиент дают разные значения.',
  },
  {
    id: 'project-structure',
    title: 'Режим рендеринга меняет структуру проекта',
    blurb:
      'Смена CSR на SSR или streaming затрагивает загрузку данных, кэш, границы серверного кода, deployment и сценарии деградации.',
    focus: 'architecture',
    whyItMatters:
      'Это не только про скорость первого экрана, но и про всю схему доставки HTML, данных и interactivity.',
    typicalFailure:
      'Выбрать режим только по моде и потом держать контент, который должен кэшироваться, в per-request серверном рендере без пользы.',
  },
] as const;

export function parseOverviewFocus(value: string | null): OverviewFocus {
  if (
    value === 'modes' ||
    value === 'hydration' ||
    value === 'streaming' ||
    value === 'debugging' ||
    value === 'architecture'
  ) {
    return value;
  }

  return 'all';
}

export function filterOverviewCardsByFocus(
  focus: OverviewFocus,
): readonly OverviewCard[] {
  if (focus === 'all') {
    return overviewCards;
  }

  return overviewCards.filter((card) => card.focus === focus);
}
