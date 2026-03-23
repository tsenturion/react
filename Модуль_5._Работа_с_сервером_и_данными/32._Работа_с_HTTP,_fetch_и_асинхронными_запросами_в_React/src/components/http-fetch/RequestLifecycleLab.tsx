import clsx from 'clsx';
import { useRef, useState } from 'react';

import { fetchPlaybookCatalog, normalizeRequestFailure } from '../../lib/http-client';
import type { RequestStatus } from '../../lib/http-domain';
import { statusSummary } from '../../lib/request-lifecycle-model';

export function RequestLifecycleLab() {
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [scenario, setScenario] = useState<'success' | 'error'>('success');
  const [timeline, setTimeline] = useState<string[]>([]);
  const controllerRef = useRef<AbortController | null>(null);

  const pushTimeline = (message: string) => {
    setTimeline((current) => [message, ...current].slice(0, 8));
  };

  const startRequest = async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setStatus('loading');
    pushTimeline('loading: запрос стартовал');

    try {
      const result = await fetchPlaybookCatalog({
        query: '',
        scenario,
        delayMs: 900,
        signal: controller.signal,
      });

      const nextStatus = result.items.length > 0 ? 'success' : 'empty';
      setStatus(nextStatus);
      pushTimeline(`${nextStatus}: ответ за ${result.meta.elapsedMs}ms`);
    } catch (cause) {
      const failure = normalizeRequestFailure(cause);
      const nextStatus = failure.kind === 'aborted' ? 'aborted' : 'error';
      setStatus(nextStatus);
      pushTimeline(`${nextStatus}: ${failure.message}`);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-wrap gap-2">
            {(['success', 'error'] as const).map((value) => (
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

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void startRequest()}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Стартовать запрос
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
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Current lifecycle state
          </p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {status}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{statusSummary(status)}</p>
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Lifecycle log
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
          {timeline.length > 0 ? (
            timeline.map((entry) => (
              <li
                key={entry}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                {entry}
              </li>
            ))
          ) : (
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              Пока lifecycle пуст. Запустите запрос и отмените его или дождитесь ответа.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
