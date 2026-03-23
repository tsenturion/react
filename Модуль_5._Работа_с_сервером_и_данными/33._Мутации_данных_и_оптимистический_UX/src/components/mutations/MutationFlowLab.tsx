import { useState } from 'react';

import { mutateToggleOnServer } from '../../lib/mutation-client';
import { mutationSeedItems, toViewItems } from '../../lib/mutation-domain';
import {
  clearPending,
  cloneItems,
  markPending,
  replaceItem,
  toggleDone,
} from '../../lib/mutation-state-model';
import { MutationBoardView } from './MutationBoardView';

export function MutationFlowLab() {
  const [confirmedItems, setConfirmedItems] = useState(() =>
    toViewItems(mutationSeedItems),
  );
  const [viewItems, setViewItems] = useState(() => toViewItems(mutationSeedItems));
  const [timeline, setTimeline] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const pushTimeline = (entry: string) => {
    setTimeline((current) => [entry, ...current].slice(0, 6));
  };

  const handleToggle = async (id: string) => {
    const confirmedItem = confirmedItems.find((item) => item.id === id);

    if (!confirmedItem || busy) {
      return;
    }

    setBusy(true);

    const optimisticItems = markPending(
      toggleDone(cloneItems(viewItems), id),
      id,
      'Ожидает подтверждение сервера',
    );

    setViewItems(optimisticItems);
    pushTimeline('optimistic patch: UI изменился до ответа сервера');

    const response = await mutateToggleOnServer(confirmedItem, 'success', 900);
    const nextConfirmed = replaceItem(confirmedItems, id, response.item);

    setConfirmedItems(nextConfirmed);
    setViewItems(clearPending(replaceItem(optimisticItems, id, response.item), id));
    pushTimeline(response.note);
    setBusy(false);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm leading-6 text-slate-600">
            Нажмите `Подтвердить` и проследите три состояния одного и того же действия:
            локальный optimistic patch, pending UI и server confirmation.
          </p>
        </div>

        <MutationBoardView items={viewItems} onToggle={handleToggle} disabled={busy} />
      </div>

      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Что видно в flow
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              1. Пользовательское действие запускает mutation request.
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              2. Интерфейс показывает ожидаемый результат заранее и помечает его как
              pending.
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              3. После server confirm optimistic layer исчезает, а состояние становится
              подтверждённым.
            </li>
          </ul>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Mutation timeline
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            {timeline.length > 0 ? (
              timeline.map((entry) => (
                <li
                  key={entry}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  {entry}
                </li>
              ))
            ) : (
              <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                Пока timeline пуст. Запустите одну мутацию.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
