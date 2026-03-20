import type { ChecklistItem } from './complex-state-domain';

export type ArrayStateReport = {
  total: number;
  completed: number;
  orderLabel: string;
  summary: string;
  goodMethods: string[];
  avoidMethods: string[];
  snippet: string;
};

function nextChecklistNumber(items: ChecklistItem[]) {
  const numbers = items
    .map((item) => Number(item.id.replace('step-', '')))
    .filter((value) => Number.isFinite(value));

  return (numbers.length ? Math.max(...numbers) : 0) + 1;
}

export function appendChecklistItem(items: ChecklistItem[]): ChecklistItem[] {
  const nextNumber = nextChecklistNumber(items);

  return [
    ...items,
    {
      id: `step-${nextNumber}`,
      title: `Новый шаг ${nextNumber}`,
      done: false,
    },
  ];
}

export function toggleChecklistItem(
  items: ChecklistItem[],
  itemId: string,
): ChecklistItem[] {
  return items.map((item) => (item.id === itemId ? { ...item, done: !item.done } : item));
}

export function removeCompletedItems(items: ChecklistItem[]): ChecklistItem[] {
  return items.filter((item) => !item.done);
}

export function moveFirstItemToEnd(items: ChecklistItem[]): ChecklistItem[] {
  if (items.length < 2) {
    return items;
  }

  return [...items.slice(1), items[0]];
}

export function buildArrayStateReport(items: ChecklistItem[]): ArrayStateReport {
  const completed = items.filter((item) => item.done).length;

  return {
    total: items.length,
    completed,
    orderLabel: items.map((item) => item.title).join(' → '),
    summary:
      'Массив в state обычно обновляется через spread, map, filter и slice. Эти операции создают новый контейнер и сохраняют предсказуемую связь между данными и UI.',
    goodMethods: ['spread / concat', 'map', 'filter', 'slice'],
    avoidMethods: ['push', 'splice', 'reverse', 'sort'],
    snippet: [
      'setItems((current) =>',
      '  current.map((item) =>',
      '    item.id === targetId ? { ...item, done: !item.done } : item,',
      '  ),',
      ');',
    ].join('\n'),
  };
}
