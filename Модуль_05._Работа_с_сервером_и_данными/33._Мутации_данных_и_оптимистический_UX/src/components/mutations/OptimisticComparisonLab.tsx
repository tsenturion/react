import { useState } from 'react';

import { mutateToggleOnServer } from '../../lib/mutation-client';
import {
  mutationSeedItems,
  toViewItems,
  type MutationStrategy,
} from '../../lib/mutation-domain';
import {
  clearPending,
  cloneItems,
  markPending,
  replaceItem,
  toggleDone,
} from '../../lib/mutation-state-model';
import { MutationBoardView } from './MutationBoardView';

function StrategyPanel({ strategy }: { strategy: MutationStrategy }) {
  const [confirmedItems, setConfirmedItems] = useState(() =>
    toViewItems(mutationSeedItems),
  );
  const [viewItems, setViewItems] = useState(() => toViewItems(mutationSeedItems));
  const [busy, setBusy] = useState(false);

  const handleToggle = async (id: string) => {
    const confirmedItem = confirmedItems.find((item) => item.id === id);

    if (!confirmedItem || busy) {
      return;
    }

    setBusy(true);

    let workingItems = cloneItems(viewItems);

    if (strategy === 'optimistic') {
      workingItems = markPending(
        toggleDone(workingItems, id),
        id,
        'UI уже показывает ожидаемый итог',
      );
      setViewItems(workingItems);
    } else {
      workingItems = markPending(
        workingItems,
        id,
        'Ждёт ответ сервера без локального изменения',
      );
      setViewItems(workingItems);
    }

    const response = await mutateToggleOnServer(confirmedItem, 'success', 1000);
    const nextConfirmed = replaceItem(confirmedItems, id, response.item);
    const nextView =
      strategy === 'optimistic'
        ? clearPending(replaceItem(workingItems, id, response.item), id)
        : clearPending(replaceItem(viewItems, id, response.item), id);

    setConfirmedItems(nextConfirmed);
    setViewItems(nextView);
    setBusy(false);
  };

  return (
    <div className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {strategy}
        </p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
          {strategy === 'optimistic'
            ? 'Интерфейс реагирует сразу'
            : 'Интерфейс ждёт server confirmation'}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {strategy === 'optimistic'
            ? 'Состояние меняется мгновенно, но до ответа сервера это только ожидаемый результат.'
            : 'Пока сервер не ответил, UI не утверждает, что действие уже выполнено.'}
        </p>
      </div>

      <MutationBoardView
        items={viewItems.slice(0, 1)}
        onToggle={handleToggle}
        disabled={busy}
      />
    </div>
  );
}

export function OptimisticComparisonLab() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <StrategyPanel strategy="optimistic" />
      <StrategyPanel strategy="confirmed" />
    </div>
  );
}
