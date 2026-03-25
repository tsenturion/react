export type CallbackAction = 'shell-note' | 'toggle-item' | 'toggle-mode';

export function describeCallbackScenario(input: {
  usesStableCallback: boolean;
  action: CallbackAction;
}) {
  if (input.action === 'toggle-item') {
    return {
      affectedRows: input.usesStableCallback ? 'changed-row' : 'all-rows',
      headline: input.usesStableCallback
        ? 'Меняется только row с новым selected state'
        : 'Каждый row получает новый callback и ререндерится широко',
      detail: input.usesStableCallback
        ? 'Стабильный onToggle и primitive props позволяют memo-row увидеть, что остальные элементы не изменились.'
        : 'Inline callback ломает referential equality и превращает локальный toggle в широкую перерисовку списка.',
      nextMove:
        'Если child rows обёрнуты в memo, выносите обработчик вверх через useCallback и передавайте row id аргументом.',
    } as const;
  }

  if (!input.usesStableCallback) {
    return {
      affectedRows: 'all-rows',
      headline: 'Parent render заново создаёт обработчик для каждого row',
      detail:
        'Сам по себе callback недорогой, но его нестабильная ссылка размножается по всему списку и пробивает memo-границы дочерних элементов.',
      nextMove:
        'useCallback нужен не ради самой функции, а ради downstream tree, которая сравнивает ссылку.',
    } as const;
  }

  return {
    affectedRows: 'none',
    headline: 'Стабильный callback удерживает memo-row от лишнего render',
    detail:
      'Parent может менять собственное состояние, но ссылка обработчика остаётся прежней и не создаёт ложный prop change в списке.',
    nextMove:
      'Не добавляйте useCallback туда, где child не memoized и не зависит от стабильности ссылки.',
  } as const;
}
