import { useEffect, useState } from 'react';

import { usePlaybookQuery } from '../../hooks/usePlaybookQuery';
import { fetchPlaybookCatalog } from '../../lib/http-client';
import type { PlaybookEntry, RequestStatus } from '../../lib/http-domain';
import { getRaceDelay, raceModeSummary } from '../../lib/race-model';
import { PlaybookList } from './PlaybookList';

function UnsafeRacePanel({ query }: { query: string }) {
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [items, setItems] = useState<PlaybookEntry[]>([]);
  const [appliedQuery, setAppliedQuery] = useState('');

  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    void (async () => {
      setStatus('loading');

      const response = await fetchPlaybookCatalog({
        query,
        scenario: 'success',
        delayMs: getRaceDelay(query),
      });

      setItems(response.items);
      setAppliedQuery(response.meta.query);
      setStatus(response.items.length > 0 ? 'success' : 'empty');
    })();
  }, [query]);

  const visibleStatus = query.trim() ? status : 'idle';
  const visibleItems = query.trim() ? items : [];
  const visibleAppliedQuery = query.trim() ? appliedQuery : '';
  const stale = visibleAppliedQuery !== '' && visibleAppliedQuery !== query;

  return (
    <div className="space-y-4 rounded-[28px] border border-rose-200 bg-rose-50 p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
          Unsafe
        </p>
        <p className="mt-2 text-sm leading-6 text-rose-900">
          {raceModeSummary('unsafe')}
        </p>
      </div>

      <div className="rounded-2xl border border-rose-200 bg-white px-4 py-4 text-sm leading-6 text-rose-900">
        status: {visibleStatus}
        {visibleAppliedQuery ? `, applied response for "${visibleAppliedQuery}"` : ''}
      </div>

      {stale ? (
        <div className="rounded-2xl border border-rose-200 bg-white px-4 py-4 text-sm leading-6 text-rose-900">
          Поздний ответ от `{visibleAppliedQuery}` уже перезаписал более новый query `
          {query}`.
        </div>
      ) : null}

      {visibleItems.length > 0 ? (
        <PlaybookList items={visibleItems.slice(0, 3)} compact />
      ) : null}
    </div>
  );
}

function SafeRacePanel({ query }: { query: string }) {
  const request = usePlaybookQuery({
    query,
    scenario: 'success',
    delayMs: getRaceDelay(query),
    enabled: query.trim().length > 0,
  });

  return (
    <div className="space-y-4 rounded-[28px] border border-emerald-200 bg-emerald-50 p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Safe
        </p>
        <p className="mt-2 text-sm leading-6 text-emerald-900">
          {raceModeSummary('safe')}
        </p>
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-white px-4 py-4 text-sm leading-6 text-emerald-900">
        status: {request.status}
        {request.meta ? `, applied response for "${request.meta.query}"` : ''}
      </div>

      {request.items.length > 0 ? (
        <PlaybookList items={request.items.slice(0, 3)} compact />
      ) : null}
    </div>
  );
}

export function RaceConditionsLab() {
  const [query, setQuery] = useState('re');

  return (
    <div className="space-y-5">
      <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">
            Введите query быстро подряд
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Например: re → react → retry"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400"
          />
        </label>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Короткий query специально отвечает медленнее длинного. Так проще увидеть, как
          старый ответ приходит позже нового и ломает UI без защиты от гонки.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <UnsafeRacePanel query={query} />
        <SafeRacePanel query={query} />
      </div>
    </div>
  );
}
