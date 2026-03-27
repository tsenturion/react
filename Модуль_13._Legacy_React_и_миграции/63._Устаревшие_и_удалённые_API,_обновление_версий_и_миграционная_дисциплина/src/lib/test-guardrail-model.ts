import type { StatusTone } from './learning-model';

export type TestLayer = 'unit' | 'component' | 'integration' | 'e2e';
export type MigrationRiskId =
  | 'root-bootstrap'
  | 'effects-cleanup'
  | 'refs-focus'
  | 'forms-submit'
  | 'third-party-adapter';

export const migrationRiskCards: readonly {
  id: MigrationRiskId;
  title: string;
  coveredBy: readonly TestLayer[];
  note: string;
}[] = [
  {
    id: 'root-bootstrap',
    title: 'Root bootstrap and mount helpers',
    coveredBy: ['integration', 'e2e'],
    note: 'Unit tests редко подтверждают реальное поведение mount/hydrate/unmount цепочки.',
  },
  {
    id: 'effects-cleanup',
    title: 'Effect cleanup assumptions',
    coveredBy: ['component', 'integration'],
    note: 'Нужны tests, которые видят поведение effects в реальном lifecycle сценарии.',
  },
  {
    id: 'refs-focus',
    title: 'Refs and imperative focus paths',
    coveredBy: ['component', 'integration'],
    note: 'Поведение refs почти всегда видно только через реальное взаимодействие, а не через чистые unit assertions.',
  },
  {
    id: 'forms-submit',
    title: 'Forms, submit pipeline and pending flows',
    coveredBy: ['component', 'integration', 'e2e'],
    note: 'Миграция часто раскрывает скрытые зависимости формы от supporting code.',
  },
  {
    id: 'third-party-adapter',
    title: 'Third-party adapters and wrapper contracts',
    coveredBy: ['integration', 'e2e'],
    note: 'Именно интеграционные tests чаще всего ловят конфликт между вашим кодом и внешними слоями.',
  },
] as const;

export function evaluateTestGuardrails(
  selectedLayers: readonly TestLayer[],
  selectedRisks: readonly MigrationRiskId[],
): {
  tone: StatusTone;
  coveredCount: number;
  missedCount: number;
  title: string;
  missing: string[];
  summary: string;
} {
  const missing = migrationRiskCards
    .filter((risk) => selectedRisks.includes(risk.id))
    .filter((risk) => !risk.coveredBy.some((layer) => selectedLayers.includes(layer)))
    .map((risk) => risk.title);

  const coveredCount = selectedRisks.length - missing.length;
  const missedCount = missing.length;

  if (selectedRisks.length === 0) {
    return {
      tone: 'success',
      coveredCount: 0,
      missedCount: 0,
      title: 'Migration risks не выбраны',
      missing: [],
      summary:
        'Это не означает отсутствие риска. Просто пока не сформулировано, какие поверхности миграция реально меняет.',
    };
  }

  if (missedCount >= 2) {
    return {
      tone: 'error',
      coveredCount,
      missedCount,
      title: 'Test suite пока не держит миграцию как guardrail',
      missing,
      summary:
        'Слишком много migration-sensitive областей остаются без слоя тестов, который реально увидит их поломку.',
    };
  }

  if (missedCount === 1) {
    return {
      tone: 'warn',
      coveredCount,
      missedCount,
      title: 'Есть один заметный слепой участок в migration coverage',
      missing,
      summary:
        'Основная структура тестов уже полезна, но один чувствительный слой всё ещё проходит без доказательства поведения.',
    };
  }

  return {
    tone: 'success',
    coveredCount,
    missedCount,
    title: 'Test suite выглядит как реальный migration guardrail',
    missing: [],
    summary:
      'Выбранные риски прикрыты хотя бы одним релевантным слоем тестов, который может увидеть реальную регрессию.',
  };
}

export const guardrailRules = [
  'Tests во время миграции должны проверять поведение, а не старые implementation details.',
  'Unit tests полезны, но редко покрывают root bootstrap и внешние adapters.',
  'Integration и E2E нужны не потому, что “так правильно”, а потому что именно они видят систему целиком.',
  'Если migration риски не сформулированы как список surfaces, test suite трудно использовать как управляемый барьер.',
] as const;
