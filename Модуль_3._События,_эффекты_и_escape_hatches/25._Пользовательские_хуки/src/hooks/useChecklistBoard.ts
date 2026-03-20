import { useState } from 'react';

import { initialChecklist, type ChecklistItem } from '../lib/custom-hooks-domain';
import {
  assignChecklistOwner,
  cloneChecklist,
  summarizeChecklist,
  toggleChecklistItem,
} from '../lib/checklist-model';

export function useChecklistBoard(seed: readonly ChecklistItem[] = initialChecklist) {
  const [items, setItems] = useState(() => cloneChecklist(seed));

  const summary = summarizeChecklist(items);

  return {
    items,
    summary,
    // Вместо утечки setItems наружу hook отдаёт доменные команды,
    // чтобы экран не знал внутреннюю форму данных больше, чем нужно.
    toggleItem: (itemId: string) => {
      setItems((current) => toggleChecklistItem(current, itemId));
    },
    assignOwner: (itemId: string, owner: string) => {
      setItems((current) => assignChecklistOwner(current, itemId, owner));
    },
    reset: () => {
      setItems(cloneChecklist(seed));
    },
  };
}
