import { useRenderCount } from '../../hooks/useRenderCount';
import type { PerformanceCase } from '../../lib/performance-cases-model';

export function CaseProjectionPreview({
  title,
  summary,
  operations,
  totalDuration,
  items,
  statusLabel,
}: {
  title: string;
  summary: string;
  operations: number;
  totalDuration: number;
  items: readonly PerformanceCase[];
  statusLabel: string;
}) {
  const commits = useRenderCount();

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{summary}</p>
        </div>
        <output
          aria-label={`${title} commits`}
          className="chip rounded-full border border-slate-200 bg-slate-50"
        >
          {commits} commits
        </output>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            operations
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{operations}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            total duration
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {totalDuration.toFixed(0)} ms
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            status
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">{statusLabel}</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <span className="chip">{item.area}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
