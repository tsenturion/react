export type ListAction = 'shell-note' | 'filter-query' | 'toggle-row';

export function describeListOptimization(input: {
  memoRows: boolean;
  stableCallbacks: boolean;
  memoizedVisibleIds: boolean;
  action: ListAction;
  visibleCount: number;
}) {
  if (input.action === 'filter-query') {
    return {
      touchedRows: input.visibleCount,
      headline: 'Фильтр меняет набор visible rows и это полезный пересчёт',
      detail:
        'При изменении query часть списка действительно меняется, поэтому некоторый объём render-работы ожидаем и не считается waste.',
      nextMove:
        'Оптимизируйте не сам факт фильтрации, а её цену: derived list, stable handlers и row boundaries.',
    } as const;
  }

  if (input.memoRows && input.stableCallbacks && input.memoizedVisibleIds) {
    return {
      touchedRows: input.action === 'toggle-row' ? 1 : 0,
      headline: 'Список удерживает локальность обновлений',
      detail:
        input.action === 'toggle-row'
          ? 'Меняется только row с новым selected state, а остальные элементы сохраняют referential stability.'
          : 'Unrelated shell-state больше не пробивает rows и не заставляет список перерисовываться широко.',
      nextMove:
        'Сохраняйте этот набор целиком: memo rows, stable callbacks и useMemo для derived visible ids работают как связка.',
    } as const;
  }

  return {
    touchedRows: input.visibleCount,
    headline: 'Список ререндерится шире, чем требует действие',
    detail:
      'Даже локальное изменение тянет за собой весь visible slice, потому что где-то теряется стабильность props или derived array.',
    nextMove:
      'Сначала стабилизируйте visible ids и callbacks, затем убедитесь, что row действительно обёрнут в memo.',
  } as const;
}
