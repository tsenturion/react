import type { StatusTone } from './learning-model';

export type UpgradeAssumptionId =
  | 'effects-still-safe'
  | 'refs-are-hidden-channel'
  | 'forms-live-outside-upgrade'
  | 'supporting-code-is-neutral'
  | 'third-party-is-already-ready';

export type DisciplineMode = 'codemod-only' | 'tests-plus-notes' | 'staged-rollout';

export const upgradeAssumptionCards: readonly {
  id: UpgradeAssumptionId;
  title: string;
  weight: number;
  note: string;
}[] = [
  {
    id: 'effects-still-safe',
    title: 'Effect logic assumed to stay safe automatically',
    weight: 3,
    note: 'Если старые root/cleanup assumptions были завязаны на эффекты, это редко чинится одной заменой API.',
  },
  {
    id: 'refs-are-hidden-channel',
    title: 'Refs используются как неявный канал данных',
    weight: 3,
    note: 'Это особенно опасно рядом с findDOMNode/string refs и migration к современным ref flows.',
  },
  {
    id: 'forms-live-outside-upgrade',
    title: 'Формы и submit-логика не включены в migration audit',
    weight: 2,
    note: 'Form flows часто зависят от supporting code и могут ломаться при обновлении окружения и entrypoints.',
  },
  {
    id: 'supporting-code-is-neutral',
    title: 'Тестовые harnesses и bootstrap helpers не проверяются',
    weight: 3,
    note: 'Иногда основной app entry уже обновлён, но supporting code всё ещё держится на removed API.',
  },
  {
    id: 'third-party-is-already-ready',
    title: 'Предполагается, что сторонние библиотеки уже совместимы',
    weight: 4,
    note: 'Это частая точка провала: deprecated API может жить не в вашем коде, а во wrapper или dependency.',
  },
] as const;

export function evaluateUpgradeReadiness(
  selectedAssumptions: readonly UpgradeAssumptionId[],
  disciplineMode: DisciplineMode,
): {
  score: number;
  tone: StatusTone;
  title: string;
  copy: string;
  blockers: string[];
  nextSteps: string[];
} {
  const scoreFromAssumptions = selectedAssumptions.reduce((total, id) => {
    const card = upgradeAssumptionCards.find((item) => item.id === id);
    return total + (card?.weight ?? 0);
  }, 0);

  const disciplineDiscount =
    disciplineMode === 'codemod-only' ? 0 : disciplineMode === 'tests-plus-notes' ? 3 : 6;

  const score = Math.max(0, scoreFromAssumptions - disciplineDiscount);

  const blockers = upgradeAssumptionCards
    .filter((item) => selectedAssumptions.includes(item.id))
    .map((item) => item.title);

  if (score >= 7) {
    return {
      score,
      tone: 'error',
      title: 'Миграция пока выглядит как высокорисковая',
      copy: 'Слишком много assumptions остаются непроверенными, а текущий rollout discipline не компенсирует этот риск.',
      blockers,
      nextSteps: [
        'Сначала зафиксируйте все removed/deprecated call sites и third-party blockers.',
        'Поднимите coverage на component/integration/E2E сценарии для refs, forms и bootstrap.',
        'Переведите rollout в staged mode вместо одномоментной замены.',
      ],
    };
  }

  if (score >= 3) {
    return {
      score,
      tone: 'warn',
      title: 'Миграция возможна, но assumptions ещё недостаточно проверены',
      copy: 'Есть шанс пройти обновление без прямой поломки сборки, но реальное поведение всё ещё требует доказательства через tests и audit.',
      blockers,
      nextSteps: [
        'Используйте release notes как список hypotheses для проверки, а не как формальную инструкцию.',
        'Проверьте supporting code и нестандартные root helpers отдельно.',
        'Соберите regression suite по чувствительным пользовательским сценариям.',
      ],
    };
  }

  return {
    score,
    tone: 'success',
    title: 'Migration discipline выглядит устойчивой',
    copy: 'Предположения уже частично закрыты audit-ом и staged rollout, поэтому обновление больше похоже на управляемое изменение, чем на blind replacement.',
    blockers,
    nextSteps: [
      'Продолжайте staged rollout с наблюдением за critical paths.',
      'Фиксируйте найденные assumptions как часть engineering playbook.',
    ],
  };
}

export const upgradeDisciplineRules = [
  'React upgrade нельзя оценивать только по тому, компилируется ли приложение.',
  'Каждый deprecated API почти всегда указывает на более глубокое устаревшее предположение о runtime.',
  '18.3 → 19 — это удобная рамка для аудита рендеринга, refs, forms и supporting code.',
  'Release notes полезны только тогда, когда превращаются в проверяемые hypotheses внутри тестов и rollout плана.',
] as const;
