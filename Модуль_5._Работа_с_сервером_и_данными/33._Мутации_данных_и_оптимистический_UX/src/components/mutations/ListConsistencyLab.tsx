import clsx from 'clsx';
import { FormEvent, useState } from 'react';

import {
  mutateCreateOnServer,
  mutateDeleteOnServer,
  MutationRequestError,
} from '../../lib/mutation-client';
import { mutationSeedItems, toViewItems } from '../../lib/mutation-domain';
import {
  buildTempItem,
  cloneItems,
  prependItem,
  removeItem,
  replaceTempItem,
} from '../../lib/mutation-state-model';
import { MutationBoardView } from './MutationBoardView';

export function ListConsistencyLab() {
  const [confirmedItems, setConfirmedItems] = useState(() =>
    toViewItems(mutationSeedItems),
  );
  const [viewItems, setViewItems] = useState(() => toViewItems(mutationSeedItems));
  const [title, setTitle] = useState('новая карточка для релиза');
  const [outcome, setOutcome] = useState<'success' | 'fail'>('success');
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleAdd = async (event: FormEvent) => {
    event.preventDefault();
    if (busy || !title.trim()) {
      return;
    }

    setBusy(true);
    setMessage(null);

    const tempId = `temp-${Date.now()}`;
    const tempItem = buildTempItem(tempId, title, 'release');
    const optimisticItems = prependItem(cloneItems(viewItems), tempItem);

    setViewItems(optimisticItems);

    try {
      const response = await mutateCreateOnServer(title, 'release', outcome, 900);
      setConfirmedItems((current) => prependItem(current, response.item));

      // Временный id нужен только на клиенте для мгновенного рендера.
      // После server confirm его надо заменить на реальный постоянный id.
      setViewItems(replaceTempItem(optimisticItems, tempId, response.item));
      setMessage(response.note);
    } catch (error) {
      setViewItems(removeItem(optimisticItems, tempId));
      setMessage(
        error instanceof MutationRequestError
          ? error.message
          : 'Неизвестная ошибка создания.',
      );
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (busy) {
      return;
    }

    const target = confirmedItems.find((item) => item.id === id);
    if (!target) {
      return;
    }

    setBusy(true);
    setMessage(null);

    const snapshot = cloneItems(viewItems);
    const optimisticItems = removeItem(snapshot, id);
    setViewItems(optimisticItems);

    try {
      const response = await mutateDeleteOnServer(target, outcome, 900);
      setConfirmedItems((current) => removeItem(current, response.removedId));
      setMessage(response.note);
    } catch (error) {
      setViewItems(snapshot);
      setMessage(
        error instanceof MutationRequestError
          ? error.message
          : 'Неизвестная ошибка удаления.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <form
          onSubmit={handleAdd}
          className="rounded-[28px] border border-slate-200 bg-slate-50 p-5"
        >
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Название новой карточки
              </span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400"
              />
            </label>

            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Outcome</span>
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
          </div>

          <button
            type="submit"
            disabled={busy}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            Добавить оптимистически
          </button>
        </form>

        <MutationBoardView items={viewItems} onDelete={handleDelete} disabled={busy} />

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
          Что раскрывает список
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
          <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            Optimistic add сначала создаёт временную карточку с client id.
          </li>
          <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            После server confirm temp id заменяется на реальный id сервера.
          </li>
          <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            При неуспешном delete запись обязана вернуться в список на прежнее место.
          </li>
        </ul>
      </div>
    </div>
  );
}
