import { useState } from 'react';

import { buildPropDrillingReport } from '../../lib/prop-drilling-model';

type TrackId = 'state' | 'architecture' | 'forms';

function LeafCard({
  selectedTrack,
  onTrackChange,
}: {
  selectedTrack: TrackId;
  onTrackChange: (track: TrackId) => void;
}) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        leaf
      </p>
      <p className="mt-2 text-sm text-slate-700">selectedTrack: {selectedTrack}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {(['state', 'architecture', 'forms'] as const).map((track) => (
          <button
            key={track}
            type="button"
            onClick={() => onTrackChange(track)}
            className={selectedTrack === track ? 'chip chip-active' : 'chip'}
          >
            {track}
          </button>
        ))}
      </div>
    </div>
  );
}

function LessonColumn({
  selectedTrack,
  onTrackChange,
}: {
  selectedTrack: TrackId;
  onTrackChange: (track: TrackId) => void;
}) {
  return (
    <div className="space-y-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        lesson column forwards: selectedTrack, onTrackChange
      </p>
      <LeafCard selectedTrack={selectedTrack} onTrackChange={onTrackChange} />
    </div>
  );
}

function SidebarFrame({
  selectedTrack,
  onTrackChange,
}: {
  selectedTrack: TrackId;
  onTrackChange: (track: TrackId) => void;
}) {
  return (
    <div className="space-y-3 rounded-[24px] border border-slate-200 bg-slate-100 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        sidebar frame forwards: selectedTrack, onTrackChange
      </p>
      <LessonColumn selectedTrack={selectedTrack} onTrackChange={onTrackChange} />
    </div>
  );
}

function Shell({
  selectedTrack,
  onTrackChange,
}: {
  selectedTrack: TrackId;
  onTrackChange: (track: TrackId) => void;
}) {
  return (
    <div className="space-y-3 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        shell forwards: selectedTrack, onTrackChange
      </p>
      <SidebarFrame selectedTrack={selectedTrack} onTrackChange={onTrackChange} />
    </div>
  );
}

export function PropDrillingTraceLab() {
  const [selectedTrack, setSelectedTrack] = useState<TrackId>('state');
  const report = buildPropDrillingReport(3, ['selectedTrack', 'onTrackChange']);

  return (
    <div className="space-y-5">
      <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          prop drilling
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-slate-900">
          Root владеет состоянием, а промежуточные уровни просто прокидывают его ниже
        </h3>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-[24px] border border-black/10 bg-white/65 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              depth
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              {report.depth}
            </p>
          </div>
          <div className="rounded-[24px] border border-orange-300/60 bg-orange-100/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              forwarded props
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              {report.forwardedProps}
            </p>
          </div>
          <div className="rounded-[24px] border border-teal-300/60 bg-teal-100/60 p-4 text-sm leading-6 text-slate-600">
            {report.summary}
          </div>
        </div>
      </article>

      <Shell selectedTrack={selectedTrack} onTrackChange={setSelectedTrack} />
    </div>
  );
}
