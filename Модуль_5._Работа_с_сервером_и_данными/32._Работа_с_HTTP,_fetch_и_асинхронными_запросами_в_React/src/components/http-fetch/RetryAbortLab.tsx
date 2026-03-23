import clsx from 'clsx';
import { useRef, useState } from 'react';

import {
  fetchPlaybookCatalog,
  isRetryableRequestError,
  normalizeRequestFailure,
  waitWithAbort,
} from '../../lib/http-client';
import type { RequestStatus } from '../../lib/http-domain';
import {
  buildRetryPlan,
  retryScenarioLabel,
  type RetryScenario,
} from '../../lib/retry-model';

export function RetryAbortLab() {
  const [scenario, setScenario] = useState<RetryScenario>('flaky');
  const [maxRetries, setMaxRetries] = useState(2);
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const controllerRef = useRef<AbortController | null>(null);

  const pushLog = (entry: string) => {
    setLog((current) => [entry, ...current].slice(0, 10));
  };

  const runPlan = async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setAttemptsUsed(0);
    setStatus('loading');
    pushLog('loading: стартовал новый запрос с retry-планом');

    const retryPlan = buildRetryPlan(maxRetries, 350);

    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
      setAttemptsUsed(attempt + 1);

      if (attempt > 0) {
        const pause = retryPlan[attempt - 1];
        pushLog(`retry wait: ${pause}ms перед попыткой ${attempt + 1}`);
        await waitWithAbort(pause, controller.signal);
      }

      const effectiveScenario =
        scenario === 'flaky'
          ? attempt === 0
            ? 'error'
            : 'success'
          : scenario === 'server-error'
            ? 'error'
            : 'empty';

      try {
        const response = await fetchPlaybookCatalog({
          query: '',
          scenario: effectiveScenario,
          delayMs: 500,
          signal: controller.signal,
        });

        const nextStatus = response.items.length > 0 ? 'success' : 'empty';
        setStatus(nextStatus);
        pushLog(
          `${nextStatus}: попытка ${attempt + 1} завершилась со статусом ${response.meta.status}`,
        );
        return;
      } catch (cause) {
        if (controller.signal.aborted) {
          setStatus('aborted');
          pushLog('aborted: запрос отменён до завершения retry-плана');
          return;
        }

        const failure = normalizeRequestFailure(cause);
        pushLog(`attempt ${attempt + 1}: ${failure.message}`);

        if (isRetryableRequestError(cause) && attempt < maxRetries) {
          pushLog('retryable: временный сбой, план продолжает следующую попытку');
          continue;
        }

        setStatus('error');
        return;
      }
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-wrap gap-2">
            {(['flaky', 'server-error', 'empty'] as const).map((value) => (
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

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="text-sm text-slate-700">
              Max retries:{' '}
              <select
                value={maxRetries}
                onChange={(event) => setMaxRetries(Number(event.target.value))}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2"
              >
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </label>

            <button
              type="button"
              onClick={() => void runPlan()}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Запустить retry-план
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
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Status
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {status}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Attempts used
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                {attemptsUsed}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Scenario
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {retryScenarioLabel(scenario)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Retry log
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
          {log.length > 0 ? (
            log.map((entry) => (
              <li
                key={entry}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                {entry}
              </li>
            ))
          ) : (
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              Лог пуст. Запустите retry-план и при необходимости отмените его.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
