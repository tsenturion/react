import { useEffect, useRef, useState } from 'react';

import { createDemoConsole } from '../../lib/ref-domain';
import { formatElapsed } from '../../lib/timer-object-model';
import { Panel, StatusPill } from '../ui';

type ConsoleSnapshot = {
  id: number | null;
  pings: number;
  status: 'empty' | 'idle' | 'running' | 'stopped';
};

export function TimersObjectsLab() {
  const intervalRef = useRef<number | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const consoleRef = useRef<ReturnType<typeof createDemoConsole> | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [timerStored, setTimerStored] = useState(false);
  const [consoleSnapshot, setConsoleSnapshot] = useState<ConsoleSnapshot>({
    id: null,
    pings: 0,
    status: 'empty',
  });

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }

      consoleRef.current?.stop();
    };
  }, []);

  function syncConsoleSnapshot() {
    const consoleInstance = consoleRef.current;

    if (!consoleInstance) {
      setConsoleSnapshot({
        id: null,
        pings: 0,
        status: 'empty',
      });
      return;
    }

    setConsoleSnapshot({
      id: consoleInstance.id,
      pings: consoleInstance.pings,
      status: consoleInstance.status,
    });
  }

  function ensureConsole() {
    if (consoleRef.current === null) {
      consoleRef.current = createDemoConsole();
      syncConsoleSnapshot();
    }

    return consoleRef.current;
  }

  function handleStart() {
    if (intervalRef.current !== null) {
      return;
    }

    startedAtRef.current = Date.now() - elapsedMs;
    intervalRef.current = window.setInterval(() => {
      if (startedAtRef.current === null) {
        return;
      }

      setElapsedMs(Date.now() - startedAtRef.current);
    }, 200);
    setTimerStored(true);
  }

  function handleStop() {
    if (intervalRef.current === null) {
      return;
    }

    window.clearInterval(intervalRef.current);
    intervalRef.current = null;
    setTimerStored(false);
  }

  function handleReset() {
    handleStop();
    startedAtRef.current = null;
    setElapsedMs(0);
  }

  function handlePingConsole() {
    const consoleInstance = ensureConsole();
    consoleInstance.ping();
    syncConsoleSnapshot();
  }

  function handleStopConsole() {
    ensureConsole().stop();
    syncConsoleSnapshot();
  }

  return (
    <Panel className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill tone="success">timer handle in ref</StatusPill>
            <span className="text-sm text-slate-500">
              interval stored: <strong>{timerStored ? 'yes' : 'no'}</strong>
            </span>
          </div>

          <p className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
            {formatElapsed(elapsedMs)}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleStart}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Start
            </button>
            <button
              type="button"
              onClick={handleStop}
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Stop
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Reset
            </button>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-600">
            Здесь interval id не участвует в JSX, поэтому lives in ref. UI получает только
            полезный render-state: elapsed time.
          </p>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill tone="success">external object in ref</StatusPill>
            <span className="text-sm text-slate-500">
              console id: <strong>{consoleSnapshot.id ?? 'not created'}</strong>
            </span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              status: {consoleSnapshot.status}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              pings: {consoleSnapshot.pings}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              instance: {consoleSnapshot.id === null ? 'empty' : 'reused'}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handlePingConsole}
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              Ping console
            </button>
            <button
              type="button"
              onClick={handleStopConsole}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Stop console
            </button>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-600">
            Внешний mutable object создаётся один раз и переиспользуется. В state выведен
            только snapshot, который действительно нужен интерфейсу.
          </p>
        </div>
      </div>
    </Panel>
  );
}
