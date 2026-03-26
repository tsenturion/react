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
        note: 'Shell урока и route map раскладывают тему на client boundaries, lazy, use(Promise), server Suspense и playbook.',
      },
      {
        path: 'src/lib/suspense-overview-domain.ts',
        note: 'Карточки overview и URL-driven focus для вводной страницы.',
      },
      {
        path: 'src/server/suspense-runtime.tsx',
        note: 'Реальная server-side реализация Suspense и streaming через react-dom/server.',
      },
    ],
    snippets: [
      {
        label: 'Overview focus parsing',
        note: 'Overview хранит фокус в URL, а не во внутреннем локальном состоянии страницы.',
        code: `export function parseOverviewFocus(value: string | null): OverviewFocus {
  if (
    value === 'boundaries' ||
    value === 'lazy' ||
    value === 'use' ||
    value === 'server' ||
    value === 'streaming'
  ) {
    return value;
  }

  return 'all';
}`,
      },
      {
        label: 'Lesson route map',
        note: 'Маршруты урока сразу выражают mental model: client, lazy, use(Promise), server и playbook.',
        code: `export const lessonLabs = [
  { id: 'overview', href: '/suspense-overview?focus=all' },
  { id: 'client', href: '/client-suspense' },
  { id: 'lazy', href: '/lazy-and-suspense' },
  { id: 'use-promise', href: '/use-promise' },
  { id: 'server', href: '/server-suspense-and-streaming' },
  { id: 'playbook', href: '/suspense-playbook' },
] as const;`,
      },
    ],
  },
  client: {
    files: [
      {
        path: 'src/components/suspense-labs/ClientSuspenseLab.tsx',
        note: 'Реальный client-side Suspense с одной общей и с раздельными границами.',
      },
      {
        path: 'src/lib/suspense-resource-store.ts',
        note: 'Ресурсный cache для чтения через use(Promise).',
      },
      {
        path: 'src/lib/suspense-resource-model.ts',
        note: 'Профили экранов и панели с разными временами готовности.',
      },
    ],
    snippets: [
      {
        label: 'Resource reading in render',
        note: 'Компонент не ждёт ресурс в effect, а читает promise прямо в render phase.',
        code: `function ScenePanel({ sceneId, panelId, revision }) {
  const payload = use(readScenePanel(sceneId, panelId, revision));

  return <div>{payload.title}</div>;
}`,
      },
      {
        label: 'Single vs split boundary',
        note: 'Один и тот же набор ресурсов можно ждать либо одной большой, либо несколькими локальными границами.',
        code: `{boundaryMode === 'single' ? (
  <Suspense fallback={<WholeBoardFallback />}>
    <ScenePanel ... />
    <ScenePanel ... />
    <ScenePanel ... />
  </Suspense>
) : (
  panels.map((panel) => (
    <Suspense fallback={<PanelFallback />}>
      <ScenePanel ... />
    </Suspense>
  ))
)}`,
      },
    ],
  },
  lazy: {
    files: [
      {
        path: 'src/components/suspense-labs/LazyBoundaryLab.tsx',
        note: 'React.lazy + Suspense с глобальной и локальными границами.',
      },
      {
        path: 'src/components/suspense-chunks/GlossaryChunk.tsx',
        note: 'Первый lazily loaded chunk урока.',
      },
      {
        path: 'src/components/suspense-chunks/TraceChunk.tsx',
        note: 'Второй lazily loaded chunk урока.',
      },
    ],
    snippets: [
      {
        label: 'Delayed lazy import',
        note: 'Лаборатория намеренно задерживает динамический import, чтобы граница Suspense успела раскрыть fallback.',
        code: `const LazyGlossaryChunk = lazy(() =>
  delayImport(() => import('../suspense-chunks/GlossaryChunk'), 220),
);`,
      },
      {
        label: 'Boundary mode',
        note: 'Глобальная граница проще, но может скрыть уже открытый рядом lazy chunk.',
        code: `{boundaryMode === 'global' ? (
  <Suspense fallback={<ChunkFallback label="Глобальный fallback активен" />}>
    {showGlossary ? <LazyGlossaryChunk /> : null}
    {showTrace ? <LazyTraceChunk /> : null}
  </Suspense>
) : (
  <Suspense fallback={<ChunkFallback label="Glossary chunk грузится" />}>
    <LazyGlossaryChunk />
  </Suspense>
)}`,
      },
    ],
  },
  'use-promise': {
    files: [
      {
        path: 'src/components/suspense-labs/UsePromiseLab.tsx',
        note: 'Лаборатория показывает shared promise cache и раздельное чтение ресурсов.',
      },
      {
        path: 'src/lib/suspense-resource-store.ts',
        note: 'Один promise на общий cache key и отдельные promise для сегментов ресурса.',
      },
      {
        path: 'src/lib/suspense-resource-model.ts',
        note: 'Учебные карточки, которые читаются через use(Promise).',
      },
    ],
    snippets: [
      {
        label: 'Shared bundle read',
        note: 'Два разных компонента читают один и тот же promise по общему cache key.',
        code: `function SharedSummary({ cardId, revision }) {
  const card = use(readStudyCardBundle(cardId, revision));
  return <p>{card.summary}</p>;
}

function SharedServer({ cardId, revision }) {
  const card = use(readStudyCardBundle(cardId, revision));
  return <p>{card.server}</p>;
}`,
      },
      {
        label: 'Segmented read',
        note: 'Раздельные promise дают независимое ожидание, но создают два ресурса вместо одного.',
        code: `function SegmentedPanel({ cardId, segment, revision }) {
  const text = use(readStudyCardSegment(cardId, segment, revision));
  return <p>{text}</p>;
}`,
      },
    ],
  },
  server: {
    files: [
      {
        path: 'src/components/suspense-labs/ServerSuspenseLab.tsx',
        note: 'Интерактивная модель различий между client wait, SSR fallback и streaming SSR.',
      },
      {
        path: 'src/lib/server-suspense-model.ts',
        note: 'Тайминги shell, boundaries и interactivity для серверных сценариев.',
      },
      {
        path: 'src/server/suspense-runtime.tsx',
        note: 'Реальная server-side Suspense реализация на renderToString и renderToReadableStream.',
      },
    ],
    snippets: [
      {
        label: 'Server strategy comparison',
        note: 'Урок сравнивает не один режим, а три разные механики ожидания и reveal.',
        code: `const reports = [
  {
    strategy: 'client-only',
    htmlVisibleMs: networkMs + jsBootMs + slowestData,
  },
  {
    strategy: 'server-suspense',
    htmlVisibleMs: networkMs + serverMs,
  },
  {
    strategy: 'streaming',
    htmlVisibleMs: shellVisibleMs,
  },
];`,
      },
      {
        label: 'Streaming runtime',
        note: 'Серверный урок использует настоящий renderToReadableStream и Suspense boundaries с use(waitPromise).',
        code: `function AsyncSection({ segment }) {
  const text = use(readSegment(segment));
  return <section data-ready={segment.id}>{text}</section>;
}

const stream = await renderToReadableStream(<App />);`,
      },
    ],
  },
  playbook: {
    files: [
      {
        path: 'src/components/suspense-labs/SuspensePlaybookLab.tsx',
        note: 'Интерактивный advisor по выбору suspense-подхода.',
      },
      {
        path: 'src/lib/suspense-playbook-model.ts',
        note: 'Чистая логика выбора между spinner, split boundaries, lazy, use(Promise) и server streaming.',
      },
      {
        path: 'src/lib/learning-model.test.ts',
        note: 'Unit tests для route map и ключевых решений playbook.',
      },
    ],
    snippets: [
      {
        label: 'Playbook decision',
        note: 'Streaming рекомендуется только там, где нужен HTML до JS и экран раскрывается частями.',
        code: `if (scenario.htmlNeededBeforeJs && scenario.serverCanStream && scenario.screenRevealsInParts) {
  return {
    primaryTool: 'server-streaming',
  };
}`,
      },
    ],
  },
};
