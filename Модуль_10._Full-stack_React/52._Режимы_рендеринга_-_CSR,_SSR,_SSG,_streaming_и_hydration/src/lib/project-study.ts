import type { LabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudyByLab: Record<LabId, StudyEntry> = {
  overview: {
    files: [
      {
        path: 'src/router.tsx',
        note: 'Shell урока и route map показывают, как тема разделена на modes, hydration, streaming, architecture и playbook.',
      },
      {
        path: 'src/lib/rendering-overview-domain.ts',
        note: 'Карточки overview и URL-driven focus для вводной страницы.',
      },
      {
        path: 'src/server/render-mode-runtime.tsx',
        note: 'Реальные server-side функции на react-dom/server, чтобы урок не оставался только визуальной симуляцией.',
      },
    ],
    snippets: [
      {
        label: 'Overview focus parsing',
        note: 'Overview хранит фокус в URL, а не во внутреннем локальном состоянии страницы.',
        code: `export function parseOverviewFocus(value: string | null): OverviewFocus {
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
}`,
      },
      {
        label: 'Lesson route map',
        note: 'Маршруты урока сразу выражают структуру темы: сравнение режимов, mismatch, streaming, архитектура и playbook.',
        code: `export const lessonLabs = [
  { id: 'overview', href: '/rendering-overview?focus=all' },
  { id: 'modes', href: '/mode-comparison' },
  { id: 'hydration', href: '/hydration-debugging' },
  { id: 'streaming', href: '/streaming-and-selective-hydration' },
  { id: 'architecture', href: '/architecture-consequences' },
  { id: 'playbook', href: '/rendering-playbook' },
] as const;`,
      },
    ],
  },
  modes: {
    files: [
      {
        path: 'src/components/render-modes/ModeComparisonLab.tsx',
        note: 'Живая лаборатория сравнивает время первого HTML, готовность контента и interactivity.',
      },
      {
        path: 'src/lib/render-mode-model.ts',
        note: 'Чистая модель сравнения CSR, SSR, SSG и streaming для разных типов экранов.',
      },
      {
        path: 'src/server/render-mode-runtime.tsx',
        note: 'Server-side функции рендеринга, с которыми можно сравнивать клиентскую модель урока.',
      },
    ],
    snippets: [
      {
        label: 'Mode comparison model',
        note: 'У каждого режима считаются first HTML, content ready и interactive, а не только один маркетинговый TTFB.',
        code: `const reports: ModeReport[] = [
  buildReport(input, {
    mode: 'csr',
    firstHtmlMs: input.networkMs + input.jsBootMs + input.dataMs,
  }),
  buildReport(input, {
    mode: 'ssr',
    firstHtmlMs: input.networkMs + input.serverMs + 25,
  }),
  buildReport(input, {
    mode: 'ssg',
    firstHtmlMs: Math.max(35, input.networkMs * 0.65),
  }),
  buildReport(input, {
    mode: 'streaming',
    firstHtmlMs: input.networkMs + Math.max(20, input.serverMs * 0.35),
  }),
];`,
      },
      {
        label: 'Server render entry points',
        note: 'Урок показывает и реальные server APIs, а не только клиентскую таблицу с цифрами.',
        code: `export function renderSsrMarkup(payload: ArticlePayload): string {
  return renderToString(<ArticleMarkup mode="ssr" payload={payload} />);
}

export function renderSsgMarkup(payload: ArticlePayload): string {
  return renderToStaticMarkup(<ArticleMarkup mode="ssg" payload={payload} />);
}`,
      },
    ],
  },
  hydration: {
    files: [
      {
        path: 'src/components/render-modes/HydrationMismatchLab.tsx',
        note: 'UI для mismatch debugging с переключателями нестабильных источников initial render.',
      },
      {
        path: 'src/lib/hydration-model.ts',
        note: 'Чистая модель сравнения server HTML и client first render.',
      },
      {
        path: 'src/server/render-mode-runtime.tsx',
        note: 'Server-side pair rendering для сравнения markup между сервером и клиентом.',
      },
    ],
    snippets: [
      {
        label: 'Mismatch detection',
        note: 'Урок не абстрагирует mismatch как «что-то сломалось», а строит две конкретные версии одного и того же initial render.',
        code: `const serverHtml = renderHydrationPreview(serverNarrative);
const clientHtml = renderHydrationPreview(clientNarrative);

return {
  mismatch: serverHtml !== clientHtml,
  serverHtml,
  clientHtml,
  issues,
};`,
      },
      {
        label: 'Server/client markup pair',
        note: 'В server runtime есть отдельная функция, которая реально сравнивает markup двух проходов.',
        code: `export function renderHydrationPair(server: HydrationPayload, client: HydrationPayload) {
  const serverMarkup = renderToString(<HydrationMarkup payload={server} />);
  const clientMarkup = renderToString(<HydrationMarkup payload={client} />);

  return {
    serverMarkup,
    clientMarkup,
    mismatch: serverMarkup !== clientMarkup,
  };
}`,
      },
    ],
  },
  streaming: {
    files: [
      {
        path: 'src/components/render-modes/StreamingHydrationLab.tsx',
        note: 'Лаборатория показывает порядок streamed chunks и то, как user intent меняет hydration order.',
      },
      {
        path: 'src/lib/streaming-model.ts',
        note: 'Чистая timeline-модель streaming и selective hydration.',
      },
      {
        path: 'src/server/render-mode-runtime.tsx',
        note: 'Реальная потоковая выдача через renderToReadableStream и Suspense.',
      },
    ],
    snippets: [
      {
        label: 'Selective hydration order',
        note: 'User intent меняет порядок гидрации только для выбранной секции, а не для всего экрана.',
        code: `const selectiveOrder =
  params.selectedSegment === 'none'
    ? defaultOrder
    : [
        params.selectedSegment,
        ...defaultOrder.filter((id) => id !== params.selectedSegment),
      ];`,
      },
      {
        label: 'Streaming transcript',
        note: 'В проекте есть реальное чтение web stream, а не только выдуманный лог событий.',
        code: `const stream = await renderToReadableStream(<App />);
const reader = stream.getReader();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const text = decoder.decode(value, { stream: true });
  html += text;
  chunks.push({ offsetMs: Date.now() - startedAt, text });
}`,
      },
    ],
  },
  architecture: {
    files: [
      {
        path: 'src/components/render-modes/ArchitectureConsequencesLab.tsx',
        note: 'Табличная лаборатория показывает, как один и тот же сценарий выглядит для CSR, SSR, SSG и streaming.',
      },
      {
        path: 'src/lib/architecture-consequences-model.ts',
        note: 'Матрицы сценариев и рекомендуемый режим по типу продукта.',
      },
      {
        path: 'README.md',
        note: 'README урока объясняет, почему тема не сводится только к скорости первого экрана.',
      },
    ],
    snippets: [
      {
        label: 'Scenario recommendation',
        note: 'Рекомендация строится по природе продукта, а не по списку API.',
        code: `export const architectureScenarios = [
  {
    id: 'commerce-listing',
    recommendedMode: 'streaming',
    why: 'Streaming помогает показать страницу сразу, не дожидаясь всех секций.',
  },
  {
    id: 'analytics-workspace',
    recommendedMode: 'csr',
  },
] as const;`,
      },
    ],
  },
  playbook: {
    files: [
      {
        path: 'src/components/render-modes/RenderingPlaybookLab.tsx',
        note: 'Интерактивный advisor по выбору режима рендеринга.',
      },
      {
        path: 'src/lib/rendering-playbook-model.ts',
        note: 'Чистая логика выбора между CSR, SSR, SSG и streaming.',
      },
      {
        path: 'src/lib/learning-model.test.ts',
        note: 'Unit tests для route map и ключевых решений playbook.',
      },
    ],
    snippets: [
      {
        label: 'Rendering playbook decision',
        note: 'Streaming рекомендуется только там, где реально нужен ранний shell и есть server-side динамика.',
        code: `if (
  scenario.serverCanStream &&
  scenario.fastShellMatters &&
  (scenario.personalizedAboveFold || scenario.contentChangesPerRequest)
) {
  return {
    primaryMode: 'streaming',
    reason: 'Нужен ранний shell, но часть данных готова позже.',
  };
}`,
      },
    ],
  },
};
