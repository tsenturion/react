export type ModeId = 'csr' | 'ssr' | 'ssg' | 'streaming';
export type FitLevel = 'low' | 'medium' | 'high';
export type PageIntentId = 'marketing' | 'dashboard' | 'docs' | 'catalog';

export type ModeSimulationInput = {
  pageIntent: PageIntentId;
  networkMs: number;
  serverMs: number;
  dataMs: number;
  jsBootMs: number;
  hydrationMs: number;
};

export type ModeReport = {
  mode: ModeId;
  label: string;
  firstHtmlMs: number;
  contentReadyMs: number;
  interactiveMs: number;
  seoReadiness: FitLevel;
  cacheability: FitLevel;
  serverWork: FitLevel;
  bestFor: string;
  watchout: string;
  score: number;
};

export const pageIntentOptions: readonly {
  id: PageIntentId;
  label: string;
  note: string;
}[] = [
  {
    id: 'marketing',
    label: 'Marketing',
    note: 'Важны индексируемость, быстрый первый контент и агрессивное кэширование.',
  },
  {
    id: 'docs',
    label: 'Docs',
    note: 'Контент меняется не каждую секунду, зато SEO и стабильный HTML очень ценны.',
  },
  {
    id: 'catalog',
    label: 'Catalog',
    note: 'Нужны и SEO, и быстрый shell, и возможность частями поднимать тяжёлые блоки каталога.',
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    note: 'SEO почти не важен, зато есть авторизация, персонализация и тяжёлые интерактивные виджеты.',
  },
] as const;

const intentWeights: Record<PageIntentId, Record<ModeId, number>> = {
  marketing: { csr: 2, ssr: 7, ssg: 9, streaming: 8 },
  docs: { csr: 4, ssr: 7, ssg: 9, streaming: 6 },
  catalog: { csr: 4, ssr: 8, ssg: 6, streaming: 9 },
  dashboard: { csr: 8, ssr: 6, ssg: 3, streaming: 7 },
};

function clampToPositive(value: number): number {
  return Math.max(0, Math.round(value));
}

function inferScore(
  report: Omit<ModeReport, 'score'>,
  input: ModeSimulationInput,
): number {
  const base = intentWeights[input.pageIntent][report.mode];
  const htmlBonus = report.firstHtmlMs <= input.networkMs + 180 ? 2 : 0;
  const interactivityBonus =
    report.interactiveMs <= input.networkMs + input.jsBootMs + 380 ? 2 : 0;
  const seoBonus =
    report.seoReadiness === 'high' && input.pageIntent !== 'dashboard'
      ? 1
      : report.seoReadiness === 'medium'
        ? 0.5
        : 0;
  const serverPenalty =
    report.serverWork === 'high' && input.pageIntent === 'marketing' ? 1 : 0;

  return base + htmlBonus + interactivityBonus + seoBonus - serverPenalty;
}

function buildReport(
  input: ModeSimulationInput,
  draft: Omit<ModeReport, 'score'>,
): ModeReport {
  return {
    ...draft,
    score: inferScore(draft, input),
  };
}

export function compareRenderingModes(input: ModeSimulationInput): ModeReport[] {
  // Это не benchmark браузера, а учебная модель. Она специально держит
  // отдельно момент появления HTML, готовность контента и interactivity,
  // чтобы не сводить выбор режима к одной цифре.
  const csrFirstHtml = clampToPositive(input.networkMs + input.jsBootMs + input.dataMs);
  const ssrFirstHtml = clampToPositive(input.networkMs + input.serverMs + 25);
  const ssgFirstHtml = clampToPositive(Math.max(35, input.networkMs * 0.65));
  const streamingFirstHtml = clampToPositive(
    input.networkMs + Math.max(20, input.serverMs * 0.35),
  );

  const reports: ModeReport[] = [
    buildReport(input, {
      mode: 'csr',
      label: 'CSR',
      firstHtmlMs: csrFirstHtml,
      contentReadyMs: csrFirstHtml,
      interactiveMs: clampToPositive(csrFirstHtml + 40),
      seoReadiness: input.pageIntent === 'dashboard' ? 'medium' : 'low',
      cacheability: 'high',
      serverWork: 'low',
      bestFor:
        'Экранов, где критична клиентская интерактивность, а индексируемость вторична.',
      watchout:
        'До boot клиента полезный контент обычно не виден: первый экран зависит от JS и data fetch.',
    }),
    buildReport(input, {
      mode: 'ssr',
      label: 'SSR',
      firstHtmlMs: ssrFirstHtml,
      contentReadyMs: clampToPositive(ssrFirstHtml + input.dataMs * 0.25),
      interactiveMs: clampToPositive(ssrFirstHtml + input.jsBootMs + input.hydrationMs),
      seoReadiness: 'high',
      cacheability: input.pageIntent === 'dashboard' ? 'low' : 'medium',
      serverWork: 'high',
      bestFor:
        'Контентных и полу-персонализированных экранов, где HTML нужен сразу, а запрос на сервер оправдан.',
      watchout:
        'Каждый запрос тянет серверный рендер и затем full-page hydration на клиенте.',
    }),
    buildReport(input, {
      mode: 'ssg',
      label: 'SSG',
      firstHtmlMs: ssgFirstHtml,
      contentReadyMs: ssgFirstHtml,
      interactiveMs: clampToPositive(ssgFirstHtml + input.jsBootMs + input.hydrationMs),
      seoReadiness: 'high',
      cacheability: 'high',
      serverWork: 'low',
      bestFor:
        'Маркетинговых и документационных экранов, где HTML можно подготовить заранее.',
      watchout:
        'Если данные быстро устаревают, build-time HTML перестаёт совпадать с живым состоянием продукта.',
    }),
    buildReport(input, {
      mode: 'streaming',
      label: 'Streaming SSR',
      firstHtmlMs: streamingFirstHtml,
      contentReadyMs: clampToPositive(
        input.networkMs + input.serverMs + input.dataMs * 0.3,
      ),
      interactiveMs: clampToPositive(
        streamingFirstHtml + input.jsBootMs * 0.7 + input.hydrationMs * 0.65,
      ),
      seoReadiness: 'high',
      cacheability: input.pageIntent === 'dashboard' ? 'low' : 'medium',
      serverWork: 'high',
      bestFor:
        'Больших экранов, где shell нужно показать рано, а тяжёлые секции могут приходить по частям.',
      watchout:
        'Нужны хорошие Suspense boundaries и дисциплина hydration, иначе streaming превращается в хаотичный водопад fallback-ов.',
    }),
  ];

  return reports.sort(
    (left, right) => right.score - left.score || left.firstHtmlMs - right.firstHtmlMs,
  );
}

export function chooseRecommendedMode(reports: readonly ModeReport[]): ModeReport {
  return reports[0];
}

export function formatFitLevel(level: FitLevel): string {
  if (level === 'high') {
    return 'Высокая';
  }

  if (level === 'medium') {
    return 'Средняя';
  }

  return 'Низкая';
}
