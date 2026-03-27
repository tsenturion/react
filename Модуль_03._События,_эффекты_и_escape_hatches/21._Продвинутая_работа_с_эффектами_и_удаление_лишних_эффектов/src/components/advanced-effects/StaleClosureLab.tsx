import clsx from 'clsx';
import { useEffect, useState } from 'react';

import type { StaleClosureMode } from '../../lib/stale-closure-model';
import { Panel, StatusPill } from '../ui';

const modes: readonly { id: StaleClosureMode; label: string; note: string }[] = [
  {
    id: 'stale',
    label: 'stale snapshot',
    note: 'interval видит только первый render',
  },
  {
    id: 'deps',
    label: 'deps on count',
    note: 'correct, но пересоздаёт interval',
  },
  {
    id: 'functional',
    label: 'functional update',
    note: 'correct without resubscribe storm',
  },
];

export function StaleClosureLab() {
  const [mode, setMode] = useState<StaleClosureMode>('stale');
  const [running, setRunning] = useState(false);
  const [count, setCount] = useState(0);
  const [setupCount, setSetupCount] = useState(0);
  const [cleanupCount, setCleanupCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!running || mode !== 'stale') {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSetupCount((current) => current + 1);
    setLogs((current) => [`setup -> stale`, ...current].slice(0, 8));

    const intervalId = window.setInterval(() => {
      setCount(count + 1);
    }, 700);

    return () => {
      window.clearInterval(intervalId);
      setCleanupCount((current) => current + 1);
      setLogs((current) => [`cleanup -> stale`, ...current].slice(0, 8));
    };
  }, [count, mode, running]);

  useEffect(() => {
    if (!running || mode !== 'deps') {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSetupCount((current) => current + 1);
    setLogs((current) => [`setup -> deps`, ...current].slice(0, 8));

    const intervalId = window.setInterval(() => {
      setCount(count + 1);
    }, 700);

    return () => {
      window.clearInterval(intervalId);
      setCleanupCount((current) => current + 1);
      setLogs((current) => [`cleanup -> deps`, ...current].slice(0, 8));
    };
  }, [count, mode, running]);

  useEffect(() => {
    if (!running || mode !== 'functional') {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSetupCount((current) => current + 1);
    setLogs((current) => [`setup -> functional`, ...current].slice(0, 8));

    const intervalId = window.setInterval(() => {
      // Functional update читает актуальное значение из очереди state,
      // а не snapshot из render, где был создан interval.
      setCount((current) => current + 1);
    }, 700);

    return () => {
      window.clearInterval(intervalId);
      setCleanupCount((current) => current + 1);
      setLogs((current) => [`cleanup -> functional`, ...current].slice(0, 8));
    };
  }, [mode, running]);

  function resetLab() {
    setRunning(false);
    setCount(0);
    setSetupCount(0);
    setCleanupCount(0);
    setLogs([]);
  }

  return (
    <Panel className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {modes.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setMode(item.id)}
            className={clsx(
              'rounded-full px-4 py-2 text-sm font-semibold transition',
              mode === item.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Count
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{count}</p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Setup
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {setupCount}
          </p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Cleanup
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {cleanupCount}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone={running ? 'success' : 'warn'}>
          {running ? 'running' : 'stopped'}
        </StatusPill>
        <button
          type="button"
          onClick={() => setRunning((current) => !current)}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          {running ? 'Остановить interval' : 'Запустить interval'}
        </button>
        <button
          type="button"
          onClick={resetLab}
          className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          Сбросить
        </button>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Что видно
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          В режиме <strong>stale snapshot</strong> счётчик обычно замирает на `1`, потому
          что interval продолжает читать старый `count`. Режим `deps on count` исправляет
          значение, но создаёт churn из постоянных setup/cleanup. `functional update`
          оставляет один interval и при этом сохраняет актуальное состояние.
        </p>

        <div className="mt-4 space-y-2">
          {logs.map((line) => (
            <div
              key={line}
              className="rounded-2xl border border-white bg-white px-4 py-3 text-sm leading-6 text-slate-700"
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
