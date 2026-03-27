import clsx from 'clsx';

import type { LessonRecord } from '../../lib/server-state-domain';
import { trackLabels } from '../../lib/server-state-domain';

export function LessonCatalogView({
  items,
  activeId,
  onSelect,
  onPublish,
  disabled = false,
}: {
  items: readonly LessonRecord[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
  onPublish?: (id: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {items.map((item) => {
        const selected = activeId === item.id;

        return (
          <article
            key={item.id}
            className={clsx(
              'rounded-[28px] border p-5 transition',
              selected ? 'border-blue-300 bg-blue-50/70' : 'border-slate-200 bg-white',
            )}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                {trackLabels[item.track]}
              </span>
              <span
                className={clsx(
                  'rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]',
                  item.status === 'published'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700',
                )}
              >
                {item.status}
              </span>
            </div>

            <h3 className="mt-3 text-lg font-semibold tracking-tight text-slate-950">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Owner: {item.owner}. Seats: {item.seats}.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {onSelect ? (
                <button
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                >
                  {selected ? 'Скрыть детали' : 'Показать детали'}
                </button>
              ) : null}

              {onPublish && item.status === 'draft' ? (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onPublish(item.id)}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                >
                  Publish
                </button>
              ) : null}
            </div>

            {selected ? (
              <div className="mt-4 rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700">
                Локальное выделение карточки не меняет server cache. Это чистый client
                state поверх уже загруженных данных.
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
