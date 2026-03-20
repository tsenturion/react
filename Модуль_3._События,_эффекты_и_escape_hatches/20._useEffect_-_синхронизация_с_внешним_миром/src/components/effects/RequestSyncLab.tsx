import clsx from 'clsx';
import { startTransition, useEffect, useEffectEvent, useRef, useState } from 'react';

import type { RequestMode, EffectArticle } from '../../lib/effect-domain';
import {
  buildRequestReport,
  getRequestLatency,
  searchEffectGlossary,
} from '../../lib/effect-request-model';
import { CodeBlock, Panel, StatusPill } from '../ui';

const quickQueries = ['use', 'usee', 'useeffect'] as const;

export function RequestSyncLab() {
  const [mode, setMode] = useState<RequestMode>('cancel-stale');
  const [query, setQuery] = useState('use');
  const [results, setResults] = useState<EffectArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvedQuery, setResolvedQuery] = useState('');
  const [log, setLog] = useState<string[]>([]);

  const requestIdRef = useRef(0);
  const report = buildRequestReport(mode);

  const appendLog = useEffectEvent((message: string) => {
    setLog((current) => [message, ...current].slice(0, 10));
  });

  useEffect(() => {
    const normalized = query.trim();
    if (!normalized) {
      return;
    }

    const controller = new AbortController();
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    appendLog(`start #${requestId} "${normalized}" (${getRequestLatency(normalized)}ms)`);

    searchEffectGlossary(normalized, controller.signal)
      .then((nextResults) => {
        setResults(nextResults);
        setResolvedQuery(normalized);
        appendLog(`resolve #${requestId} "${normalized}" → ${nextResults.length} items`);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          appendLog(`abort #${requestId} "${normalized}"`);
          return;
        }

        appendLog(`error #${requestId} "${normalized}"`);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    if (mode === 'cancel-stale') {
      return () => {
        controller.abort();
      };
    }

    return undefined;
  }, [query, mode]);

  function updateQuery(nextQuery: string) {
    setQuery(nextQuery);
    if (!nextQuery.trim()) {
      setResults([]);
      setResolvedQuery('');
      setLoading(false);
      return;
    }

    setLoading(true);
  }

  function runQuickSequence() {
    quickQueries.forEach((value, index) => {
      window.setTimeout(() => {
        startTransition(() => {
          updateQuery(value);
        });
      }, index * 120);
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {(['cancel-stale', 'allow-stale'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setMode(item);
                if (query.trim()) {
                  setLoading(true);
                }
              }}
              className={clsx('chip', mode === item && 'chip-active')}
            >
              {item === 'cancel-stale' ? 'Abort stale requests' : 'Разрешить stale'}
            </button>
          ))}
        </div>

        <label className="space-y-2 text-sm text-slate-700">
          <span className="font-medium">Search query</span>
          <input
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-300"
            placeholder="Например: use, cleanup, loop"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {quickQueries.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => updateQuery(value)}
              className="chip"
            >
              {value}
            </button>
          ))}
          <button type="button" onClick={runQuickSequence} className="chip">
            Быстрый сценарий
          </button>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">
              Результат синхронизации
            </p>
            <StatusPill tone={loading ? 'warn' : report.tone}>
              {loading ? 'loading' : 'idle'}
            </StatusPill>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Последний отображённый запрос:{' '}
            <code>{resolvedQuery || '(ещё нет ответа)'}</code>
          </p>
        </div>

        <div className="space-y-3">
          {results.map((item) => (
            <div
              key={item.id}
              className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {item.kind}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
            </div>
          ))}
        </div>

        <CodeBlock label={report.title} code={report.snippet} />
      </Panel>

      <Panel className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Request log</h3>
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
              Введите query или запустите быстрый сценарий. С `allow-stale` старый ответ
              может вернуться позже и заменить уже более новый результат.
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
