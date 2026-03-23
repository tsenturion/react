export type ArchitectureInputs = {
  sharedAcrossWidgets: boolean;
  crossScreenReuse: boolean;
  needsRetries: boolean;
  hasMutations: boolean;
  needsFreshnessStrategy: boolean;
};

export function recommendServerStateArchitecture(inputs: ArchitectureInputs) {
  if (
    !inputs.sharedAcrossWidgets &&
    !inputs.crossScreenReuse &&
    !inputs.needsRetries &&
    !inputs.hasMutations &&
    !inputs.needsFreshnessStrategy
  ) {
    return {
      approach: 'Local fetch in component',
      rationale: [
        'Экран простой и не делит данные с другими виджетами.',
        'Retry, invalidation и shared cache пока не нужны.',
        'Дополнительный query layer может быть преждевременной абстракцией.',
      ],
      antiPattern:
        'Не приносите TanStack Query только ради галочки, если экран одноразовый и не растёт.',
      score: 42,
    };
  }

  if (
    inputs.sharedAcrossWidgets ||
    inputs.needsRetries ||
    inputs.needsFreshnessStrategy
  ) {
    return {
      approach: 'TanStack Query layer',
      rationale: [
        'Server data переиспользуется между несколькими UI-потребителями.',
        'Нужны stale strategy, retries и явное управление согласованностью кэша.',
        'Обычный useState/useEffect слой быстро начинает расползаться в ручную оркестрацию.',
      ],
      antiPattern:
        'Не держите shared server data в нескольких локальных состояниях без единого cache layer.',
      score: 88,
    };
  }

  return {
    approach: 'Dedicated server hook',
    rationale: [
      'Данные уже серверные, но сложность ещё умеренная.',
      'Вынесенный hook убирает transport-шум из компонента и готовит почву для дальнейшего роста.',
      'Это промежуточная ступень между inline fetch и полноценным query layer.',
    ],
    antiPattern:
      'Не смешивайте transport details, loading states и UI-композицию в одном компоненте.',
    score: 64,
  };
}
