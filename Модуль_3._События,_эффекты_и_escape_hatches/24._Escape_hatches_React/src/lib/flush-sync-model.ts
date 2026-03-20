export function simulateFlushSyncCounts(beforeCount: number) {
  return {
    beforeCount,
    normalImmediateCount: beforeCount,
    normalAfterCommitCount: beforeCount + 1,
    flushImmediateCount: beforeCount + 1,
  };
}

export function buildFlushSyncReport(kind: 'rare' | 'scroll' | 'anti') {
  if (kind === 'rare') {
    return {
      title: 'Rare synchronous commit',
      summary:
        'flushSync нужен редко: когда после state update необходимо тут же прочитать уже обновлённый DOM.',
      snippet: [
        'flushSync(() => {',
        '  setEntries((current) => [...current, nextEntry]);',
        '});',
        'listRef.current?.scrollTo({ top: listRef.current.scrollHeight });',
      ].join('\n'),
    };
  }

  if (kind === 'scroll') {
    return {
      title: 'Read DOM after append',
      summary:
        'Без flushSync immediate DOM read всё ещё увидит старый snapshot. После commit данные появятся только на следующем кадре.',
      snippet: [
        'setEntries((current) => [...current, nextEntry]);',
        'const immediateCount = listRef.current?.children.length;',
      ].join('\n'),
    };
  }

  return {
    title: 'Do not use as default',
    summary:
      'flushSync не должен становиться базовой стратегией обновления. Он решает очень узкие сценарии и легко разрушает производительный batching.',
    snippet: [
      'const filtered = items.filter((item) => item.label.includes(query));',
      '// здесь flushSync не нужен',
    ].join('\n'),
  };
}
