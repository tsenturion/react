import type { SelectionItem } from './shared-state-domain';
import type { StatusTone } from './learning-model';

export type SiblingSyncReport = {
  tone: StatusTone;
  badLabel: string;
  goodLabel: string;
  summary: string;
  snippet: string;
};

export function deriveSelectionLabel(
  items: SelectionItem[],
  selectedId: string | null,
): string {
  return items.find((item) => item.id === selectedId)?.label ?? 'ничего не выбрано';
}

export function buildSiblingSyncReport(
  items: SelectionItem[],
  toolbarSelectedId: string | null,
  detailsSelectedId: string | null,
  sharedSelectedId: string | null,
): SiblingSyncReport {
  const badLabel = toolbarSelectedId === detailsSelectedId ? 'sync' : 'drift';

  return {
    tone: badLabel === 'drift' ? 'error' : 'success',
    badLabel,
    goodLabel: deriveSelectionLabel(items, sharedSelectedId),
    summary:
      'Если siblings держат собственные локальные копии одного и того же выбора, они расходятся. Когда selectedId поднимается к общему владельцу, toolbar и details начинают читать одно и то же состояние.',
    snippet: [
      'const [selectedId, setSelectedId] = useState("alpha");',
      '<Toolbar selectedId={selectedId} onSelect={setSelectedId} />',
      '<Details selectedId={selectedId} />',
    ].join('\n'),
  };
}
