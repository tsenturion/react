import type { StatusTone } from './learning-model';

export type CodebaseShape = 'small-modern' | 'mixed' | 'legacy-heavy';
export type WorkflowBlockerId =
  | 'removed-dom-apis'
  | 'legacy-context'
  | 'string-refs'
  | 'custom-entrypoints'
  | 'fragile-tests'
  | 'third-party-lag';
export type RolloutMode = 'big-bang' | 'staged';

export function buildMigrationPlan(
  shape: CodebaseShape,
  blockers: readonly WorkflowBlockerId[],
  rolloutMode: RolloutMode,
): {
  tone: StatusTone;
  title: string;
  summary: string;
  phases: readonly { title: string; steps: readonly string[] }[];
} {
  const highRisk =
    shape === 'legacy-heavy' || blockers.length >= 4 || rolloutMode === 'big-bang';

  const phases = [
    {
      title: '1. Inventory',
      steps: [
        'Соберите все deprecated и removed call sites, включая test harnesses и bootstrap helpers.',
        'Отдельно отметьте код, который зависит от refs, forms, effects и third-party adapters.',
      ],
    },
    {
      title: '2. Mechanical changes',
      steps: [
        'Примените codemods там, где замена действительно синтаксическая.',
        'Не закрывайте задачу, пока не отмечены места, требующие ручного reasoning.',
      ],
    },
    {
      title: '3. Assumption audit',
      steps: [
        'Проверьте supporting code, hidden ref flows и старые mount/unmount assumptions.',
        'Сверьте release notes с реальными surfaces вашей кодовой базы.',
      ],
    },
    {
      title: '4. Proof through tests',
      steps: [
        'Закройте migration-sensitive сценарии component/integration/E2E тестами.',
        'Проверьте, что tests валидируют поведение, а не старые внутренние детали реализации.',
      ],
    },
    {
      title: '5. Rollout and observation',
      steps:
        rolloutMode === 'staged'
          ? [
              'Выпускайте изменения поэтапно и отслеживайте critical user flows.',
              'Фиксируйте найденные regressions как часть migration playbook команды.',
            ]
          : [
              'Big-bang rollout допустим только при очень низком риске и сильном regression suite.',
              'Если кодовая база смешанная, лучше всё же перейти к staged delivery.',
            ],
    },
  ] as const;

  return {
    tone: highRisk ? 'error' : blockers.length >= 2 ? 'warn' : 'success',
    title: highRisk
      ? 'Миграция требует поэтапной дисциплины и явного risk management'
      : blockers.length >= 2
        ? 'Migration plan реалистичен, но ещё нуждается в страхующих шагах'
        : 'Migration workflow выглядит управляемым',
    summary:
      shape === 'small-modern'
        ? 'Небольшой современный код всё равно выигрывает от инвентаризации и проверяемого rollout, просто этапы будут короче.'
        : shape === 'mixed'
          ? 'Смешанная кодовая база почти всегда требует ручного аудита supporting code и адаптерных слоёв.'
          : 'Legacy-heavy система не переносит механического upgrade: здесь критичны inventory, tests и staged rollout.',
    phases,
  };
}

export const migrationEvidenceChecklist = [
  'Есть список removed/deprecated API call sites и их owners.',
  'Codemods отделены от ручных архитектурных решений.',
  'Release notes превращены в конкретные hypotheses для проверки.',
  'Есть test suite на migration-sensitive сценарии.',
  'Rollout plan учитывает наблюдаемость и обратную связь после релиза.',
] as const;
