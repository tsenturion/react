import { useRenderCount } from '../../hooks/useRenderCount';

export function ProgressiveSkeletonChunk() {
  const commits = useRenderCount();

  return (
    <div className="rounded-[24px] border border-teal-200 bg-teal-50 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-teal-950">Skeleton chunk ready</p>
        <output aria-label="Skeleton chunk commits" className="chip">
          {commits} commits
        </output>
      </div>
      <p className="mt-3 text-sm leading-6 text-teal-950/80">
        Skeleton заранее резервирует геометрию будущего блока и делает смену состояний
        менее резкой.
      </p>
    </div>
  );
}
