import clsx from 'clsx';
import { useEffect, useEffectEvent, useState } from 'react';

import {
  buildLifecycleReport,
  type LifecycleReport,
} from '../../lib/effect-lifecycle-model';
import { effectRooms, type DependencyStrategy } from '../../lib/effect-domain';
import { CodeBlock, Panel, StatusPill } from '../ui';

export function LifecycleLab() {
  const [strategy, setStrategy] = useState<DependencyStrategy>('complete');
  const [roomId, setRoomId] = useState<(typeof effectRooms)[number]['id']>('dom');
  const [trackedRoom, setTrackedRoom] =
    useState<(typeof effectRooms)[number]['id']>('dom');
  const [presenceSync, setPresenceSync] = useState(true);
  const [syncedRoom, setSyncedRoom] = useState('dom');
  const [syncCount, setSyncCount] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  const report: LifecycleReport = buildLifecycleReport(strategy);
  const appendLog = useEffectEvent((message: string) => {
    setLog((current) => [message, ...current].slice(0, 8));
  });

  useEffect(() => {
    const signature = `${trackedRoom} / presence=${String(presenceSync)}`;
    const ackId = window.setTimeout(() => {
      setSyncedRoom(trackedRoom);
      setSyncCount((current) => current + 1);
      appendLog(`ack sync → ${signature}`);
    }, 80);

    appendLog(`setup → ${signature}`);

    return () => {
      window.clearTimeout(ackId);
      appendLog(`cleanup → ${signature}`);
    };
  }, [presenceSync, strategy, trackedRoom]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {(['complete', 'missing-room'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setStrategy(item);
                if (item === 'complete') {
                  setTrackedRoom(roomId);
                }
              }}
              className={clsx('chip', strategy === item && 'chip-active')}
            >
              {item === 'complete' ? 'Полные dependencies' : 'Пропущен roomId'}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {effectRooms.map((room) => (
            <button
              key={room.id}
              type="button"
              onClick={() => {
                setRoomId(room.id);
                if (strategy === 'complete') {
                  setTrackedRoom(room.id);
                }
              }}
              className={clsx('chip', roomId === room.id && 'chip-active')}
            >
              {room.title}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={presenceSync}
              onChange={(event) => setPresenceSync(event.target.checked)}
            />
            presenceSync
          </label>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">Probe</p>
            <StatusPill tone={syncedRoom === roomId ? 'success' : 'warn'}>
              {syncedRoom === roomId ? 'sync актуален' : 'sync stale'}
            </StatusPill>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                current room
              </p>
              <p className="mt-2 font-semibold text-slate-900">{roomId}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                synced room
              </p>
              <p className="mt-2 font-semibold text-slate-900">{syncedRoom}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                effect runs
              </p>
              <p className="mt-2 font-semibold text-slate-900">{syncCount}</p>
            </div>
          </div>
        </div>

        <CodeBlock label={report.title} code={report.snippet} />
      </Panel>

      <Panel className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Lifecycle log</h3>
          <StatusPill tone={report.tone}>{strategy}</StatusPill>
        </div>

        <p className="text-sm leading-6 text-slate-600">{report.summary}</p>

        <div className="space-y-2">
          {report.consequences.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {log.length > 0 ? (
            log.map((entry, index) => (
              <div
                key={`${entry}-${index}`}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700"
              >
                {entry}
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-500">
              Переключайте room и `presenceSync`. Здесь появится порядок setup, ack и
              cleanup.
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
