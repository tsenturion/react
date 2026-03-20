import type { LessonLabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

const studyMap: Record<LessonLabId, StudyEntry> = {
  modal: {
    files: [
      {
        path: 'src/components/escape-hatches/PortalModalLab.tsx',
        note: 'Лаборатория сравнивает inline и portal render-mode для одной и той же modal surface.',
      },
      {
        path: 'src/lib/portal-model.ts',
        note: 'Модель формулирует зачем createPortal нужен modal-слою и что он не меняет ownership в React.',
      },
      {
        path: 'index.html',
        note: 'Здесь видно отдельный DOM-host, в который приложение выносит portal-деревья.',
      },
    ],
    snippets: [
      {
        label: 'Portal modal render',
        note: 'DOM переносится в отдельный host, но кнопки внутри modal всё ещё меняют state родителя.',
        code: [
          'const content = <ModalSurface onPromote={() => setOwnerState((c) => c + 1)} />;',
          'return createPortal(content, portalRoot);',
        ].join('\n'),
      },
      {
        label: 'Body scroll lock',
        note: 'Modal как escape hatch почти всегда должен дополнительно синхронизироваться с внешним DOM, например через body overflow.',
        code: [
          'useEffect(() => {',
          '  document.body.style.overflow = "hidden";',
          '  return () => { document.body.style.overflow = previousOverflow; };',
          '}, [isOpen, renderMode]);',
        ].join('\n'),
      },
    ],
  },
  bubbling: {
    files: [
      {
        path: 'src/components/escape-hatches/PortalEventsLab.tsx',
        note: 'Здесь портал рендерится в body-host, а bubbling логируется по React-дереву.',
      },
      {
        path: 'src/lib/portal-model.ts',
        note: 'Модель описывает последовательность bubbling при allow/stop режиме.',
      },
      {
        path: 'src/pages/PortalEventsPage.tsx',
        note: 'Страница связывает поведение React events и DOM-положение portal-узла.',
      },
    ],
    snippets: [
      {
        label: 'Portal bubbling',
        note: 'Секция-родитель остаётся React-предком, даже если DOM-потомок уехал в другой host.',
        code: [
          '<section onClick={() => pushLog("Parent React handler")} />',
          'createPortal(<button onClick={handlePortalClick} />, portalRoot);',
        ].join('\n'),
      },
      {
        label: 'stopPropagation inside portal',
        note: 'Если bubbling не нужен, останавливать его надо точечно на portal surface.',
        code: [
          'onClick={(event) => {',
          '  if (bubbleMode === "stop") event.stopPropagation();',
          '}}',
        ].join('\n'),
      },
    ],
  },
  layering: {
    files: [
      {
        path: 'src/components/escape-hatches/LayerEscapeLab.tsx',
        note: 'Лаборатория сравнивает inline tooltip и portal tooltip поверх clipping-контейнера.',
      },
      {
        path: 'src/lib/layering-model.ts',
        note: 'Модель считает позицию floating overlay относительно viewport.',
      },
      {
        path: 'src/lib/escape-domain.ts',
        note: 'Здесь лежат карточки сценария и общий portal root id.',
      },
    ],
    snippets: [
      {
        label: 'Portal tooltip placement',
        note: 'Overlay меряется по anchorRect и рендерится уже не внутри clipping-контейнера.',
        code: [
          'const next = computeTooltipPlacement(anchorRect, window.innerWidth, window.innerHeight, 260, 120);',
          'return createPortal(<Tooltip style={next} />, portalRoot);',
        ].join('\n'),
      },
      {
        label: 'Inline clipping',
        note: 'Если tooltip остаётся обычным absolute child, он наследует overflow hidden своего контейнера.',
        code: [
          '<div className="relative overflow-hidden">',
          '  <div className="absolute -right-16 top-full">Tooltip</div>',
          '</div>',
        ].join('\n'),
      },
    ],
  },
  flush: {
    files: [
      {
        path: 'src/components/escape-hatches/FlushSyncLab.tsx',
        note: 'Здесь flushSync сравнивается с обычным add-step и immediate DOM read.',
      },
      {
        path: 'src/lib/flush-sync-model.ts',
        note: 'Модель объясняет stale immediate read без flushSync и фиксирует, что это редкий инструмент.',
      },
      {
        path: 'src/pages/FlushSyncPage.tsx',
        note: 'Страница связывает лабораторию со сценариями измерения и scroll after append.',
      },
    ],
    snippets: [
      {
        label: 'Rare synchronous commit',
        note: 'flushSync включается только вокруг узкого critical-step, где сразу после update нужен актуальный DOM.',
        code: [
          'flushSync(() => {',
          '  setEntries((current) => [...current, nextEntry]);',
          '});',
          'listRef.current?.scrollTo({ top: listRef.current.scrollHeight });',
        ].join('\n'),
      },
      {
        label: 'Normal stale read',
        note: 'Без flushSync в том же обработчике DOM ещё не обязан содержать новый элемент.',
        code: [
          'setEntries((current) => [...current, nextEntry]);',
          'const immediateCount = listRef.current?.children.length;',
        ].join('\n'),
      },
    ],
  },
  bridge: {
    files: [
      {
        path: 'src/components/escape-hatches/DialogBridgeLab.tsx',
        note: 'Лаборатория синхронизирует React state с imperative API нативного dialog.',
      },
      {
        path: 'src/lib/dialog-bridge-model.ts',
        note: 'Модель формулирует разницу между state bridge и drift через ручной showModal().',
      },
      {
        path: 'src/pages/DialogBridgePage.tsx',
        note: 'Страница собирает правила интеграции React с imperative browser API.',
      },
    ],
    snippets: [
      {
        label: 'State bridge to dialog',
        note: 'Effect synchronizes React-state и native imperative methods showModal/close.',
        code: [
          'useEffect(() => {',
          '  if (isOpen && !dialog.open) dialog.showModal();',
          '  if (!isOpen && shellMode !== "drift-open" && dialog.open) dialog.close();',
          '}, [isOpen, shellMode]);',
        ].join('\n'),
      },
      {
        label: 'Drift path',
        note: 'Прямой вызов showModal() без state-моста открывает dialog, но оставляет React shell в старом состоянии.',
        code: ['dialogRef.current?.showModal();', 'setShellMode("drift-open");'].join(
          '\n',
        ),
      },
    ],
  },
  boundary: {
    files: [
      {
        path: 'src/components/escape-hatches/EscapeBoundaryLab.tsx',
        note: 'Лаборатория сопоставляет сценарий интерфейса и минимально нужный escape hatch.',
      },
      {
        path: 'src/lib/escape-boundary-model.ts',
        note: 'Здесь лежат рекомендации по portal, flushSync, state bridge и случаям, где escape hatch вообще не нужен.',
      },
      {
        path: 'src/lib/escape-domain.ts',
        note: 'Сценарии для итогового architectural playbook собраны в одном месте.',
      },
    ],
    snippets: [
      {
        label: 'Portal recommendation',
        note: 'Modal-слой получает отдельный host, а React state остаётся обычным.',
        code: [
          'recommended: "createPortal"',
          'avoid: "держать modal DOM внутри случайного контейнера"',
        ].join('\n'),
      },
      {
        label: 'No escape hatch case',
        note: 'Чистое вычисление по query не превращается в flushSync или effect только потому, что UI динамический.',
        code: [
          'recommended: "обычное вычисление в render"',
          'avoid: "escape hatch без нужды"',
        ].join('\n'),
      },
    ],
  },
};

export function getProjectStudy(id: LessonLabId) {
  return studyMap[id];
}
