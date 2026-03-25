import { useRenderCount } from '../../hooks/useRenderCount';
import type { SearchItem } from '../../lib/search-workload-model';

export function SearchProjectionPreview({
  title,
  summary,
  operations,
  items,
  pendingLabel,
}: {
  title: string;
  summary: string;
  operations: number;
  items: readonly SearchItem[];
  pendingLabel?: string;
}) {
  const commits = useRenderCount();

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{summary}</p>
        </div>
        <output aria-label={`${title} commits`} className="chip">
          {commits} commits
        </output>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            operations
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{operations}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            status
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {pendingLabel ?? 'stable'}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {items.slice(0, 5).map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <span className="chip">{item.track}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              complexity {item.complexity} / sessions {item.sessions}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
