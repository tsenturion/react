import type { LabId } from './learning-model';

type ProjectStudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudyByLab: Record<LabId, ProjectStudyEntry> = {
  overview: {
    files: [
      {
        path: 'src/router.tsx',
        note: 'Shell урока сам построен вокруг route-level lazy loading и Suspense вокруг `Outlet`.',
      },
      {
        path: 'src/lib/lazy-loading-domain.ts',
        note: 'Overview cards собраны по практическим сигналам: split points, boundaries и perception.',
      },
      {
        path: 'README.md',
        note: 'README фиксирует, что тема раскрывается через реальные chunks, route split и fallback placement.',
      },
    ],
    snippets: [
      {
        label: 'router.tsx',
        note: 'Страницы урока загружаются как отдельные lazy-chunks, поэтому сам проект выражает тему на уровне роутера.',
        code: `const LazyOverviewPage = lazy(() =>
  delayImport(() => import('./pages/OverviewPage'), 220).then((module) => ({
    default: module.OverviewPage,
  })),
);`,
      },
      {
        label: 'lazy-loading-domain.ts',
        note: 'Карта темы описывает не API сами по себе, а сигналы пользы и рисков.',
        code: `{
  focus: 'fallbacks',
  title: 'Fallback граница управляет тем, что исчезает во время загрузки',
}`,
      },
    ],
  },
  'component-splitting': {
    files: [
      {
        path: 'src/components/lazy-loading/ComponentLazyLab.tsx',
        note: 'Сравнение eager import и `React.lazy` идёт на одном наборе panel и одном shell.',
      },
      {
        path: 'src/components/lazy-chunks/ComponentBundleRadarChunk.tsx',
        note: 'Это реальный split chunk, который приходит только по явному намерению открыть panel.',
      },
      {
        path: 'src/lib/component-split-model.ts',
        note: 'Pure-модель отделяет upfront bundle cost от pay-on-intent режима.',
      },
    ],
    snippets: [
      {
        label: 'ComponentLazyLab.tsx',
        note: 'Lazy component объявлен на уровне модуля, чтобы его identity не пересоздавался на каждом render.',
        code: `const LazyBundleRadar = lazy(() =>
  delayImport(() => import('../lazy-chunks/ComponentBundleRadarChunk'), 900).then(
    (module) => ({ default: module.ComponentBundleRadarChunk }),
  ),
);`,
      },
      {
        label: 'component-split-model.ts',
        note: 'Здесь видно, что выгода split идёт из сценария использования, а не из самого наличия `React.lazy`.',
        code: `if (input.mode === 'eager') {
  return {
    bundleImpact: 'upfront bundle cost',
  };
}`,
      },
    ],
  },
  'route-splitting': {
    files: [
      {
        path: 'src/router.tsx',
        note: 'Route shell держит `Suspense` вокруг `Outlet`, поэтому навигация не сносит весь интерфейс.',
      },
      {
        path: 'src/components/lazy-loading/RouteCodeSplitLab.tsx',
        note: 'Лаборатория связывает текущий router проекта и архитектурные split-стратегии.',
      },
      {
        path: 'src/lib/route-split-model.ts',
        note: 'Модель сравнивает eager router, lazy pages, pages + tools и over-split стратегию.',
      },
    ],
    snippets: [
      {
        label: 'router.tsx',
        note: 'Текущая структура держит shell живым, пока page chunk грузится отдельно.',
        code: `<main className="panel p-6 sm:p-8">
  <Suspense fallback={<RouteChunkFallback pathname={routeKey} />}>
    <Outlet />
  </Suspense>
</main>`,
      },
      {
        label: 'route-split-model.ts',
        note: 'Route split оценивается через shell persistence и ширину fallback, а не только через размер bundle.',
        code: `return {
  fallbackScope: 'main outlet',
  shellPersistence: 'header и навигация остаются на месте',
};`,
      },
    ],
  },
  'suspense-boundaries': {
    files: [
      {
        path: 'src/components/lazy-loading/SuspenseBoundariesLab.tsx',
        note: 'Один и тот же heavy widget проходит через local и global boundary на одном workspace.',
      },
      {
        path: 'src/components/lazy-chunks/BoundaryGlobalChartChunk.tsx',
        note: 'Отдельный chunk для global-сценария позволяет воспроизводить fallback даже после переключения режима.',
      },
      {
        path: 'src/lib/suspense-boundary-model.ts',
        note: 'Pure-модель фиксирует, виден ли shell и насколько широк fallback.',
      },
    ],
    snippets: [
      {
        label: 'SuspenseBoundariesLab.tsx',
        note: 'Разница между local и global boundary выражена прямо в структуре JSX, а не в абстрактном описании.',
        code: `const globalLayout = (
  <Suspense fallback={<GlobalFallback />}>
    <WorkspaceChrome shellNote={shellNote}>{/* ... */}</WorkspaceChrome>
  </Suspense>
);`,
      },
      {
        label: 'suspense-boundary-model.ts',
        note: 'Здесь явно видно, что глобальная boundary скрывает shell, а локальная нет.',
        code: `return {
  fallbackScope: 'whole workspace',
  shellVisible: false,
};`,
      },
    ],
  },
  'progressive-loading': {
    files: [
      {
        path: 'src/components/lazy-loading/ProgressiveLoadingLab.tsx',
        note: 'Три loading-паттерна сравниваются на отдельных lazy chunks, чтобы эффект не исчезал после первого импорта.',
      },
      {
        path: 'src/components/lazy-chunks/ProgressiveShellFirstChunk.tsx',
        note: 'Отдельный chunk для shell-first сценария помогает сравнить UX без кэш-пересечений с другими fallback-pattern.',
      },
      {
        path: 'src/lib/progressive-loading-model.ts',
        note: 'Модель показывает связь между fallback формой, контекстом и риском layout shift.',
      },
    ],
    snippets: [
      {
        label: 'ProgressiveLoadingLab.tsx',
        note: 'Shell-first сохраняет summary снаружи boundary и догружает только тяжёлую визуализацию.',
        code: `<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
  <p className="text-sm font-semibold text-slate-900">Shell metadata stays visible</p>
</div>`,
      },
      {
        label: 'progressive-loading-model.ts',
        note: 'Здесь восприятие интерфейса описано через сохранённый контекст, а не через один "лучший" fallback.',
        code: `case 'shell-first':
  return {
    contextRetention: 'высокое',
    layoutShiftRisk: 'низкий',
  };`,
      },
    ],
  },
  'split-strategy': {
    files: [
      {
        path: 'src/components/lazy-loading/SplitStrategyAdvisorLab.tsx',
        note: 'Финальная decision-lab собирает target, вес payload, частоту использования и fallback scope в одну модель.',
      },
      {
        path: 'src/lib/split-strategy-model.ts',
        note: 'Scoring учитывает не только payload, но и частоту использования, ширину boundary и наличие placeholder.',
      },
      {
        path: 'src/lib/learning-model.test.ts',
        note: 'Unit tests закрепляют крайние cases: heavy rare analytics и tiny always-visible control.',
      },
    ],
    snippets: [
      {
        label: 'split-strategy-model.ts',
        note: 'Split-решение делается как архитектурный score, а не как слепое правило "любой heavy block делите".',
        code: `const score =
  (input.payloadWeight === 'heavy' ? 34 : 4) +
  (input.visitFrequency === 'rare' ? 24 : 0) +
  (input.fallbackScope === 'local' ? 12 : -12);`,
      },
      {
        label: 'SplitStrategyAdvisorLab.tsx',
        note: 'Лаборатория переводит всю тему в реальный trade-off интерфейса.',
        code: `const verdict = evaluateSplitStrategy({
  target,
  payloadWeight,
  visitFrequency,
  fallbackScope,
  needsInstantPaint,
  hasStablePlaceholder,
});`,
      },
    ],
  },
};
