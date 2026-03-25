export type WorkspaceView = 'schedule' | 'insights' | 'review';
export type TransitionTriggerMode = 'direct' | 'start-transition';

export function describeStartTransitionScenario(input: {
  mode: TransitionTriggerMode;
  target: WorkspaceView;
}) {
  const viewLabel =
    input.target === 'schedule'
      ? 'schedule workspace'
      : input.target === 'insights'
        ? 'insights workspace'
        : 'review workspace';

  if (input.mode === 'direct') {
    return {
      viewLabel,
      headline: 'Heavy workspace switch остаётся срочным',
      detail:
        'Обычный setState сразу ставит тяжёлый screen update в urgent lane вместе с quick shell feedback.',
      pendingSignal: 'нет фонового разделения',
    };
  }

  return {
    viewLabel,
    headline:
      'Imported startTransition переводит тяжёлый screen switch в background work',
    detail:
      'Этот API полезен, когда нужен именно lower-priority update, но отдельный pending state из useTransition не обязателен.',
    pendingSignal: 'manual pending UI не встроен автоматически',
  };
}
