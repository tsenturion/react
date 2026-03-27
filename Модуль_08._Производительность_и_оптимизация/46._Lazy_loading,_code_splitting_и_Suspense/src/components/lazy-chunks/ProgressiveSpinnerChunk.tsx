import { useRenderCount } from '../../hooks/useRenderCount';

export function ProgressiveSpinnerChunk() {
  const commits = useRenderCount();

  return (
    <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-amber-950">Spinner chunk ready</p>
        <output aria-label="Spinner chunk commits" className="chip">
          {commits} commits
        </output>
      </div>
      <p className="mt-3 text-sm leading-6 text-amber-950/80">
        Spinner сам по себе не плох, но без сохранённого контекста экран легко начинает
        восприниматься как пустое ожидание.
      </p>
    </div>
  );
}
