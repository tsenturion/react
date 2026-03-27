import clsx from 'clsx';
import { useCallback, useEffect, useId, useState } from 'react';

import {
  type BranchMode,
  buildBranchIdentityReport,
} from '../../lib/branch-identity-model';
import { StatusPill } from '../ui';

type Track = {
  id: 'basic' | 'advanced';
  label: string;
  seed: string;
};

const tracks: readonly Track[] = [
  {
    id: 'basic',
    label: 'Базовый трек',
    seed: 'Упростить API компонента и оставить один surface.',
  },
  {
    id: 'advanced',
    label: 'Продвинутый трек',
    seed: 'Разделить surface и container, чтобы отследить remount.',
  },
] as const;

export function BranchIdentityLab() {
  const [mode, setMode] = useState<BranchMode>('same-type');
  const [trackId, setTrackId] = useState<Track['id']>('basic');
  const [logs, setLogs] = useState<string[]>([]);
  const report = buildBranchIdentityReport(mode);
  const activeTrack = tracks.find((track) => track.id === trackId) ?? tracks[0];

  const appendLog = useCallback((message: string) => {
    setLogs((current) =>
      [`${new Date().toLocaleTimeString('ru-RU')} · ${message}`, ...current].slice(0, 8),
    );
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setMode('same-type')}
          className={clsx('chip', mode === 'same-type' && 'chip-active')}
        >
          Один type
        </button>
        <button
          type="button"
          onClick={() => setMode('different-type')}
          className={clsx('chip', mode === 'different-type' && 'chip-active')}
        >
          Разные types
        </button>

        {tracks.map((track) => (
          <button
            key={track.id}
            type="button"
            onClick={() => setTrackId(track.id)}
            className={clsx('chip', track.id === trackId && 'chip-active')}
          >
            {track.label}
          </button>
        ))}

        <button type="button" onClick={() => setLogs([])} className="chip">
          Очистить журнал
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <StatusPill tone={report.tone}>{report.title}</StatusPill>
                <p className="mt-3 text-sm leading-6 text-slate-700">{report.summary}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {report.consequence}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-100 px-4 py-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                slot `branch[0]`
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4">
            {
              // В первой ветке React видит один и тот же component type в том же slot.
              // Во второй — разные function components, поэтому старое поддерево снимается.
            }
            {mode === 'same-type' ? (
              <SharedTrackPanel track={activeTrack} onLog={appendLog} />
            ) : activeTrack.id === 'basic' ? (
              <BasicTrackPanel track={activeTrack} onLog={appendLog} />
            ) : (
              <AdvancedTrackPanel track={activeTrack} onLog={appendLog} />
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Журнал mount / unmount
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            {logs.length > 0 ? (
              logs.map((entry) => (
                <li key={entry} className="rounded-2xl bg-slate-50 px-4 py-3">
                  {entry}
                </li>
              ))
            ) : (
              <li className="rounded-2xl bg-slate-50 px-4 py-3">
                Переключите ветку или трек, чтобы увидеть поведение lifecycle.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function SharedTrackPanel({
  track,
  onLog,
}: {
  track: Track;
  onLog: (message: string) => void;
}) {
  const instanceId = `shared-${useId()}`;
  const [notes, setNotes] = useState(track.seed);
  const [score, setScore] = useState(0);

  useEffect(() => {
    onLog(`SharedTrackPanel смонтирован как ${instanceId}.`);

    return () => {
      onLog(`SharedTrackPanel ${instanceId} снят с дерева.`);
    };
  }, [instanceId, onLog]);

  useEffect(() => {
    onLog(`SharedTrackPanel получил новые props: ${track.label}, state сохранён.`);
  }, [onLog, track.label]);

  return (
    <TrackCard
      accent="emerald"
      title={track.label}
      notes={notes}
      onNotesChange={setNotes}
      score={score}
      onScoreChange={setScore}
      instanceId={instanceId}
    />
  );
}

function BasicTrackPanel({
  track,
  onLog,
}: {
  track: Track;
  onLog: (message: string) => void;
}) {
  return <TypedTrackPanel variant="basic" track={track} onLog={onLog} />;
}

function AdvancedTrackPanel({
  track,
  onLog,
}: {
  track: Track;
  onLog: (message: string) => void;
}) {
  return <TypedTrackPanel variant="advanced" track={track} onLog={onLog} />;
}

function TypedTrackPanel({
  variant,
  track,
  onLog,
}: {
  variant: 'basic' | 'advanced';
  track: Track;
  onLog: (message: string) => void;
}) {
  const instanceId = `${variant}-${useId()}`;
  const [notes, setNotes] = useState(track.seed);
  const [score, setScore] = useState(0);

  useEffect(() => {
    onLog(`${variant} panel смонтирован как ${instanceId}.`);

    return () => {
      onLog(`${variant} panel ${instanceId} снят с дерева.`);
    };
  }, [instanceId, onLog, variant]);

  return (
    <TrackCard
      accent={variant === 'basic' ? 'amber' : 'blue'}
      title={`${track.label} · ${variant === 'basic' ? 'basic type' : 'advanced type'}`}
      notes={notes}
      onNotesChange={setNotes}
      score={score}
      onScoreChange={setScore}
      instanceId={instanceId}
    />
  );
}

function TrackCard({
  accent,
  title,
  notes,
  onNotesChange,
  score,
  onScoreChange,
  instanceId,
}: {
  accent: 'emerald' | 'amber' | 'blue';
  title: string;
  notes: string;
  onNotesChange: (nextValue: string) => void;
  score: number;
  onScoreChange: (nextValue: number) => void;
  instanceId: string;
}) {
  const palette =
    accent === 'emerald'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
      : accent === 'amber'
        ? 'border-amber-200 bg-amber-50 text-amber-950'
        : 'border-blue-200 bg-blue-50 text-blue-950';

  return (
    <section className={clsx('rounded-[24px] border p-5', palette)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em]">Branch demo</p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight">{title}</h3>
        </div>
        <div className="rounded-2xl bg-white/70 px-4 py-3 text-right">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            instance
          </p>
          <p className="mt-1 font-mono text-xs text-slate-800">{instanceId}</p>
        </div>
      </div>

      <label className="mt-5 block space-y-2 text-sm">
        <span className="font-medium">Локальные заметки компонента</span>
        <textarea
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
          rows={4}
          className="w-full rounded-2xl border border-white/80 bg-white/85 px-4 py-3 text-slate-900 outline-none"
        />
      </label>

      <button
        type="button"
        onClick={() => onScoreChange(score + 1)}
        className="mt-4 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
      >
        Локальный счётчик: {score}
      </button>
    </section>
  );
}
