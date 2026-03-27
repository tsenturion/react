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
        note: 'Shell урока сам показывает workflow: карта темы, меню лабораторий и route-aware log снизу.',
      },
      {
        path: 'src/lib/devtools-domain.ts',
        note: 'Здесь лежит карта темы и фокусы overview-страницы.',
      },
      {
        path: 'src/lib/learning-model.ts',
        note: 'Маршруты урока, подписи лабораторий и структура навигации.',
      },
    ],
    snippets: [
      {
        label: 'Overview focus parsing',
        note: 'Overview не хранит лишний state локально: focus живёт в URL, чтобы страница читалась как route-level scenario.',
        code: `export function parseOverviewFocus(value: string | null): OverviewFocus {
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
}`,
      },
      {
        label: 'Lesson route map',
        note: 'Даже shell урока выражает тему через маршруты: инструментальный workflow разбит на отдельные экраны расследования.',
        code: `export const lessonLabs = [
  { id: 'overview', href: '/tooling-overview?focus=all' },
  { id: 'component-tree', href: '/component-tree-analysis' },
  { id: 'react-profiler', href: '/react-profiler-analysis' },
  { id: 'performance-tracks', href: '/performance-tracks' },
  { id: 'production-debug', href: '/production-debug-workflow' },
  { id: 'workflow-playbook', href: '/workflow-playbook' },
] as const;`,
      },
    ],
  },
  'component-tree': {
    files: [
      {
        path: 'src/components/profiling/ComponentTreeLab.tsx',
        note: 'Интерактивный sandbox дерева, render counts и причины лишних sibling updates.',
      },
      {
        path: 'src/lib/component-tree-model.ts',
        note: 'Чистая модель: как tree mode и trigger меняют объяснение проблемы.',
      },
      {
        path: 'src/hooks/useRenderCount.ts',
        note: 'Telemetry-hook для локальной визуализации commits внутри лаборатории.',
      },
    ],
    snippets: [
      {
        label: 'Tree diagnosis',
        note: 'Модель не угадывает оптимизацию, а связывает trigger, ownership и clue для DevTools.',
        code: `export function analyzeComponentTree({ treeMode, trigger, highlightedBranch }) {
  if (treeMode === 'wide-parent') {
    return {
      tone: 'warn',
      headline: 'Обновление поднимается слишком высоко по дереву',
    };
  }

  return {
    tone: 'success',
    headline: 'Источник обновления изолирован рядом с проблемной веткой',
  };
}`,
      },
      {
        label: 'Branch counters',
        note: 'Ветки дерева считаются отдельно, чтобы видно было не только общий render pass, но и конкретный branch hit.',
        code: `function BranchCard({ title, subtitle, tone, children }) {
  const commits = useRenderCount();

  return (
    <div>
      <p>{title}</p>
      <span>{commits} commits</span>
      {children}
    </div>
  );
}`,
      },
    ],
  },
  'react-profiler': {
    files: [
      {
        path: 'src/components/profiling/ReactProfilerLab.tsx',
        note: 'Реальный React Profiler callback, переключение scope и таблица commit feed.',
      },
      {
        path: 'src/lib/profiler-model.ts',
        note: 'Сводка actual/base duration и hotspot explanation.',
      },
      {
        path: 'src/lib/performance-cases-model.ts',
        note: 'Тяжёлый projection workload, который профилируется в лаборатории.',
      },
    ],
    snippets: [
      {
        label: 'Stable profiler callback',
        note: 'Callback стабилизирован и отделён от profiled subtree, чтобы сам журнал commits не ломал эксперимент.',
        code: `const handleRender = useCallback((id, phase, actualDuration, baseDuration, startTime, commitTime) => {
  setCommits((current) => [
    { id, phase, actualDuration, baseDuration, startTime, commitTime, interaction },
    ...current,
  ].slice(0, 8));
}, [interaction]);`,
      },
      {
        label: 'Profiler summary',
        note: 'Сводка сравнивает actualDuration и baseDuration, а не ограничивается одной “медленной” цифрой.',
        code: `export function summarizeProfilerCommits(commits: readonly ProfilerCommit[]) {
  const averageActualDuration =
    commits.reduce((sum, item) => sum + item.actualDuration, 0) / commits.length;
  const slowestCommit = commits.reduce((max, item) =>
    item.actualDuration > max.actualDuration ? item : max,
  );

  return { averageActualDuration, slowestCommit };
}`,
      },
    ],
  },
  'performance-tracks': {
    files: [
      {
        path: 'src/components/profiling/PerformanceTracksLab.tsx',
        note: 'Browser-like trace: input, render, network, commit и paint в одном interaction flow.',
      },
      {
        path: 'src/components/profiling/TrackTimeline.tsx',
        note: 'Timeline lane view для tracks и их относительной стоимости.',
      },
      {
        path: 'src/lib/performance-tracks-model.ts',
        note: 'Сводка по tracks и выбор dominant layer.',
      },
    ],
    snippets: [
      {
        label: 'Trace recording',
        note: 'Лаборатория использует `performance.now`, marks и rAF-переходы, чтобы показать структуру браузерного trace.',
        code: `const renderStart = performance.now();
safeMark('lesson48:render:start');
projectPerformanceCases({ query, area, sort, intensity });
safeMark('lesson48:render:end');
const renderEnd = performance.now();

nextSamples.push({
  id: 'render',
  label: 'React render work',
  kind: 'render',
  startMs: renderStart,
  durationMs: renderEnd - renderStart,
});`,
      },
      {
        label: 'Track summary',
        note: 'Доминантная дорожка сразу переводит таймлайн в hypothesis: React tree, network или browser pipeline.',
        code: `export function summarizeTrackSamples(samples: readonly TrackSample[]) {
  const dominantKind = (Object.entries(totalsByKind) as [TrackKind, number][])
    .sort((left, right) => right[1] - left[1])[0][0];

  return { dominantKind, longestTrack, totalDuration };
}`,
      },
    ],
  },
  'production-debug': {
    files: [
      {
        path: 'src/components/profiling/ProductionDebugLab.tsx',
        note: 'Интегрированная лаборатория symptom → reproduce → profiler evidence → browser evidence.',
      },
      {
        path: 'src/lib/production-debug-model.ts',
        note: 'Scenario presets для production-like расследования.',
      },
      {
        path: 'src/lib/workflow-playbook-model.ts',
        note: 'Правила выбора первого инструмента по evidence, а не по привычке.',
      },
    ],
    snippets: [
      {
        label: 'Scenario preset',
        note: 'Каждый symptom preset задаёт повторяемый сценарий, иначе profiling остаётся шумным и несравнимым.',
        code: `export const scenarioPresets = {
  'typing-lag': { title: 'Typing lag in search', query: 'search', area: 'data' },
  'navigation-stall': { title: 'Navigation stall', query: 'route', area: 'routing' },
  'refresh-spike': { title: 'Refresh spike', query: 'refresh', area: 'network' },
  'mystery-rerender': { title: 'Mystery rerender', query: 'render', area: 'render' },
};`,
      },
      {
        label: 'Workflow evaluation',
        note: 'Итог урока в коде: symptom, trace и profiler evidence сводятся в первую диагностическую рекомендацию.',
        code: `const workflow = evaluateDebugWorkflow({
  symptom: scenario,
  productionOnly,
  profilerShowsSlowCommit,
  browserTraceShowsLongTask,
  networkDominates,
  routeSpecific,
});`,
      },
    ],
  },
  'workflow-playbook': {
    files: [
      {
        path: 'src/components/profiling/WorkflowPlaybookLab.tsx',
        note: 'Интерактивный advisor для выбора DevTools, Profiler или browser trace.',
      },
      {
        path: 'src/lib/workflow-playbook-model.ts',
        note: 'Чистая логика принятия решения по symptom и evidence.',
      },
      {
        path: 'src/lib/learning-model.test.ts',
        note: 'Unit tests предметной логики урока.',
      },
    ],
    snippets: [
      {
        label: 'Decision model',
        note: 'Сначала сеть и long tasks, потом Profiler, и только затем tree-level cleanup. Приоритеты диагностики зашиты прямо в модели.',
        code: `if (networkDominates) {
  return { firstTool: 'Browser Performance + Network', suspectedLayer: 'network' };
}

if (browserTraceShowsLongTask) {
  return { firstTool: 'Browser Performance', suspectedLayer: 'browser' };
}

if (profilerShowsSlowCommit || symptom === 'mystery-rerender') {
  return { firstTool: 'React Profiler', suspectedLayer: 'render tree' };
}`,
      },
    ],
  },
};
