export type MemoBoundaryAction = 'shell-note' | 'accent-change' | 'selection-change';

export function describeMemoBoundary(input: {
  usesMemoBoundary: boolean;
  unstableObjectProp: boolean;
  action: MemoBoundaryAction;
}) {
  if (!input.usesMemoBoundary) {
    return {
      childShouldRerender: true,
      avoidable: input.action !== 'accent-change',
      headline: 'Child ререндерится вместе с parent, потому что memo-границы нет',
      detail:
        input.action === 'accent-change'
          ? 'Изменился видимый primitive prop, поэтому child всё равно должен обновиться.'
          : 'Даже чисто shell-state изменение тянет child за собой, хотя визуально он не менялся.',
      nextMove:
        'Сначала проверьте, нужен ли здесь memo-child и действительно ли props могут оставаться стабильными.',
    } as const;
  }

  if (input.action === 'accent-change') {
    return {
      childShouldRerender: true,
      avoidable: false,
      headline: 'memo не блокирует полезный render при изменении видимого prop',
      detail:
        'Primitive prop изменился по смыслу, поэтому memo-child обновляется корректно и это не считается лишним render.',
      nextMove: 'Не пытайтесь мемоизацией скрыть реальное изменение UI.',
    } as const;
  }

  if (input.unstableObjectProp) {
    return {
      childShouldRerender: true,
      avoidable: true,
      headline: 'memo пробивается новым object prop',
      detail:
        'Значения внутри объекта могут оставаться теми же, но новая ссылка заставляет memo-child считать props изменившимися.',
      nextMove:
        'Стабилизируйте derived object через useMemo или передавайте только primitive props.',
    } as const;
  }

  return {
    childShouldRerender: false,
    avoidable: false,
    headline: 'memo-граница удерживает лишний render вне child',
    detail:
      'Parent render всё ещё происходит, но child не трогается, потому что его props действительно остались прежними.',
    nextMove:
      'Используйте такой паттерн только там, где child достаточно тяжёлый или размножается в дереве.',
  } as const;
}
