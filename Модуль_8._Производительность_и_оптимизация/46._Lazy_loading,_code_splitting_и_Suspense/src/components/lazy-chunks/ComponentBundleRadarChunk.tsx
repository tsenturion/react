import { useRenderCount } from '../../hooks/useRenderCount';

export function ComponentBundleRadarChunk() {
  const commits = useRenderCount();

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Bundle radar loaded</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Этот panel рисуется отдельным чанком и не утяжеляет стартовый экран до первого
            открытия.
          </p>
        </div>
        <output aria-label="Bundle radar chunk commits" className="chip">
          {commits} commits
        </output>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {[42, 19, 11].map((item, index) => (
          <div
            key={item}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              chunk {index + 1}
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{item} kB</p>
          </div>
        ))}
      </div>
    </div>
  );
}
