import { useRenderCount } from '../../hooks/useRenderCount';

export function ComponentAuditConsoleChunk() {
  const commits = useRenderCount();

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Audit console loaded</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Отдельный chunk привёз тяжёлую консоль только в момент открытия.
          </p>
        </div>
        <output aria-label="Audit console chunk commits" className="chip">
          {commits} commits
        </output>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {['bundle graph', 'chunk hints', 'critical CSS map'].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
