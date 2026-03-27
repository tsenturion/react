import clsx from 'clsx';
import { useState } from 'react';

import { usePlaybookQuery } from '../../hooks/usePlaybookQuery';
import { PlaybookList } from './PlaybookList';

export function LoadingStatesLab() {
  const [query, setQuery] = useState('');
  const [scenario, setScenario] = useState<'success' | 'empty' | 'error'>('success');
  const request = usePlaybookQuery({
    query,
    scenario,
    delayMs: 620,
    enabled: true,
  });

  return (
    <div className="space-y-5">
      <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Query</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Попробуйте loading, abort, retry, empty"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400"
            />
          </label>

          <div className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Response mode</span>
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
      </div>

      {request.status === 'loading' ? (
        <div className="rounded-[28px] border border-blue-200 bg-blue-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            Loading state
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[24px] border border-blue-200 bg-white/80 p-4"
              >
                <div className="h-3 w-24 animate-pulse rounded-full bg-blue-100" />
                <div className="mt-4 h-6 w-40 animate-pulse rounded-full bg-blue-100" />
                <div className="mt-4 h-3 w-full animate-pulse rounded-full bg-blue-100" />
                <div className="mt-3 h-3 w-5/6 animate-pulse rounded-full bg-blue-100" />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {request.status === 'error' ? (
        <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
            Error state
          </p>
          <h3 className="mt-3 text-xl font-semibold text-rose-950">
            Данные не загрузились
          </h3>
          <p className="mt-2 text-sm leading-6 text-rose-900">{request.error}</p>
        </div>
      ) : null}

      {request.status === 'empty' ? (
        <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            Empty state
          </p>
          <h3 className="mt-3 text-xl font-semibold text-amber-950">
            Ответ пришёл, но список пуст
          </h3>
          <p className="mt-2 text-sm leading-6 text-amber-900">
            Это отдельное UI-состояние. Его нельзя смешивать ни с loading, ни с error.
          </p>
        </div>
      ) : null}

      {request.status === 'success' ? (
        <div className="space-y-4">
          <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Success state
            </p>
            <p className="mt-3 text-sm leading-6 text-emerald-950">
              Запрос завершился успешно. Теперь интерфейс уже не должен хранить loading
              или error как активные состояния.
            </p>
          </div>
          <PlaybookList items={request.items} />
        </div>
      ) : null}
    </div>
  );
}
