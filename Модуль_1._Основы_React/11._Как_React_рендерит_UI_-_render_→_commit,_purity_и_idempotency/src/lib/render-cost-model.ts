import type { StatusTone } from './learning-model';

export type RenderCostControls = {
  items: number;
  workPerItem: number;
  extraPasses: number;
  sideEffectsInRender: boolean;
};

export type RenderCostReport = {
  estimatedOperations: number;
  duplicatedSideEffects: number;
  tone: StatusTone;
  summary: string;
  risks: string[];
  snippet: string;
};

export function buildRenderCostReport(controls: RenderCostControls): RenderCostReport {
  const estimatedOperations =
    controls.items * controls.workPerItem * (controls.extraPasses + 1);
  const duplicatedSideEffects = controls.sideEffectsInRender
    ? controls.extraPasses + 1
    : 0;

  return {
    estimatedOperations,
    duplicatedSideEffects,
    tone: controls.sideEffectsInRender ? 'error' : 'warn',
    summary: controls.sideEffectsInRender
      ? 'Если внутри render живёт side effect, каждый лишний проход повторяет его снова.'
      : 'Даже чистый render может стать дорогим, если в нём слишком много тяжёлых вычислений.',
    risks: [
      'Тяжёлые вычисления в render умножаются на каждый повторный вызов компонента.',
      'Side effect внутри render дублируется при каждом дополнительном проходе.',
      'Такие ошибки особенно неприятны, когда render вызывается чаще, чем вы ожидаете.',
    ],
    snippet: [
      'function ExpensivePanel({ items }) {',
      '  const cells = items.map((item) => heavyFormat(item));',
      '',
      '  // плохо: requestCounter += 1 прямо в render',
      '  return <Grid cells={cells} />;',
      '}',
    ].join('\n'),
  };
}
