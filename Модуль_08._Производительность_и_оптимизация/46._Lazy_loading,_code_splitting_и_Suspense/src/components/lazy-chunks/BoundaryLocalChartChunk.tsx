import { useRenderCount } from '../../hooks/useRenderCount';

export function BoundaryLocalChartChunk() {
  const commits = useRenderCount();

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">
          Local boundary widget ready
        </p>
        <output aria-label="Local boundary widget commits" className="chip">
          {commits} commits
        </output>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Здесь грузится тот же по смыслу тяжёлый блок, но shell и summary остаются на
        месте, потому что Suspense стоит локально.
      </p>
    </div>
  );
}
