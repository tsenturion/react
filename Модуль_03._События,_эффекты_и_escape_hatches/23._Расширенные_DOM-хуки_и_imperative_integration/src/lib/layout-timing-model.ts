import type { SyncMode } from './dom-hooks-domain';

export const fallbackPopoverPlacement = {
  top: 18,
  left: 18,
} as const;

type RectLike = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export function buildLayoutHookSequence(mode: SyncMode) {
  return mode === 'layout'
    ? ['render', 'commit DOM', 'useLayoutEffect', 'paint', 'useEffect']
    : ['render', 'commit DOM', 'paint', 'useEffect', 'correction render'];
}

export function computePopoverPlacement(
  anchorRect: RectLike,
  stageRect: RectLike,
  panelWidth: number,
  panelHeight: number,
) {
  const rawLeft =
    anchorRect.left - stageRect.left + anchorRect.width / 2 - panelWidth / 2;
  const clampedLeft = Math.min(
    Math.max(12, rawLeft),
    Math.max(12, stageRect.width - panelWidth - 12),
  );
  const top = Math.max(12, anchorRect.top - stageRect.top - panelHeight - 12);

  return {
    top: Math.round(top),
    left: Math.round(clampedLeft),
  };
}

export function describeLayoutMode(mode: SyncMode) {
  if (mode === 'layout') {
    return {
      title: 'useLayoutEffect',
      summary:
        'Измерение и позиционирование происходят до paint, поэтому критичный layout не успевает показать промежуточный кадр.',
      snippet: [
        'useLayoutEffect(() => {',
        '  const next = measurePopover(anchor, stage, panel);',
        '  setPlacement(next);',
        '}, [anchorId, density]);',
      ].join('\n'),
    };
  }

  return {
    title: 'useEffect',
    summary:
      'Измерение приходит после paint. Для обычной синхронизации это нормально, но для positioning может дать видимый jump.',
    snippet: [
      'useEffect(() => {',
      '  const next = measurePopover(anchor, stage, panel);',
      '  setPlacement(next);',
      '}, [anchorId, density]);',
    ].join('\n'),
  };
}

export function formatPlacementLabel(top: number, left: number) {
  return `top ${top}px / left ${left}px`;
}
