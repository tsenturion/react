import type { SyncMode, TrackVariant } from './dom-hooks-domain';

type RectLike = {
  left: number;
  width: number;
};

export const positioningTabs = [
  {
    id: 'overview',
    label: 'Overview',
    summary: 'Сводка по текущему layout и ordering эффектов.',
  },
  {
    id: 'measure',
    label: 'Measure',
    summary: 'Измерения и reposition при смене ширины.',
  },
  {
    id: 'handoff',
    label: 'Handoff',
    summary: 'Передача готовой геометрии дальше по дереву.',
  },
] as const;

export function computeIndicatorBox(buttonRect: RectLike, rootRect: RectLike) {
  return {
    left: Math.round(buttonRect.left - rootRect.left),
    width: Math.round(buttonRect.width),
  };
}

export function describePositioningMode(mode: SyncMode, variant: TrackVariant) {
  const variantLabel =
    variant === 'compact'
      ? 'Компактная дорожка сильнее показывает jump underline.'
      : 'Широкая дорожка лучше видна при remeasure и resize.';

  if (mode === 'layout') {
    return {
      title: 'Critical positioning',
      summary: `${variantLabel} Измерение underline происходит до paint и не отдаёт пользователю промежуточную геометрию.`,
      snippet: [
        'useLayoutEffect(() => {',
        '  const next = computeIndicatorBox(activeButton, stage);',
        '  setIndicator(next);',
        '}, [activeId, trackVariant]);',
      ].join('\n'),
    };
  }

  return {
    title: 'Post-paint correction',
    summary: `${variantLabel} В effect underline измеряется позже и в критичных UI может сдвигаться уже после первого кадра.`,
    snippet: [
      'useEffect(() => {',
      '  const next = computeIndicatorBox(activeButton, stage);',
      '  setIndicator(next);',
      '}, [activeId, trackVariant]);',
    ].join('\n'),
  };
}
