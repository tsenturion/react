export type RenderAction = 'parent-note' | 'accent-change' | 'mode-change';

export function describeRenderReaction(input: {
  action: RenderAction;
  unstableObjectProp: boolean;
}) {
  if (input.action === 'accent-change') {
    return {
      headline: 'Preview перерендерился по делу',
      detail:
        'Видимый цвет карточки изменился, значит React действительно должен обновить дочерний subtree.',
      avoidable: false,
    };
  }

  if (input.action === 'mode-change') {
    return {
      headline: input.unstableObjectProp
        ? 'Включён режим нового object prop'
        : 'Режим unstable object prop выключен',
      detail: input.unstableObjectProp
        ? 'Теперь даже невинные parent renders будут пробивать memo-границу из-за новой ссылки на объект.'
        : 'Теперь memo-child может пропускать parent renders, если meaningful props не менялись.',
      avoidable: input.unstableObjectProp,
    };
  }

  if (input.unstableObjectProp) {
    return {
      headline: 'Parent render задел memo-child лишний раз',
      detail:
        'Текст заметки меняется только в shell, но новый object prop создаёт новую ссылку и заставляет preview ререндериться.',
      avoidable: true,
    };
  }

  return {
    headline: 'Parent render остался локальным',
    detail:
      'Shell обновился, но memo-child сохранил прежние meaningful props, поэтому лишнего рендера ниже не произошло.',
    avoidable: false,
  };
}
