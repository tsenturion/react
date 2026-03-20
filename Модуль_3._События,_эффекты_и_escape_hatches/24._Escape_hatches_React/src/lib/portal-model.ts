import type { BubbleMode, PortalRenderMode } from './escape-domain';

export function buildPortalReport(kind: 'modal' | 'bubbling' | 'layering') {
  if (kind === 'modal') {
    return {
      title: 'Portal for modal layer',
      summary:
        'createPortal переносит DOM-узел модалки в другой host, но React-связь с родительским state остаётся прежней.',
      snippet: [
        'return createPortal(',
        '  <ModalSurface isOpen={isOpen} onClose={closeModal} />,',
        '  portalRoot,',
        ');',
      ].join('\n'),
    };
  }

  if (kind === 'bubbling') {
    return {
      title: 'Portal event bubbling',
      summary:
        'Событие из portal продолжает идти по React-дереву вверх. Это не то же самое, что смотреть только на DOM-родителей.',
      snippet: [
        '<section onClick={() => pushLog("Parent React handler")} />',
        'createPortal(',
        '  <button onClick={handlePortalClick}>Inside portal</button>,',
        '  portalRoot,',
        ');',
      ].join('\n'),
    };
  }

  return {
    title: 'Portal escapes clipping',
    summary:
      'Portal помогает вывести overlay из контейнера с overflow hidden и не держать layer внутри случайного stacking context.',
    snippet: [
      'const floating = createPortal(',
      '  <Tooltip style={{ top, left }} />,',
      '  portalRoot,',
      ');',
    ].join('\n'),
  };
}

export function describePortalMode(mode: PortalRenderMode) {
  return mode === 'portal'
    ? 'DOM вынесен в отдельный host вне основного контейнера.'
    : 'DOM остаётся рядом с текущей карточкой и подчиняется её layout-ограничениям.';
}

export function describeBubbleSequence(mode: BubbleMode) {
  return mode === 'stop'
    ? [
        'Portal button click',
        'Portal surface handler',
        'stopPropagation()',
        'Parent React handler skipped',
      ]
    : [
        'Portal button click',
        'Portal surface handler',
        'Parent React handler',
        'Root log updated',
      ];
}
