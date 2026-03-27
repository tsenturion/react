import type { StatusTone } from './learning-model';

export type CodebaseShape = 'small' | 'growing' | 'platform';
export type QualityGapId =
  | 'no-devtools-habit'
  | 'lint-too-weak'
  | 'rules-ignored'
  | 'no-profiler-thinking'
  | 'tests-detached';

export function buildQualitySystemPlan(args: {
  shape: CodebaseShape;
  gaps: readonly QualityGapId[];
}): {
  tone: StatusTone;
  title: string;
  phases: readonly { title: string; steps: readonly string[] }[];
} {
  const risk =
    args.gaps.length + (args.shape === 'platform' ? 2 : args.shape === 'growing' ? 1 : 0);

  const phases = [
    {
      title: 'Инструменты наблюдения',
      steps: [
        'Держите React DevTools и debugging workflow частью обычной разработки, а не emergency-only сценарием.',
        'Научитесь начинать отладку с component tree, props/state/context и render reasons.',
      ],
    },
    {
      title: 'Инструменты предотвращения',
      steps: [
        'Усилите eslint config так, чтобы он отражал реальные архитектурные ограничения проекта.',
        'Не ограничивайтесь только rules-of-hooks, если codebase уже растёт и усложняется.',
      ],
    },
    {
      title: 'Инструменты закрепления',
      steps: [
        'Каждый найденный класс багов должен приводить к новому guardrail: test, lint rule, review rule или component API change.',
        'Качество системы растёт тогда, когда диагностика и предотвращение связаны между собой.',
      ],
    },
  ] as const;

  if (risk >= 5) {
    return {
      tone: 'error',
      title: 'Контур качества ещё фрагментирован',
      phases,
    };
  }

  if (risk >= 3) {
    return {
      tone: 'warn',
      title: 'Система качества уже строится, но пока не закрывает все слои',
      phases,
    };
  }

  return {
    tone: 'success',
    title: 'Инструменты работают как согласованная система',
    phases,
  };
}

export const qualityEvidence = [
  'Линтер отражает реальные правила проекта, а не только базовые stylistic checks.',
  'DevTools и profiler-style reasoning входят в обычный debugging workflow команды.',
  'Типовые баги закрепляются тестами и архитектурными guardrails.',
  'Инструменты не дублируют друг друга, а закрывают разные фазы: наблюдение, предотвращение и подтверждение.',
] as const;
