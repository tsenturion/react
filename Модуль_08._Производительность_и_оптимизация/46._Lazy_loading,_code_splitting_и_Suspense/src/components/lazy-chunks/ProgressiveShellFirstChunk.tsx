import { useRenderCount } from '../../hooks/useRenderCount';

export function ProgressiveShellFirstChunk() {
  const commits = useRenderCount();

  return (
    <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-emerald-950">Shell-first chunk ready</p>
        <output aria-label="Shell-first chunk commits" className="chip">
          {commits} commits
        </output>
      </div>
      <p className="mt-3 text-sm leading-6 text-emerald-950/80">
        Пользователь сначала видит summary и действия, а heavy visual загружается уже
        внутри готового layout.
      </p>
    </div>
  );
}
