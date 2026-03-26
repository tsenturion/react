export type ComparisonScenarioId =
  | 'dashboard-filter'
  | 'editor-toolbar'
  | 'inspector-table';

export type ComparisonInput = {
  readonly scenarioId: ComparisonScenarioId;
  readonly dataSize: 'small' | 'medium' | 'large';
  readonly parentChurn: 'low' | 'medium' | 'high';
};

export type StrategyReport = {
  readonly id: 'manual' | 'compiler-ready' | 'over-memoized';
  readonly label: string;
  readonly rerenders: number;
  readonly avgCommitMs: number;
  readonly codeNoise: 'low' | 'medium' | 'high';
  readonly compilerFit: 'strong' | 'partial' | 'poor';
  readonly summary: string;
  readonly recommendation?: 'recommended' | 'watch';
};

type ScenarioMeta = {
  readonly id: ComparisonScenarioId;
  readonly label: string;
  readonly blurb: string;
  readonly baseRerenders: number;
  readonly baseCommitMs: number;
  readonly manualSnippet: string;
  readonly compilerReadySnippet: string;
  readonly manualMemoStillUseful: readonly string[];
};

const scenarioMetaById: Record<ComparisonScenarioId, ScenarioMeta> = {
  'dashboard-filter': {
    id: 'dashboard-filter',
    label: 'Dashboard filters',
    blurb:
      'Родитель часто пересобирает filter panel и summary widgets, хотя большая часть дочернего дерева не меняется логически.',
    baseRerenders: 18,
    baseCommitMs: 34,
    manualSnippet: `const visibleCards = useMemo(
  () => filterCards(cards, query, onlyErrors),
  [cards, query, onlyErrors],
);

const handleToggle = useCallback((next: boolean) => {
  setOnlyErrors(next);
}, []);`,
    compilerReadySnippet: `const visibleCards = filterCards(cards, query, onlyErrors);

function handleToggle(next: boolean) {
  setOnlyErrors(next);
}`,
    manualMemoStillUseful: [
      'Если тяжёлая функция вызывается вне React tree и должна кэшироваться по нескольким несвязанным ключам.',
      'Если сторонняя библиотека требует стабильный callback identity как часть своего API контракта.',
    ],
  },
  'editor-toolbar': {
    id: 'editor-toolbar',
    label: 'Editor toolbar',
    blurb:
      'Основной шум идёт от частых input updates, а toolbar и preview получают одинаковые props, но повторно рендерятся из-за parent churn.',
    baseRerenders: 22,
    baseCommitMs: 28,
    manualSnippet: `const toolbarActions = useMemo(
  () => buildToolbarActions(mode, permissions),
  [mode, permissions],
);

const handleSubmit = useCallback(() => {
  submitDraft(draftId);
}, [draftId]);`,
    compilerReadySnippet: `const toolbarActions = buildToolbarActions(mode, permissions);

function handleSubmit() {
  submitDraft(draftId);
}`,
    manualMemoStillUseful: [
      'Если toolbar actions нужно переиспользовать и вне React, например в command palette registry.',
      'Если expensive derived data вычисляется отдельно от render и живёт дольше одного commit.',
    ],
  },
  'inspector-table': {
    id: 'inspector-table',
    label: 'Inspector table',
    blurb:
      'Проблема проявляется в плотном списке строк: parent state меняется часто, а таблица реагирует на каждый commit.',
    baseRerenders: 30,
    baseCommitMs: 46,
    manualSnippet: `const rows = useMemo(
  () => buildRows(records, search, selectedTags),
  [records, search, selectedTags],
);

const Row = memo(function Row(props) {
  return <InspectorRow {...props} />;
});`,
    compilerReadySnippet: `const rows = buildRows(records, search, selectedTags);

function Row(props: RowProps) {
  return <InspectorRow {...props} />;
}`,
    manualMemoStillUseful: [
      'Если таблица всё равно слишком большая и нуждается в windowing/virtualization.',
      'Если row-level memoization строится вокруг стороннего grid API с собственным comparator contract.',
    ],
  },
};

const dataSizeMultiplier = {
  small: 0.85,
  medium: 1,
  large: 1.3,
} as const;

const churnMultiplier = {
  low: 0.85,
  medium: 1,
  high: 1.25,
} as const;

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

export function getComparisonScenario(scenarioId: ComparisonScenarioId): ScenarioMeta {
  return scenarioMetaById[scenarioId];
}

export function buildComparisonReport(input: ComparisonInput): readonly StrategyReport[] {
  const scenario = getComparisonScenario(input.scenarioId);
  const scale = dataSizeMultiplier[input.dataSize] * churnMultiplier[input.parentChurn];
  const baselineRerenders = scenario.baseRerenders * scale;
  const baselineCommitMs = scenario.baseCommitMs * scale;

  return [
    {
      id: 'manual',
      label: 'Manual memoization',
      rerenders: Math.max(2, Math.round(baselineRerenders * 0.62)),
      avgCommitMs: round(baselineCommitMs * 0.71),
      codeNoise: 'high',
      compilerFit: 'partial',
      summary:
        'Даёт выигрыш, но тащит за собой зависимости, memo wrappers и риск stale logic вокруг callbacks.',
      recommendation: 'watch',
    },
    {
      id: 'compiler-ready',
      label: 'Compiler-friendly code',
      rerenders: Math.max(2, Math.round(baselineRerenders * 0.59)),
      avgCommitMs: round(baselineCommitMs * 0.67),
      codeNoise: 'low',
      compilerFit: 'strong',
      summary:
        'Почти тот же выигрыш, что и при ручной мемоизации, но без лишней клейкой инфраструктуры вокруг props identity.',
      recommendation: 'recommended',
    },
    {
      id: 'over-memoized',
      label: 'Memo everywhere',
      rerenders: Math.max(2, Math.round(baselineRerenders * 0.57)),
      avgCommitMs: round(baselineCommitMs * 0.69),
      codeNoise: 'high',
      compilerFit: 'poor',
      summary:
        'Числа выглядят похоже, но стоимость чтения кода, поддержки dependencies и дебага выше, чем фактический дополнительный выигрыш.',
      recommendation: 'watch',
    },
  ] as const;
}
