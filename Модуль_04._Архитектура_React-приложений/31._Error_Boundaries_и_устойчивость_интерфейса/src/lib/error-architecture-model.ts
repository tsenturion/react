export type BoundaryLayer = 'widget' | 'section' | 'route' | 'shell';
export type RiskLevel = 'low' | 'medium' | 'high';
export type SharedStateLevel = 'isolated' | 'section' | 'app';
export type CriticalityLevel = 'low' | 'medium' | 'high';

export type ArchitectureInputs = {
  risk: RiskLevel;
  sharedState: SharedStateLevel;
  criticality: CriticalityLevel;
  thirdParty: boolean;
};

export const architectureLayers: readonly {
  id: BoundaryLayer;
  label: string;
  note: string;
}[] = [
  {
    id: 'shell',
    label: 'App shell',
    note: 'Последняя страховка, если локальные boundaries не удержали сбой.',
  },
  {
    id: 'route',
    label: 'Route boundary',
    note: 'Подходит для экранов или страниц с общим источником данных и общим recovery flow.',
  },
  {
    id: 'section',
    label: 'Section boundary',
    note: 'Хороший баланс для нескольких связанных панелей внутри одного экрана.',
  },
  {
    id: 'widget',
    label: 'Widget boundary',
    note: 'Минимальный blast radius для рискованного или стороннего блока.',
  },
] as const;

export function recommendBoundaryPlacement(inputs: ArchitectureInputs) {
  const primaryLayer: BoundaryLayer =
    inputs.thirdParty || inputs.risk === 'high'
      ? 'widget'
      : inputs.sharedState === 'app'
        ? 'route'
        : inputs.sharedState === 'section'
          ? 'section'
          : 'widget';

  const highlightedLayers: BoundaryLayer[] =
    inputs.criticality === 'high' ? [primaryLayer, 'shell'] : [primaryLayer];

  const resetStrategy =
    primaryLayer === 'widget'
      ? 'Retry или remount только проблемного widget.'
      : primaryLayer === 'section'
        ? 'Сброс локальных фильтров, повторный запрос данных или remount секции.'
        : 'Навигация, refetch маршрута или возврат к безопасному route-state.';

  const rationale = [
    inputs.thirdParty
      ? 'Сторонние виджеты стоит изолировать ближе к месту интеграции.'
      : 'Boundary можно ставить выше, потому что поведение полностью под вашим контролем.',
    inputs.sharedState === 'app'
      ? 'У сбоя есть доступ к общему состоянию экрана, поэтому разумно добавить route-level boundary.'
      : 'Сбой можно локализовать ниже, потому что состояние не размазано по всему экрану.',
    inputs.criticality === 'high'
      ? 'Высокая критичность оправдывает shell-safeguard как последнюю линию обороны.'
      : 'Достаточно локализовать сбой рядом с проблемной частью без лишнего глобального fallback.',
  ];

  const blastRadius =
    primaryLayer === 'widget'
      ? 'Теряете только один widget, остальной экран остаётся живым.'
      : primaryLayer === 'section'
        ? 'Теряете один раздел, но маршрут и навигация продолжают работать.'
        : 'Теряете весь текущий маршрут, но app shell и навигация остаются доступны.';

  const antiPattern =
    primaryLayer === 'widget'
      ? 'Не ставьте такой же boundary над каждым примитивом без риска. Иначе вы получите шум без заметной пользы.'
      : primaryLayer === 'section'
        ? 'Не превращайте section boundary в скрытый глобальный контейнер. Если разделы независимы, локализуйте их ниже.'
        : 'Не надейтесь только на route-level boundary, если внутри есть сторонние графики, editors или embed-виджеты.';

  const resilienceScore =
    primaryLayer === 'widget' ? 90 : primaryLayer === 'section' ? 76 : 64;

  return {
    primaryLayer,
    highlightedLayers,
    resetStrategy,
    rationale,
    blastRadius,
    antiPattern,
    resilienceScore:
      inputs.criticality === 'high'
        ? Math.min(resilienceScore + 5, 100)
        : resilienceScore,
  };
}
