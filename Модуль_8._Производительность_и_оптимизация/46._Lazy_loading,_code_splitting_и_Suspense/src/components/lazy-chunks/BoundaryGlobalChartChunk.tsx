import { useRenderCount } from '../../hooks/useRenderCount';

export function BoundaryGlobalChartChunk({ shellNote }: { shellNote: string }) {
  const commits = useRenderCount();

  return (
    <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-900">Sidebar stays visible</p>
          <output aria-label="Global boundary widget commits" className="chip">
            {commits} commits
          </output>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{shellNote}</p>
      </aside>
      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">
            Global boundary widget ready
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            В этом варианте под одним lazy chunk оказывается целый workspace, поэтому во
            время загрузки пропадает весь экран, а не только slot виджета.
          </p>
        </div>
      </div>
    </div>
  );
}
