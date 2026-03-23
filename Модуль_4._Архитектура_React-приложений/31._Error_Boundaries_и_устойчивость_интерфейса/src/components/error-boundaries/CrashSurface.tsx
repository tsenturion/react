type CrashMode = 'safe' | 'render' | 'descendant';

function ExplosiveLeaf({ label }: { label: string }) {
  throw new Error(`${label}: ошибка произошла глубже в дочернем subtree.`);
  return null;
}

export function CrashSurface({
  label,
  summary,
  mode,
}: {
  label: string;
  summary: string;
  mode: CrashMode;
}) {
  if (mode === 'render') {
    throw new Error(`${label}: boundary поймала ошибку прямо в render.`);
  }

  return (
    <article className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
        Healthy subtree
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{summary}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Ошибки
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">0</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Boundary
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">armed</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Degradation
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">local</p>
        </div>
      </div>

      {mode === 'descendant' ? <ExplosiveLeaf label={label} /> : null}
    </article>
  );
}
