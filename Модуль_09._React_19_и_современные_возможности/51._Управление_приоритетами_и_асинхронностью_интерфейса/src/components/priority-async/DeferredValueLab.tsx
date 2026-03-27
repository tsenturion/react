import { useDeferredValue, useMemo, useState } from 'react';

import {
  filterWorkbenchItems,
  summarizeDeferredState,
  type Domain,
} from '../../lib/priority-workbench-model';
import { MetricCard, Panel, StatusPill } from '../ui';

export function DeferredValueLab() {
  const [query, setQuery] = useState('server');
  const [domain, setDomain] = useState<Domain>('all');
  const deferredQuery = useDeferredValue(query);
  const freshness = summarizeDeferredState(query, deferredQuery);

  const results = useMemo(
    () => filterWorkbenchItems(deferredQuery, domain).slice(0, 6),
    [deferredQuery, domain],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Input query"
          value={query || 'empty'}
          hint="Срочное значение поля ввода обновляется сразу и не ждёт тяжёлого списка."
          tone="accent"
        />
        <MetricCard
          label="Deferred query"
          value={deferredQuery || 'empty'}
          hint="Отстающее значение, по которому строится expensive представление."
          tone="cool"
        />
        <MetricCard
          label="Freshness"
          value={freshness}
          hint="lagging означает, что results пока догоняют актуальный input."
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Search query</span>
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Domain</span>
              <select
                value={domain}
                onChange={(event) => {
                  setDomain(event.target.value as Domain);
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"
              >
                <option value="all">All</option>
                <option value="forms">Forms</option>
                <option value="server">Server</option>
                <option value="routing">Routing</option>
                <option value="compiler">Compiler</option>
              </select>
            </label>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-700">
              <p className="font-semibold text-slate-900">Как читать состояние</p>
              <p className="mt-2">
                raw query полезен для input, а deferred query — для тяжёлого secondary
                view. Эти значения не обязаны совпадать в каждый момент времени.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-slate-200 bg-white p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Result freshness
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Если `query !== deferredQuery`, heavy list ещё догоняет пользовательский
                  ввод.
                </p>
              </div>
              <StatusPill tone={freshness === 'lagging' ? 'warn' : 'success'}>
                {freshness}
              </StatusPill>
            </div>

            <ul className="grid gap-3 md:grid-cols-2">
              {results.map((item) => (
                <li
                  key={item.id}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white">
                      {item.domain}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.summary}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Panel>
    </div>
  );
}
