import type { PlaybookEntry } from '../../lib/http-domain';

export function PlaybookList({
  items,
  compact = false,
}: {
  items: readonly PlaybookEntry[];
  compact?: boolean;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-[24px] border border-slate-200 bg-white p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {item.category}
              </p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
                {item.title}
              </h3>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
              {item.risk}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{item.summary}</p>
          {!compact ? (
            <p className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
              {item.note}
            </p>
          ) : null}
        </article>
      ))}
    </div>
  );
}
