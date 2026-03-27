import type { ReferenceItem } from './complex-state-domain';

export type ReferenceStrategy = 'targeted' | 'deep-clone';

export type ReferenceReuseReport = {
  strategy: ReferenceStrategy;
  reusedCount: number;
  recreatedCount: number;
  changedIds: string[];
  summary: string;
  snippet: string;
  rows: {
    id: string;
    title: string;
    reused: boolean;
  }[];
};

export function updateReferenceItemTargeted(
  items: ReferenceItem[],
  itemId: string,
): ReferenceItem[] {
  return items.map((item) =>
    item.id === itemId ? { ...item, score: item.score + 1 } : item,
  );
}

export function updateReferenceItemsDeepClone(
  items: ReferenceItem[],
  itemId: string,
): ReferenceItem[] {
  return items.map((item) => ({
    ...item,
    owner: { ...item.owner },
    score: item.id === itemId ? item.score + 1 : item.score,
  }));
}

export function buildReferenceReuseReport(
  previousItems: ReferenceItem[],
  nextItems: ReferenceItem[],
  strategy: ReferenceStrategy,
): ReferenceReuseReport {
  const rows = previousItems.map((item, index) => ({
    id: item.id,
    title: item.title,
    reused: item === nextItems[index],
  }));
  const reusedCount = rows.filter((row) => row.reused).length;
  const recreatedCount = rows.length - reusedCount;

  return {
    strategy,
    reusedCount,
    recreatedCount,
    changedIds: rows.filter((row) => !row.reused).map((row) => row.id),
    summary:
      strategy === 'targeted'
        ? 'Точечное копирование сохраняет ссылки на неизменённые элементы. Это помогает memoized-поддеревьям и уменьшает лишнюю работу при сравнении.'
        : 'Глубокое копирование всех элементов делает новые ссылки даже там, где данные не менялись. UI останется корректным, но сравнение станет шумнее и дороже.',
    snippet:
      strategy === 'targeted'
        ? [
            'const next = items.map((item) =>',
            '  item.id === targetId ? { ...item, score: item.score + 1 } : item,',
            ');',
          ].join('\n')
        : [
            'const next = items.map((item) => ({',
            '  ...item,',
            '  owner: { ...item.owner },',
            '  score: item.id === targetId ? item.score + 1 : item.score,',
            '}));',
          ].join('\n'),
    rows,
  };
}
