import type { SyncMode } from './dom-hooks-domain';

export function describeWidgetSyncMode(mode: SyncMode) {
  if (mode === 'layout') {
    return {
      title: 'Mount before paint-sensitive work',
      summary:
        'useLayoutEffect подходит, когда внешний widget сразу влияет на геометрию, измерения или positioning.',
      snippet: [
        'useLayoutEffect(() => {',
        '  widget.mount(host);',
        '  widget.setTheme(theme);',
        '  return () => widget.destroy();',
        '}, [connected]);',
      ].join('\n'),
    };
  }

  return {
    title: 'Passive bridge',
    summary:
      'useEffect проще и дешевле, если внешний widget не влияет на первый кадр и может подключиться уже после paint.',
    snippet: [
      'useEffect(() => {',
      '  widget.mount(host);',
      '  return () => widget.destroy();',
      '}, [connected]);',
    ].join('\n'),
  };
}

export function buildWidgetLifecycleReport(kind: 'mount' | 'update' | 'cleanup') {
  if (kind === 'mount') {
    return {
      title: 'Dedicated host node',
      summary:
        'React отдаёт внешней библиотеке отдельный DOM-контейнер, но не смешивает JSX-детей с DOM, который библиотека создаёт сама.',
      snippet: ['<div ref={hostRef} className="widget-host" />'].join('\n'),
    };
  }

  if (kind === 'update') {
    return {
      title: 'Imperative updates',
      summary:
        'После монтирования bridge обновляет существующий instance методами setTheme / setDataset, а не пересоздаёт его на каждый render.',
      snippet: [
        'widgetRef.current?.setTheme(theme);',
        'widgetRef.current?.setDataset(datasetId);',
      ].join('\n'),
    };
  }

  return {
    title: 'Cleanup matters',
    summary:
      'Destroy обязателен. Иначе слушатели, таймеры и DOM внутри host останутся жить после ухода React-компонента.',
    snippet: ['return () => {', '  widget.destroy();', '};'].join('\n'),
  };
}
