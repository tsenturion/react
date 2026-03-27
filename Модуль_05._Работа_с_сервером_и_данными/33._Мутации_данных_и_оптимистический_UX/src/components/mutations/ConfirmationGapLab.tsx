import { FormEvent, useState } from 'react';

import { mutateRenameOnServer } from '../../lib/mutation-client';
import { mutationSeedItems, toViewItems } from '../../lib/mutation-domain';
import {
  clearPending,
  cloneItems,
  markPending,
  renameItem,
  replaceItem,
} from '../../lib/mutation-state-model';
import { MutationBoardView } from './MutationBoardView';

export function ConfirmationGapLab() {
  const [confirmedItems, setConfirmedItems] = useState(() =>
    toViewItems(mutationSeedItems.slice(0, 1)),
  );
  const [viewItems, setViewItems] = useState(() =>
    toViewItems(mutationSeedItems.slice(0, 1)),
  );
  const [title, setTitle] = useState('   новый заголовок   без формы  ');
  const [serverNote, setServerNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const confirmedItem = confirmedItems[0];
    if (!confirmedItem || busy) {
      return;
    }

    setBusy(true);
    setServerNote(null);

    const optimisticItems = markPending(
      renameItem(cloneItems(viewItems), confirmedItem.id, title),
      confirmedItem.id,
      'Локально показано до ответа сервера',
    );

    setViewItems(optimisticItems);

    const response = await mutateRenameOnServer(
      confirmedItem,
      title,
      'canonicalize',
      950,
    );

    const nextConfirmed = replaceItem(confirmedItems, confirmedItem.id, response.item);
    const nextView = clearPending(
      replaceItem(optimisticItems, confirmedItem.id, response.item),
      confirmedItem.id,
    );

    setConfirmedItems(nextConfirmed);
    setViewItems(nextView);
    setServerNote(response.note);
    setBusy(false);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-slate-200 bg-slate-50 p-5"
        >
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Новое название</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400"
            />
          </label>

          <button
            type="submit"
            disabled={busy}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            Переименовать оптимистически
          </button>
        </form>

        <MutationBoardView items={viewItems} disabled />

        {serverNote ? (
          <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            {serverNote}
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Pending vs confirmed
          </p>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <strong className="font-semibold text-slate-900">Локальный ввод:</strong>{' '}
              {title}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <strong className="font-semibold text-slate-900">
                Подтверждено сервером:
              </strong>{' '}
              {confirmedItems[0]?.title}
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Почему это важно
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Если сервер нормализует или изменяет итог, интерфейс обязан явно отличать
            локально показанное ожидание от реально подтверждённого значения.
          </p>
        </div>
      </div>
    </div>
  );
}
