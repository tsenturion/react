export type LagSeverity = 'none' | 'noticeable' | 'high';
export type UpdatePattern =
  | 'single-field'
  | 'filter-list'
  | 'screen-switch'
  | 'remote-refresh';

export function evaluateConcurrencyStrategy(input: {
  lagSeverity: LagSeverity;
  updatePattern: UpdatePattern;
  resultCanLag: boolean;
  needsPendingIndicator: boolean;
  startedOutsideComponent: boolean;
  structuralProblemLikely: boolean;
}) {
  if (input.structuralProblemLikely) {
    return {
      verdict: 'Сначала исправьте архитектурный bottleneck',
      guidance:
        'Concurrent APIs не заменяют нормализацию state, локализацию рендеров и устранение лишней работы.',
      recommendedTool: 'measure-first',
    };
  }

  if (input.updatePattern === 'filter-list' && input.resultCanLag) {
    return {
      verdict: 'useDeferredValue или useTransition подходят лучше всего',
      guidance:
        'Input можно оставить срочным, а список и projection перевести в более мягкий режим обновления.',
      recommendedTool: input.needsPendingIndicator ? 'useTransition' : 'useDeferredValue',
    };
  }

  if (input.updatePattern === 'screen-switch' && input.startedOutsideComponent) {
    return {
      verdict: 'startTransition подходит для тяжёлого screen switch',
      guidance:
        'Если обновление запускается императивно и отдельный pending flag не нужен, imported API даёт более прямой способ понизить приоритет.',
      recommendedTool: 'startTransition',
    };
  }

  if (input.lagSeverity === 'none') {
    return {
      verdict: 'Concurrent API пока не обязательны',
      guidance:
        'Если интерфейс уже остаётся плавным, лишняя concurrent-обвязка только усложнит код без заметного выигрыша.',
      recommendedTool: 'none',
    };
  }

  return {
    verdict: 'useTransition подходит как безопасный базовый выбор',
    guidance:
      'Когда нужен явный pending indicator и есть тяжёлое несрочное обновление внутри компонента, useTransition даёт самый ясный contract.',
    recommendedTool: 'useTransition',
  };
}
