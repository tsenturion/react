import clsx from 'clsx';

import type { MutationViewItem } from '../../lib/mutation-domain';

export function MutationBoardView({
  items,
  onToggle,
  onDelete,
  disabled = false,
}: {
  items: readonly MutationViewItem[];
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article
          key={item.id}
          className={clsx(
            'rounded-[24px] border p-4 transition',
            item.done
              ? 'border-emerald-200 bg-emerald-50/70'
              : 'border-slate-200 bg-white',
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                  {item.lane}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                  {item.owner}
                </span>
                {item.pending ? (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-800">
                    {item.pendingLabel ?? 'pending'}
                  </span>
                ) : null}
                {item.temp ? (
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-800">
                    temp id
                  </span>
                ) : null}
              </div>

              <h3
                className={clsx(
                  'text-lg font-semibold tracking-tight text-slate-950',
                  item.done && 'line-through decoration-2 decoration-emerald-600/60',
                )}
              >
                {item.title}
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {onToggle ? (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onToggle(item.id)}
                  className={clsx(
                    'rounded-xl px-3 py-2 text-sm font-semibold transition',
                    disabled
                      ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                      : 'bg-blue-600 text-white hover:bg-blue-700',
                  )}
                >
                  {item.done ? 'Вернуть' : 'Подтвердить'}
                </button>
              ) : null}

              {onDelete ? (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onDelete(item.id)}
                  className={clsx(
                    'rounded-xl px-3 py-2 text-sm font-semibold transition',
                    disabled
                      ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                      : 'bg-white text-rose-700 hover:bg-rose-50',
                  )}
                >
                  Удалить
                </button>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
