import clsx from 'clsx';

import type { TrackKind, TrackSample } from '../../lib/performance-tracks-model';

function laneClassName(kind: TrackKind) {
  if (kind === 'input') {
    return 'bg-amber-500';
  }

  if (kind === 'render') {
    return 'bg-cyan-500';
  }

  if (kind === 'commit') {
    return 'bg-emerald-500';
  }

  if (kind === 'network') {
    return 'bg-rose-500';
  }

  return 'bg-violet-500';
}

export function TrackTimeline({ samples }: { samples: readonly TrackSample[] }) {
  const totalDuration = samples.reduce((sum, item) => sum + item.durationMs, 0) || 1;

  return (
    <div className="space-y-3">
      {samples.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{item.label}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                {item.kind} track
              </p>
            </div>
            <span className="chip">{item.durationMs.toFixed(1)} ms</span>
          </div>
          <div className="mt-3 h-3 rounded-full bg-slate-100">
            <div
              className={clsx('h-full rounded-full', laneClassName(item.kind))}
              style={{
                width: `${Math.max(8, (item.durationMs / totalDuration) * 100)}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
