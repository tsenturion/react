export type MutationCatalogItem = {
  id: string;
  title: string;
  lane: 'content' | 'review' | 'release';
  done: boolean;
  owner: string;
};

export type MutationViewItem = MutationCatalogItem & {
  pending?: boolean;
  pendingLabel?: string;
  temp?: boolean;
};

export type MutationOutcome = 'success' | 'fail' | 'canonicalize';
export type MutationStrategy = 'optimistic' | 'confirmed';

export const mutationSeedItems: readonly MutationCatalogItem[] = [
  {
    id: 'item-1',
    title: 'Подготовить краткое описание урока',
    lane: 'content',
    done: false,
    owner: 'Контент',
  },
  {
    id: 'item-2',
    title: 'Проверить комментарии в неочевидных местах',
    lane: 'review',
    done: true,
    owner: 'Code review',
  },
  {
    id: 'item-3',
    title: 'Проверить docker preview',
    lane: 'release',
    done: false,
    owner: 'Ops',
  },
] as const;

export function toViewItems(items: readonly MutationCatalogItem[]): MutationViewItem[] {
  return items.map((item) => ({ ...item }));
}
