export type KeyStrategy = 'stable-id' | 'index' | 'random';
export type DiffOperation = 'reverse' | 'prepend' | 'remove-second' | 'swap-middle';

type DiffItem = {
  id: string;
  title: string;
};

type SnapshotItem = DiffItem & {
  key: string;
};

export type ReconciliationReport = {
  before: SnapshotItem[];
  after: SnapshotItem[];
  reusedCount: number;
  mountedCount: number;
  removedCount: number;
  identityDriftCount: number;
  summary: string;
  snippet: string;
};

const baseItems: readonly DiffItem[] = [
  { id: 'a', title: 'Условный UI' },
  { id: 'b', title: 'Списки' },
  { id: 'c', title: 'key' },
  { id: 'd', title: 'Фрагменты' },
] as const;

function applyOperation(operation: DiffOperation) {
  if (operation === 'reverse') return [...baseItems].reverse();
  if (operation === 'prepend') {
    return [{ id: 'x', title: 'Новый срочный урок' }, ...baseItems];
  }
  if (operation === 'remove-second') {
    return baseItems.filter((item) => item.id !== 'b');
  }

  return [baseItems[0], baseItems[2], baseItems[1], baseItems[3]];
}

function withKeys(
  items: readonly DiffItem[],
  strategy: KeyStrategy,
  phase: 'before' | 'after',
): SnapshotItem[] {
  return items.map((item, index) => ({
    ...item,
    key:
      strategy === 'stable-id'
        ? item.id
        : strategy === 'index'
          ? String(index)
          : `${item.id}-${phase}`,
  }));
}

export function analyzeReconciliation(
  strategy: KeyStrategy,
  operation: DiffOperation,
): ReconciliationReport {
  const before = withKeys(baseItems, strategy, 'before');
  const after = withKeys(applyOperation(operation), strategy, 'after');

  const beforeMap = new Map(before.map((item) => [item.key, item.id]));
  const afterMap = new Map(after.map((item) => [item.key, item.id]));
  const reusedKeys = after
    .filter((item) => beforeMap.has(item.key))
    .map((item) => item.key);
  const mountedCount = after.filter((item) => !beforeMap.has(item.key)).length;
  const removedCount = before.filter((item) => !afterMap.has(item.key)).length;
  // Drift означает, что React нашёл тот же key и решил reuse возможен,
  // но под этим key уже лежит другой объект данных из массива.
  const identityDriftCount = reusedKeys.filter(
    (key) => beforeMap.get(key) !== afterMap.get(key),
  ).length;

  const summary =
    strategy === 'stable-id'
      ? 'Стабильные ключи позволяют React связать элемент с тем же объектом данных даже после reorder.'
      : strategy === 'index'
        ? 'React переиспользует позиции, а не сами сущности. При reorder это приводит к дрейфу identity.'
        : 'Случайные ключи ломают reuse полностью: элементы заново монтируются как новые.';

  return {
    before,
    after,
    reusedCount: reusedKeys.length,
    mountedCount,
    removedCount,
    identityDriftCount,
    summary,
    snippet: [
      '{items.map((item, index) => (',
      `  <Row key={${
        strategy === 'stable-id'
          ? 'item.id'
          : strategy === 'index'
            ? 'index'
            : 'Math.random()'
      }} item={item} />`,
      '))}',
    ].join('\n'),
  };
}
