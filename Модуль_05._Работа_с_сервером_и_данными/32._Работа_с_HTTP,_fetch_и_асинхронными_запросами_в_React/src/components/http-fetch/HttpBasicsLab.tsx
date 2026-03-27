import clsx from 'clsx';
import { useRef, useState } from 'react';

import {
  fetchPlaybookCatalog,
  normalizeRequestFailure,
  type FetchPlaybookOptions,
} from '../../lib/http-client';
import type { PlaybookResponse, RequestStatus } from '../../lib/http-domain';
import { StatusPill } from '../ui';
import { PlaybookList } from './PlaybookList';

export function HttpBasicsLab() {
  const [query, setQuery] = useState('');
  const [scenario, setScenario] = useState<FetchPlaybookOptions['scenario']>('success');
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [result, setResult] = useState<PlaybookResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const runRequest = async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setStatus('loading');
    setError(null);

    try {
      const nextResult = await fetchPlaybookCatalog({
        query,
        scenario,
        delayMs: 650,
        signal: controller.signal,
      });

      setResult(nextResult);
      setStatus(nextResult.items.length > 0 ? 'success' : 'empty');
    } catch (cause) {
      const failure = normalizeRequestFailure(cause);
      setError(failure.message);
      setStatus(failure.kind === 'aborted' ? 'aborted' : 'error');
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Query</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Например: retry, loading, abort"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400"
              />
            </label>

            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Scenario</span>
              <div className="flex flex-wrap gap-2">
                {(['success', 'empty', 'error'] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setScenario(value)}
                    className={clsx(
                      'rounded-xl px-4 py-2 text-sm font-medium transition',
                      scenario === value
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-slate-700 hover:bg-slate-100',
                    )}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void runRequest()}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Выполнить GET
            </button>
            <button
              type="button"
              onClick={() => controllerRef.current?.abort()}
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Abort
            </button>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">Payload preview</h3>
            <StatusPill
              tone={
                status === 'success'
                  ? 'success'
                  : status === 'error' || status === 'aborted'
                    ? 'error'
                    : 'warn'
              }
            >
              {status}
            </StatusPill>
          </div>

          {status === 'idle' ? (
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Пока запрос не выполнялся. Нажмите `Выполнить GET`, чтобы увидеть request
              metadata и результат.
            </p>
          ) : null}

          {status === 'loading' ? (
            <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4 text-sm leading-6 text-blue-900">
              Запрос выполняется. В этот момент интерфейс уже должен явно показывать, что
              данные ещё не готовы.
            </div>
          ) : null}

          {status === 'error' || status === 'aborted' ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-6 text-rose-900">
              {error}
            </div>
          ) : null}

          {result && (status === 'success' || status === 'empty') ? (
            <div className="mt-4 space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    HTTP status
                  </p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                    {result.meta.status}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Method
                  </p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                    {result.meta.method}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Elapsed
                  </p>
                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                    {result.meta.elapsedMs}ms
                  </p>
                </div>
              </div>

              {result.items.length > 0 ? (
                <PlaybookList items={result.items.slice(0, 4)} compact />
              ) : (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-900">
                  Сервер ответил успешно, но элементов по текущему сценарию нет.
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Request metadata
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <strong className="font-semibold text-slate-900">URL:</strong>{' '}
              `/data/http-react-playbook.json`
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <strong className="font-semibold text-slate-900">Method:</strong> `GET`
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <strong className="font-semibold text-slate-900">Accept:</strong>{' '}
              `application/json`
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <strong className="font-semibold text-slate-900">Scenario:</strong>{' '}
              {scenario}
            </li>
          </ul>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Практический смысл
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Даже для простого `fetch` важно видеть не только payload, но и transport
            metadata: статус, задержку, сценарий ответа и возможность отменить запрос.
          </p>
        </div>
      </div>
    </div>
  );
}
