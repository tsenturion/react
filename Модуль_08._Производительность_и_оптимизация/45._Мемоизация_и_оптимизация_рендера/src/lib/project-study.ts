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
        note: 'Shell урока сразу задаёт рамку темы: стабильность ссылок, списки и цена мемоизации как архитектурный выбор.',
      },
      {
        path: 'src/lib/memoization-domain.ts',
        note: 'Guide cards хранят не API-список, а повторяемые сигналы темы: stability, computation, lists, trade-offs.',
      },
      {
        path: 'README.md',
        note: 'README фиксирует, что `memo`, `useMemo` и `useCallback` рассматриваются как связка, а не как разрозненные приёмы.',
      },
    ],
    snippets: [
      {
        label: 'memoization-domain.ts',
        note: 'Карта темы начинается с вопроса о downstream tree и цене работы, а не с механического перечисления hooks.',
        code: `{
  id: 'lists-first',
  focus: 'lists',
  title: 'На списках цена нестабильных ссылок видна быстрее всего',
}`,
      },
      {
        label: 'router.tsx',
        note: 'Shell урока прямо проговаривает, что мемоизация не заменяет измерение проблемы.',
        code: `<p className="mt-3 text-sm leading-6 text-slate-600">
  Сначала измеряйте downstream cost и стабильность props,
  а не добавляйте memo-hooks по умолчанию.
</p>`,
      },
    ],
  },
  'memo-boundaries': {
    files: [
      {
        path: 'src/components/memoization/MemoBoundariesLab.tsx',
        note: 'Лаборатория сравнивает plain child и memo-child на одном и том же parent render.',
      },
      {
        path: 'src/lib/memo-boundary-model.ts',
        note: 'Модель различает полезный render и avoidable rerender из-за unstable object prop.',
      },
      {
        path: 'src/components/memoization/MemoBoundariesLab.test.tsx',
        note: 'Тест закрепляет, что memo-child держится на stable props, а новый object prop снова пробивает границу.',
      },
    ],
    snippets: [
      {
        label: 'MemoBoundariesLab.tsx',
        note: 'Derived object prop специально сделан отдельным переключателем, чтобы увидеть цену новой ссылки.',
        code: `const derivedConfig = unstableObjectProp
  ? {
      density: 'compact' as const,
      badge: 'same values, new object reference',
    }
  : undefined;`,
      },
      {
        label: 'memo-boundary-model.ts',
        note: 'Если child получает новый object prop, проблема не в memo, а в unstable input contract.',
        code: `if (input.unstableObjectProp) {
  return {
    childShouldRerender: true,
    avoidable: true,
  };
}`,
      },
    ],
  },
  'use-memo': {
    files: [
      {
        path: 'src/components/memoization/UseMemoDerivedLab.tsx',
        note: 'Здесь side-by-side сравниваются direct derive и useMemo derive на одном наборе фильтров.',
      },
      {
        path: 'src/lib/use-memo-model.ts',
        note: 'Pure-модель каталога и projection показывает, что useMemo оправдан около derived object и expensive projection.',
      },
      {
        path: 'src/components/memoization/UseMemoDerivedLab.test.tsx',
        note: 'Тест проверяет, что unrelated shell-state не задевает memoized projection card.',
      },
    ],
    snippets: [
      {
        label: 'UseMemoDerivedLab.tsx',
        note: 'useMemo привязывается только к тем данным, которые реально влияют на projection.',
        code: `const memoProjection = useMemo(
  () => projectCatalog(memoCatalog, { track, minComplexity }),
  [minComplexity, track],
);`,
      },
      {
        label: 'use-memo-model.ts',
        note: 'Projection возвращает не только items, но и operations, чтобы expensive derive был виден в модели урока.',
        code: `return {
  visibleItems,
  operations,
  totalSeats,
  summary: \`\${visibleItems.length} items / \${totalSeats} seats\`,
};`,
      },
    ],
  },
  'use-callback': {
    files: [
      {
        path: 'src/components/memoization/UseCallbackLab.tsx',
        note: 'Лаборатория показывает, как один unstable handler reference размножается по memo-rows.',
      },
      {
        path: 'src/lib/use-callback-model.ts',
        note: 'Модель описывает ширину затронутых rows для parent render и toggle action.',
      },
      {
        path: 'src/components/memoization/UseCallbackLab.test.tsx',
        note: 'Тест фиксирует, что stable callback удерживает memo-row на unrelated shell update.',
      },
    ],
    snippets: [
      {
        label: 'UseCallbackLab.tsx',
        note: 'Стабильный callback живёт в parent один раз, а row передаёт в него собственный id.',
        code: `const stableToggle = useCallback((id: string) => {
  setSelectedIds((current) => toggleId(current, id));
  setLastAction('toggle-item');
}, []);`,
      },
      {
        label: 'use-callback-model.ts',
        note: 'useCallback оправдан именно там, где memo-rows сравнивают props по ссылке.',
        code: `if (!input.usesStableCallback) {
  return {
    affectedRows: 'all-rows',
    headline: 'Parent render заново создаёт обработчик для каждого row',
  };
}`,
      },
    ],
  },
  'list-optimization': {
    files: [
      {
        path: 'src/components/memoization/ListOptimizationLab.tsx',
        note: 'Здесь wide list и optimized list сравниваются вживую на одинаковом query и shell-state.',
      },
      {
        path: 'src/lib/list-optimization-model.ts',
        note: 'Модель считает ожидаемую ширину затронутого списка по типу действия и набору стабильных опор.',
      },
      {
        path: 'src/hooks/useRenderCount.ts',
        note: 'Commit telemetry позволяет видеть локальность rows без нарушения render purity.',
      },
    ],
    snippets: [
      {
        label: 'ListOptimizationLab.tsx',
        note: 'Optimized board собирает полезную связку целиком: memo rows, stable callback и memoized visible slice.',
        code: `const visibleItems = useMemo(() => filterItems(query), [query]);
const stableToggle = useCallback((id: string) => {
  setSelectedIds((current) => toggleId(current, id));
  onInteraction('toggle-row');
}, [onInteraction]);`,
      },
      {
        label: 'list-optimization-model.ts',
        note: 'При unrelated shell update оптимизированный список должен затрагивать ноль rows.',
        code: `if (input.memoRows && input.stableCallbacks && input.memoizedVisibleIds) {
  return {
    touchedRows: input.action === 'toggle-row' ? 1 : 0,
  };
}`,
      },
    ],
  },
  'cost-tradeoffs': {
    files: [
      {
        path: 'src/components/memoization/MemoCostAdvisorLab.tsx',
        note: 'Advisor переводит тему в архитектурную decision model вместо лозунга "везде добавьте useMemo".',
      },
      {
        path: 'src/lib/memo-cost-model.ts',
        note: 'Модель учитывает lag, стоимость работы, ширину tree, риск dependencies и факт измерения.',
      },
      {
        path: 'src/lib/learning-model.test.ts',
        note: 'Unit tests фиксируют, что trivial/unmeasured case и heavy/measured case дают разные verdicts.',
      },
    ],
    snippets: [
      {
        label: 'memo-cost-model.ts',
        note: 'Вердикт зависит не от самого наличия expensive code, а от совокупности сигналов и риска усложнения.',
        code: `const score =
  (input.lagSeverity === 'high' ? 35 : 0) +
  (input.computationCost === 'heavy' ? 25 : 0) +
  (input.childBreadth === 'list' ? 20 : 0) -
  (input.dependencyRisk ? 18 : 0);`,
      },
      {
        label: 'MemoCostAdvisorLab.tsx',
        note: 'Итог урока подаётся не как догма, а как decision aid для реального интерфейса.',
        code: `const verdict = evaluateMemoizationNeed({
  lagSeverity,
  computationCost,
  childBreadth,
  unstableProps,
  dependencyRisk,
  alreadyMeasured,
});`,
      },
    ],
  },
};
