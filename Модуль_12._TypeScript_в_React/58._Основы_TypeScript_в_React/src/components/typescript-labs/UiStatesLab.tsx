import { useState } from 'react';

import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';
import {
  buildCatalogState,
  describeCatalogState,
  type CatalogState,
} from '../../lib/ui-states-model';

function CatalogSurface({ state }: { state: CatalogState }) {
  switch (state.status) {
    case 'loading':
      return <p className="text-sm leading-6 text-slate-600">Загрузка каталога...</p>;
    case 'error':
      return <p className="text-sm leading-6 text-rose-700">{state.message}</p>;
    case 'empty':
      return <p className="text-sm leading-6 text-amber-700">{state.reason}</p>;
    case 'ready':
      return (
        <ul className="space-y-2">
          {state.items.map((item) => (
            <li
              key={item}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
            >
              {item}
            </li>
          ))}
        </ul>
      );
  }
}

export function UiStatesLab() {
  const [fetchMode, setFetchMode] = useState<'success' | 'empty' | 'error'>('success');
  const [query, setQuery] = useState('typed');
  const state = buildCatalogState({ fetchMode, query });

  return (
    <Panel className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <label className="space-y-2 text-sm text-slate-700">
            <span className="block font-medium">Query</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFetchMode('success')}
              className={`chip ${fetchMode === 'success' ? 'chip-active' : ''}`}
            >
              Success
            </button>
            <button
              type="button"
              onClick={() => setFetchMode('empty')}
              className={`chip ${fetchMode === 'empty' ? 'chip-active' : ''}`}
            >
              Empty
            </button>
            <button
              type="button"
              onClick={() => setFetchMode('error')}
              className={`chip ${fetchMode === 'error' ? 'chip-active' : ''}`}
            >
              Error
            </button>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">Current state</h3>
            <StatusPill
              tone={
                state.status === 'error'
                  ? 'error'
                  : state.status === 'empty'
                    ? 'warn'
                    : 'success'
              }
            >
              {state.status}
            </StatusPill>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {describeCatalogState(state)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <MetricCard
          label="State branch"
          value={state.status}
          hint="Текущая ветка модели данных и интерфейса."
          tone="accent"
        />
        <MetricCard
          label="Impossible combos"
          value="0"
          hint="Union не даёт экрану быть одновременно и empty, и error, и ready."
          tone="cool"
        />
        <MetricCard
          label="Query input"
          value={query || 'empty'}
          hint="Одно значение запроса влияет на конечную ветку модели, а не на разрозненные флаги."
          tone="dark"
        />
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <CatalogSurface state={state} />
      </div>

      <ListBlock
        title="Почему это устойчивее, чем несколько флагов"
        items={[
          'Новая ветка состояния требует обновить switch и не остаётся незамеченной.',
          'Экран читает одну модель состояния, а не пытается собрать картину из нескольких boolean-флагов.',
          'Состояние данных и состояние UI перестают расходиться между собой.',
        ]}
      />
    </Panel>
  );
}
