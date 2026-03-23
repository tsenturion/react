import clsx from 'clsx';
import { useState } from 'react';

import { mutateToggleOnServer, MutationRequestError } from '../../lib/mutation-client';
import { mutationSeedItems, toViewItems } from '../../lib/mutation-domain';
import {
  clearPending,
  cloneItems,
  markPending,
  replaceItem,
  toggleDone,
} from '../../lib/mutation-state-model';
import { MutationBoardView } from './MutationBoardView';

export function RollbackLab() {
  const [confirmedItems, setConfirmedItems] = useState(() =>
    toViewItems(mutationSeedItems),
  );
  const [viewItems, setViewItems] = useState(() => toViewItems(mutationSeedItems));
  const [outcome, setOutcome] = useState<'success' | 'fail'>('fail');
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleToggle = async (id: string) => {
    const confirmedItem = confirmedItems.find((item) => item.id === id);

    if (!confirmedItem || busy) {
      return;
    }

    setBusy(true);
    setMessage(null);

    // Snapshot нужен не для истории ради истории, а как точка возврата,
    // если optimistic patch не будет подтверждён сервером.
    const snapshot = cloneItems(viewItems);
    const optimisticItems = markPending(toggleDone(snapshot, id), id, 'Ожидает сервер');

    setViewItems(optimisticItems);

    try {
      const response = await mutateToggleOnServer(confirmedItem, outcome, 950);
      const nextConfirmed = replaceItem(confirmedItems, id, response.item);
      setConfirmedItems(nextConfirmed);
      setViewItems(clearPending(replaceItem(optimisticItems, id, response.item), id));
      setMessage(response.note);
    } catch (error) {
      setViewItems(snapshot);
      setMessage(
        error instanceof MutationRequestError
          ? error.message
          : 'Неизвестная ошибка мутации.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-wrap gap-2">
            {(['success', 'fail'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setOutcome(value)}
                className={clsx(
                  'rounded-xl px-4 py-2 text-sm font-medium transition',
                  outcome === value
                    ? value === 'success'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-rose-600 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100',
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <MutationBoardView
          items={viewItems.slice(0, 2)}
          onToggle={handleToggle}
          disabled={busy}
        />

        {message ? (
          <div
            className={clsx(
              'rounded-[24px] border p-4 text-sm leading-6',
              outcome === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
                : 'border-rose-200 bg-rose-50 text-rose-950',
            )}
          >
            {message}
          </div>
        ) : null}
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Ключевой смысл rollback
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Optimistic UX не отменяет ответственность за согласованность данных. Если сервер
          не подтвердил изменение, интерфейс обязан вернуть пользователя к последнему
          подтверждённому состоянию.
        </p>
      </div>
    </div>
  );
}
