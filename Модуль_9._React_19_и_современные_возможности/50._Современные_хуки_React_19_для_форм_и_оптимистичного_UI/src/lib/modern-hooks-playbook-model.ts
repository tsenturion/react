export type HookPattern =
  | 'manual-handler'
  | 'plain-form-action'
  | 'use-action-state'
  | 'use-form-status'
  | 'use-optimistic'
  | 'combined-hooks';

export type HookScenario = {
  isRealForm: boolean;
  needsReturnedState: boolean;
  needsNestedPending: boolean;
  needsInstantFeedback: boolean;
  canFailAfterOptimistic: boolean;
};

export type HookRecommendation = {
  primaryPattern: HookPattern;
  supportingPatterns: readonly HookPattern[];
  reason: string;
  warning: string;
};

export function chooseHookStrategy(scenario: HookScenario): HookRecommendation {
  if (!scenario.isRealForm) {
    return {
      primaryPattern: 'manual-handler',
      supportingPatterns: [],
      reason:
        'Если у сценария нет настоящего submit-потока формы, современные form hooks только усложнят код.',
      warning:
        'Не превращайте любой click в action-модель: без FormData и submit lifecycle это будет ложная абстракция.',
    };
  }

  if (
    scenario.needsInstantFeedback &&
    (scenario.needsReturnedState || scenario.needsNestedPending)
  ) {
    return {
      primaryPattern: 'combined-hooks',
      supportingPatterns: ['use-action-state', 'use-form-status', 'use-optimistic'],
      reason:
        'Форма должна одновременно показать pending, optimistic overlay и итог success/error state. Это уже связка нескольких React 19 API.',
      warning:
        'Оптимистичная карточка не равна серверной истине. Закладывайте rollback и явно отделяйте confirmed данные от overlay.',
    };
  }

  if (scenario.needsInstantFeedback) {
    return {
      primaryPattern: 'use-optimistic',
      supportingPatterns: [],
      reason:
        'Ключевая задача — мгновенно показать ожидаемый результат до ответа сервера.',
      warning: scenario.canFailAfterOptimistic
        ? 'Сервер может отклонить действие, значит UX должен объяснять откат, а не молча убирать элемент.'
        : 'Если ошибка исключена или несущественна, optimistic overlay может быть очень коротким и простым.',
    };
  }

  if (scenario.needsReturnedState) {
    return {
      primaryPattern: 'use-action-state',
      supportingPatterns: scenario.needsNestedPending ? ['use-form-status'] : [],
      reason:
        'Форма должна получить validation/result state прямо из action, без ручного setPending/setError кода.',
      warning:
        'useActionState полезен там, где submit действительно возвращает UI-state. Для fire-and-forget формы он будет избыточен.',
    };
  }

  if (scenario.needsNestedPending) {
    return {
      primaryPattern: 'use-form-status',
      supportingPatterns: [],
      reason:
        'Pending нужно читать глубоко внутри формы: в кнопке, сайдбаре или inline status-компоненте.',
      warning:
        'Не дублируйте pending во внешнем state, если его уже можно прочитать из nearest form context.',
    };
  }

  return {
    primaryPattern: 'plain-form-action',
    supportingPatterns: [],
    reason:
      'Если нужен только простой async submit без returned state и optimistic overlay, plain form action остаётся самым прямым вариантом.',
    warning:
      'Не добавляйте новые hooks только ради самого API: сначала определяйте реальный поток формы.',
  };
}
