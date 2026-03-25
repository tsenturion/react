export type DebugSymptom =
  | 'typing-lag'
  | 'navigation-stall'
  | 'refresh-spike'
  | 'mystery-rerender';

export function evaluateDebugWorkflow({
  symptom,
  productionOnly,
  profilerShowsSlowCommit,
  browserTraceShowsLongTask,
  networkDominates,
  routeSpecific,
}: {
  symptom: DebugSymptom;
  productionOnly: boolean;
  profilerShowsSlowCommit: boolean;
  browserTraceShowsLongTask: boolean;
  networkDominates: boolean;
  routeSpecific: boolean;
}) {
  if (networkDominates) {
    return {
      firstTool: 'Browser Performance + Network',
      suspectedLayer: 'network',
      firstQuestion: 'Есть ли waterfall, retries или лишняя перезагрузка данных?',
      nextStep:
        'Сначала локализуйте сетевой бюджет и lifecycle запросов, а уже потом возвращайтесь к React tree.',
    } as const;
  }

  if (browserTraceShowsLongTask) {
    return {
      firstTool: 'Browser Performance',
      suspectedLayer: 'browser',
      firstQuestion:
        'Где именно сидит long task: scripting, layout, paint или сторонний код?',
      nextStep:
        'После trace сузьте проблему до React subtree только если scripting hotspot действительно лежит в компонентном коде.',
    } as const;
  }

  if (profilerShowsSlowCommit || symptom === 'mystery-rerender') {
    return {
      firstTool: 'React Profiler',
      suspectedLayer: routeSpecific ? 'route subtree' : 'render tree',
      firstQuestion: 'Какой commit дорогой и какой subtree в нём доминирует?',
      nextStep:
        'Сопоставьте slow commit с component tree, props/state ownership и шириной render path.',
    } as const;
  }

  return {
    firstTool: productionOnly
      ? 'React DevTools + production telemetry'
      : 'React DevTools',
    suspectedLayer: routeSpecific ? 'route shell' : 'component tree',
    firstQuestion: 'Какие ветки дерева обновляются вообще без нужды?',
    nextStep:
      'Начните с карты дерева и причин ререндера, потом включайте Profiler только на suspect branch.',
  } as const;
}
