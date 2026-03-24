export type CostLevel = 'light' | 'medium' | 'heavy';

export function getWorkUnits(level: CostLevel) {
  if (level === 'light') {
    return 400;
  }

  if (level === 'medium') {
    return 1200;
  }

  return 2800;
}

export function diagnoseBottleneckScenario(input: {
  isolatedControls: boolean;
  rowCount: number;
  cost: CostLevel;
  lastInteraction: 'toggle-inspector' | 'change-grid';
}) {
  const rowsTouched =
    input.lastInteraction === 'toggle-inspector' && input.isolatedControls
      ? 0
      : input.rowCount;

  if (input.lastInteraction === 'toggle-inspector' && !input.isolatedControls) {
    return {
      bottleneck: 'wide-rerender',
      rowsTouched,
      headline: 'Лёгкий toggle задевает дорогое поддерево',
      detail:
        'Само действие простое, но оно живёт выше slow grid и поэтому дёргает все тяжёлые строки сразу.',
      firstMove:
        'Изолируйте локальный UI-state рядом с control или вынесите expensive branch ниже.',
    } as const;
  }

  if (input.cost === 'heavy' && rowsTouched > 0) {
    return {
      bottleneck: 'heavy-row',
      rowsTouched,
      headline: 'Каждая строка сама по себе дорогая',
      detail:
        'Даже ожидаемый ререндер ощущается тяжёлым, потому что каждая строка тратит слишком много работы.',
      firstMove:
        'Сначала сократите объём работы внутри строки или уменьшите количество одновременно затронутых rows.',
    } as const;
  }

  return {
    bottleneck: 'contained',
    rowsTouched,
    headline: 'Изменение затрагивает только нужную часть',
    detail:
      'Grid остаётся стабильным, пока меняется локальный control. Это хороший baseline для сравнения.',
    firstMove:
      'Сначала сохраняйте такую локализацию, а потом уже решайте, нужны ли дополнительные оптимизации.',
  } as const;
}
