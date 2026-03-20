import type { ChecklistItem } from './custom-hooks-domain';

export function cloneChecklist(items: readonly ChecklistItem[]): ChecklistItem[] {
  return items.map((item) => ({ ...item }));
}

export function toggleChecklistItem(
  items: readonly ChecklistItem[],
  itemId: string,
): ChecklistItem[] {
  return items.map((item) => (item.id === itemId ? { ...item, done: !item.done } : item));
}

export function assignChecklistOwner(
  items: readonly ChecklistItem[],
  itemId: string,
  owner: string,
): ChecklistItem[] {
  return items.map((item) => (item.id === itemId ? { ...item, owner } : item));
}

export function summarizeChecklist(items: readonly ChecklistItem[]) {
  const doneCount = items.filter((item) => item.done).length;
  const nextPending = items.find((item) => !item.done)?.title ?? 'Все шаги завершены';

  return {
    doneCount,
    totalCount: items.length,
    progressLabel: `${doneCount}/${items.length}`,
    nextPending,
  };
}
