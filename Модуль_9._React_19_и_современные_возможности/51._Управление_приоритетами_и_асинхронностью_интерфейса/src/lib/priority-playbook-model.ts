export type PriorityTool =
  | 'plain-state'
  | 'use-transition'
  | 'start-transition'
  | 'use-deferred-value'
  | 'use-effect-event'
  | 'activity'
  | 'compose-tools';

export type PriorityScenario = {
  urgentInput: boolean;
  needsPendingIndicator: boolean;
  backgroundViewMayLag: boolean;
  bulkNonUrgentEvent: boolean;
  externalEffectNeedsLatestValue: boolean;
  hiddenSubtreeKeepsState: boolean;
};

export type PriorityRecommendation = {
  primaryTool: PriorityTool;
  supportingTools: readonly PriorityTool[];
  maturity: 'stable-everyday' | 'stable-situational' | 'advanced-boundary';
  reason: string;
  warning: string;
};

export function choosePriorityStrategy(
  scenario: PriorityScenario,
): PriorityRecommendation {
  if (
    scenario.urgentInput &&
    scenario.backgroundViewMayLag &&
    (scenario.externalEffectNeedsLatestValue || scenario.hiddenSubtreeKeepsState)
  ) {
    return {
      primaryTool: 'compose-tools',
      supportingTools: [
        scenario.needsPendingIndicator ? 'use-transition' : 'use-deferred-value',
        scenario.externalEffectNeedsLatestValue ? 'use-effect-event' : 'activity',
      ].filter(Boolean) as PriorityTool[],
      maturity: 'advanced-boundary',
      reason:
        'Сценарий одновременно требует responsive input, вторичного background view и отдельной boundary-логики для effect или hidden subtree.',
      warning:
        'Не начинайте с комбинирования API по умолчанию. Сначала определите, какой именно слой интерфейса реально тормозит или теряет состояние.',
    };
  }

  if (scenario.hiddenSubtreeKeepsState) {
    return {
      primaryTool: 'activity',
      supportingTools: [],
      maturity: 'advanced-boundary',
      reason:
        'Скрываемое поддерево должно вернуться в прежнем состоянии, значит обычный conditional render уже недостаточен.',
      warning:
        'Activity не нужен для любого hide/show. Если потеря локального состояния не важна, обычная условная ветка проще.',
    };
  }

  if (scenario.externalEffectNeedsLatestValue) {
    return {
      primaryTool: 'use-effect-event',
      supportingTools: [],
      maturity: 'stable-situational',
      reason:
        'Внешний listener должен оставаться подписанным, но реакция внутри effect обязана видеть свежие значения без resubscribe.',
      warning:
        'useEffectEvent — это не escape hatch для отключения зависимостей вообще. Он нужен только для effect-local callback logic.',
    };
  }

  if (scenario.urgentInput && scenario.backgroundViewMayLag) {
    if (scenario.needsPendingIndicator) {
      return {
        primaryTool: 'use-transition',
        supportingTools: [],
        maturity: 'stable-everyday',
        reason:
          'Input должен оставаться срочным, а background update при этом должен явно показывать pending.',
        warning:
          'Не переносите в transition сам текстовый echo: срочное значение должно обновляться сразу.',
      };
    }

    return {
      primaryTool: 'use-deferred-value',
      supportingTools: [],
      maturity: 'stable-situational',
      reason:
        'Нужно держать input свежим, пока тяжёлое представление догоняет последнее введённое значение.',
      warning:
        'useDeferredValue не заменяет debounce для сети и не гарантирует отмену предыдущих вычислений.',
    };
  }

  if (scenario.bulkNonUrgentEvent) {
    return {
      primaryTool: 'start-transition',
      supportingTools: [],
      maturity: 'stable-situational',
      reason:
        'У вас есть отдельное несрочное событие, для которого не нужен локальный isPending, но важно понизить приоритет обновления.',
      warning:
        'Если пользователю нужен видимый pending-state, standalone startTransition уже недостаточен, и лучше перейти к useTransition.',
    };
  }

  return {
    primaryTool: 'plain-state',
    supportingTools: [],
    maturity: 'stable-everyday',
    reason:
      'Сценарий не требует отдельного background scheduling, deferred reading или сохранения скрытого поддерева.',
    warning:
      'Не превращайте каждое обновление в concurrent optimisation. Сначала докажите, что у интерфейса есть реальная проблема приоритета или асинхронности.',
  };
}
