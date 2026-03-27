import clsx from 'clsx';
import { startTransition, useEffect, useRef, useState } from 'react';

import {
  quickQueries,
  searchAdvancedEffectPlaybook,
  type AdvancedEffectEntry,
} from '../../lib/advanced-effect-domain';
import type { RaceMode } from '../../lib/race-condition-model';
import { Panel, StatusPill } from '../ui';

const modes: readonly { id: RaceMode; label: string; note: string }[] = [
  {
    id: 'bad',
    label: 'bad',
    note: 'устаревший ответ может перезаписать свежий',
  },
  {
    id: 'ignore',
    label: 'ignore',
    note: 'устаревший ответ игнорируется, но запрос не отменяется',
  },
  {
    id: 'abort',
    label: 'abort',
    note: 'cleanup реально отменяет запрос',
  },
];

type RequestState = 'loading' | 'success' | 'error';

export function RaceConditionLab() {
  const [mode, setMode] = useState<RaceMode>('bad');
  const [query, setQuery] = useState('async');
  const [status, setStatus] = useState<RequestState>('loading');
  const [results, setResults] = useState<AdvancedEffectEntry[]>([]);
  const [logs, setLogs] = useState<string[]>(['initial request -> async']);
  const requestCounterRef = useRef(0);
  const sequenceTimeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      sequenceTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  useEffect(() => {
    const requestId = requestCounterRef.current + 1;
    requestCounterRef.current = requestId;

    if (mode === 'bad') {
      void searchAdvancedEffectPlaybook(query).then(
        (nextResults) => {
          setResults(nextResults);
          setStatus('success');
          setLogs((current) =>
            [
              `complete #${requestId} -> ${nextResults[0]?.title ?? 'нет совпадений'}`,
              ...current,
            ].slice(0, 10),
          );
        },
        (error) => {
          const message = error instanceof Error ? error.message : 'request failed';
          setStatus('error');
          setLogs((current) =>
            [`error #${requestId} -> ${message}`, ...current].slice(0, 10),
          );
        },
      );

      return;
    }

    if (mode === 'ignore') {
      let active = true;

      void searchAdvancedEffectPlaybook(query).then(
        (nextResults) => {
          if (!active) {
            setLogs((current) => [`ignored #${requestId}`, ...current].slice(0, 10));
            return;
          }

          setResults(nextResults);
          setStatus('success');
          setLogs((current) =>
            [
              `complete #${requestId} -> ${nextResults[0]?.title ?? 'нет совпадений'}`,
              ...current,
            ].slice(0, 10),
          );
        },
        (error) => {
          const message = error instanceof Error ? error.message : 'request failed';
          setStatus('error');
          setLogs((current) =>
            [`error #${requestId} -> ${message}`, ...current].slice(0, 10),
          );
        },
      );

      return () => {
        active = false;
        setLogs((current) =>
          [`cleanup #${requestId} -> ignore`, ...current].slice(0, 10),
        );
      };
    }

    const controller = new AbortController();

    // Здесь cleanup делает больше, чем локальный guard:
    // он не только защищает state, но и завершает внешний async-процесс.
    void searchAdvancedEffectPlaybook(query, controller.signal).then(
      (nextResults) => {
        setResults(nextResults);
        setStatus('success');
        setLogs((current) =>
          [
            `complete #${requestId} -> ${nextResults[0]?.title ?? 'нет совпадений'}`,
            ...current,
          ].slice(0, 10),
        );
      },
      (error) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          setLogs((current) => [`aborted #${requestId}`, ...current].slice(0, 10));
          return;
        }

        const message = error instanceof Error ? error.message : 'request failed';
        setStatus('error');
        setLogs((current) =>
          [`error #${requestId} -> ${message}`, ...current].slice(0, 10),
        );
      },
    );

    return () => {
      controller.abort();
      setLogs((current) => [`cleanup #${requestId} -> abort`, ...current].slice(0, 10));
    };
  }, [mode, query]);

  function handleModeChange(nextMode: RaceMode) {
    setStatus('loading');
    setLogs((current) => [`mode -> ${nextMode}`, ...current].slice(0, 10));
    setMode(nextMode);
  }

  function handleQueryChange(nextQuery: string) {
    setStatus('loading');
    setLogs((current) => [`start -> ${nextQuery}`, ...current].slice(0, 10));
    setQuery(nextQuery);
  }

  function runSequence() {
    sequenceTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    setStatus('loading');
    setLogs((current) =>
      [`sequence -> ${quickQueries.join(' / ')}`, ...current].slice(0, 10),
    );

    sequenceTimeoutsRef.current = quickQueries.map((value, index) =>
      window.setTimeout(() => {
        startTransition(() => {
          setStatus('loading');
          setLogs((current) => [`start -> ${value}`, ...current].slice(0, 10));
          setQuery(value);
        });
      }, index * 140),
    );
  }

  return (
    <Panel className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {modes.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleModeChange(item.id)}
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

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill
                tone={
                  status === 'success' ? 'success' : status === 'error' ? 'error' : 'warn'
                }
              >
                {status}
              </StatusPill>
              <span className="text-sm text-slate-500">
                Текущий query: <strong>{query}</strong>
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={runSequence}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Быстрая последовательность
              </button>
              {quickQueries.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleQueryChange(value)}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  {value}
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                Верхний результат
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {results[0]?.title ?? 'Пока нет результата'}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {results[0]?.summary ??
                  'Запустите последовательность, чтобы увидеть, какой ответ победит в текущем режиме.'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Журнал запросов
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
      </div>
    </Panel>
  );
}
