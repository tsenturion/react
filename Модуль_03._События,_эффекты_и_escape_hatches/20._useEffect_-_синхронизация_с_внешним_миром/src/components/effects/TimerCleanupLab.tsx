import clsx from 'clsx';
import { useEffect, useEffectEvent, useRef, useState } from 'react';

import { buildTimerReport } from '../../lib/effect-timer-model';
import type { TimerMode } from '../../lib/effect-domain';
import { CodeBlock, Panel, StatusPill } from '../ui';

const timerDelays = [300, 600, 900] as const;

export function TimerCleanupLab() {
  const [mode, setMode] = useState<TimerMode>('cleanup');
  const [running, setRunning] = useState(false);
  const [delay, setDelay] = useState<(typeof timerDelays)[number]>(600);
  const [ticks, setTicks] = useState(0);
  const [activeIntervals, setActiveIntervals] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  const intervalIdsRef = useRef<number[]>([]);
  const report = buildTimerReport(mode);

  const appendLog = useEffectEvent((message: string) => {
    setLog((current) => [message, ...current].slice(0, 8));
  });

  function syncActiveIntervals(nextIds: number[]) {
    intervalIdsRef.current = nextIds;
    setActiveIntervals(nextIds.length);
  }

  useEffect(() => {
    if (!running) {
      return;
    }

    const id = window.setInterval(() => {
      setTicks((current) => current + 1);
    }, delay);

    syncActiveIntervals([...intervalIdsRef.current, id]);
    appendLog(`setup interval ${id} @ ${delay}ms`);

    if (mode === 'cleanup') {
      return () => {
        window.clearInterval(id);
        syncActiveIntervals(
          intervalIdsRef.current.filter((currentId) => currentId !== id),
        );
        appendLog(`cleanup interval ${id}`);
      };
    }

    return undefined;
  }, [running, delay, mode]);

  useEffect(() => {
    return () => {
      intervalIdsRef.current.forEach((id) => window.clearInterval(id));
      intervalIdsRef.current = [];
    };
  }, []);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {(['cleanup', 'leak'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              className={clsx('chip', mode === item && 'chip-active')}
            >
              {item === 'cleanup' ? 'С cleanup' : 'Без cleanup'}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {timerDelays.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setDelay(item)}
              className={clsx('chip', delay === item && 'chip-active')}
            >
              {item} ms
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setRunning((current) => !current)}
            className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {running ? 'Остановить timer' : 'Запустить timer'}
          </button>
          <button
            type="button"
            onClick={() => {
              setRunning(false);
              setTicks(0);
              intervalIdsRef.current.forEach((id) => window.clearInterval(id));
              syncActiveIntervals([]);
              setLog([]);
            }}
            className="chip"
          >
            Сбросить
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              ticks
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {ticks}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              active intervals
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {activeIntervals}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              mode
            </p>
            <p className="mt-2 text-base font-semibold text-slate-900">{mode}</p>
          </div>
        </div>

        <CodeBlock label={report.title} code={report.snippet} />
      </Panel>

      <Panel className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Timer status</h3>
          <StatusPill tone={report.tone}>{mode}</StatusPill>
        </div>
        <p className="text-sm leading-6 text-slate-600">{report.summary}</p>

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
              Запустите timer и меняйте delay. В режиме без cleanup быстро станет видно,
              как накапливаются активные интервалы.
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
