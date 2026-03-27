export type KeyStrategy = 'stable-id' | 'index' | 'version';
export type ListOperation = 'stable' | 'reverse' | 'prepend' | 'remove-first';

type LessonListItem = {
  id: string;
  title: string;
};

type SnapshotItem = LessonListItem & {
  key: string;
};

export type ListIdentityReport = {
  before: SnapshotItem[];
  after: SnapshotItem[];
  reusedCount: number;
  mountedCount: number;
  removedCount: number;
  identityDriftCount: number;
  summary: string;
  snippet: string;
};

const baseItems: readonly LessonListItem[] = [
  { id: '12', title: 'useState snapshot' },
  { id: '13', title: 'Иммутабельность' },
  { id: '14', title: 'Архитектура state' },
  { id: '15', title: 'Поднятие state' },
] as const;

function applyOperation(operation: ListOperation) {
  if (operation === 'stable') return [...baseItems];
  if (operation === 'reverse') return [...baseItems].reverse();
  if (operation === 'prepend') {
    return [{ id: '17', title: 'Identity state' }, ...baseItems];
  }

  return baseItems.slice(1);
}

function withKeys(
  items: readonly LessonListItem[],
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

export function analyzeListIdentity(
  strategy: KeyStrategy,
  operation: ListOperation,
): ListIdentityReport {
  const before = withKeys(baseItems, strategy, 'before');
  const after = withKeys(applyOperation(operation), strategy, 'after');

  const beforeMap = new Map(before.map((item) => [item.key, item.id]));
  const afterMap = new Map(after.map((item) => [item.key, item.id]));
  const reusedKeys = after
    .filter((item) => beforeMap.has(item.key))
    .map((item) => item.key);
  const mountedCount = after.filter((item) => !beforeMap.has(item.key)).length;
  const removedCount = before.filter((item) => !afterMap.has(item.key)).length;
  const identityDriftCount = reusedKeys.filter(
    (key) => beforeMap.get(key) !== afterMap.get(key),
  ).length;

  const summary =
    strategy === 'stable-id'
      ? 'Стабильные id удерживают state за тем же объектом данных даже после reorder.'
      : strategy === 'index'
        ? 'Индекс привязывает state к позиции, а не к сущности, поэтому после reorder локальные данные дрейфуют.'
        : 'Version-key меняется на каждом рендере и заставляет все строки монтироваться заново.';

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
      `  <LessonRow key=${
        strategy === 'stable-id'
          ? '{item.id}'
          : strategy === 'index'
            ? '{index}'
            : '{`${item.id}-${version}`}'
      } item={item} />`,
      '))}',
    ].join('\n'),
  };
}
