type RectLike = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export function computeTooltipPlacement(
  anchorRect: RectLike,
  viewportWidth: number,
  viewportHeight: number,
  tooltipWidth: number,
  tooltipHeight: number,
) {
  const preferredLeft = anchorRect.left + anchorRect.width / 2 - tooltipWidth / 2;
  const preferredTop = anchorRect.top - tooltipHeight - 14;

  return {
    left: Math.round(
      Math.min(Math.max(12, preferredLeft), viewportWidth - tooltipWidth - 12),
    ),
    top: Math.round(
      Math.min(Math.max(12, preferredTop), viewportHeight - tooltipHeight - 12),
    ),
  };
}

export function buildLayeringReport(kind: 'inline' | 'portal') {
  if (kind === 'portal') {
    return {
      title: 'Portal overlay',
      summary:
        'Overlay рендерится вне clipping-контейнера и может занимать отдельный верхний слой интерфейса.',
      snippet: [
        'const next = computeTooltipPlacement(anchorRect, viewportWidth, viewportHeight, 260, 120);',
        'return createPortal(<Tooltip style={next} />, portalRoot);',
      ].join('\n'),
    };
  }

  return {
    title: 'Inline overlay',
    summary:
      'Если tooltip оставлен внутри обычного контейнера, он наследует его overflow hidden и stacking context.',
    snippet: [
      '<div className="relative overflow-hidden">',
      '  <div className="absolute -right-12 top-full">Tooltip</div>',
      '</div>',
    ].join('\n'),
  };
}
