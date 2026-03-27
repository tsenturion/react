import type { MutationCatalogItem, MutationViewItem } from './mutation-domain';

export function cloneItems(items: readonly MutationViewItem[]) {
  return items.map((item) => ({ ...item }));
}

export function toggleDone(items: readonly MutationViewItem[], id: string) {
  return items.map((item) => (item.id === id ? { ...item, done: !item.done } : item));
}

export function renameItem(
  items: readonly MutationViewItem[],
  id: string,
  title: string,
) {
  return items.map((item) => (item.id === id ? { ...item, title } : item));
}

export function removeItem(items: readonly MutationViewItem[], id: string) {
  return items.filter((item) => item.id !== id);
}

export function prependItem(items: readonly MutationViewItem[], item: MutationViewItem) {
  return [item, ...items];
}

export function replaceItem(
  items: readonly MutationViewItem[],
  id: string,
  nextItem: MutationCatalogItem,
) {
  return items.map((item) =>
    item.id === id ? { ...nextItem, pending: false, pendingLabel: undefined } : item,
  );
}

export function replaceTempItem(
  items: readonly MutationViewItem[],
  tempId: string,
  nextItem: MutationCatalogItem,
) {
  return items.map((item) =>
    item.id === tempId ? { ...nextItem, pending: false, temp: false } : item,
  );
}

export function markPending(
  items: readonly MutationViewItem[],
  id: string,
  label: string,
) {
  return items.map((item) =>
    item.id === id ? { ...item, pending: true, pendingLabel: label } : item,
  );
}

export function clearPending(items: readonly MutationViewItem[], id: string) {
  return items.map((item) =>
    item.id === id
      ? { ...item, pending: false, pendingLabel: undefined, temp: false }
      : item,
  );
}

export function buildTempItem(
  tempId: string,
  title: string,
  lane: MutationCatalogItem['lane'],
) {
  return {
    id: tempId,
    title,
    lane,
    done: false,
    owner: 'Локально',
    pending: true,
    pendingLabel: 'Ожидает серверного id',
    temp: true,
  } satisfies MutationViewItem;
}
