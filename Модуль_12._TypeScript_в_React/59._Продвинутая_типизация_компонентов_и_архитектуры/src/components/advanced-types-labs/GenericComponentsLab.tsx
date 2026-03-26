import clsx from 'clsx';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { CodeBlock, MetricCard, StatusPill } from '../ui';
import {
  endpointScenario,
  filterCollection,
  genericListSnippet,
  genericScenarioSnippet,
  resolveSelection,
  tokenScenario,
  type ScenarioDescriptor,
} from '../../lib/generic-components-model';

type ExplorerListProps<T> = {
  title: string;
  items: readonly T[];
  selectedId: string | null;
  emptyMessage: string;
  getId: (item: T) => string;
  renderPrimary: (item: T) => ReactNode;
  renderMeta: (item: T) => ReactNode;
  onSelect: (item: T) => void;
};

function ExplorerList<T>({
  title,
  items,
  selectedId,
  emptyMessage,
  getId,
  renderPrimary,
  renderMeta,
  onSelect,
}: ExplorerListProps<T>) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <StatusPill tone="success">{items.length} visible</StatusPill>
      </div>

      {items.length ? (
        <ul className="mt-4 space-y-3">
          {items.map((item) => {
            const id = getId(item);

            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className={clsx(
                    'w-full rounded-2xl border px-4 py-4 text-left transition',
                    selectedId === id
                      ? 'border-sky-500 bg-sky-50'
                      : 'border-slate-200 bg-slate-50 hover:bg-white',
                  )}
                >
                  <span className="block text-sm font-semibold text-slate-900">
                    {renderPrimary(item)}
                  </span>
                  <span className="mt-2 block text-sm text-slate-600">
                    {renderMeta(item)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}

function ScenarioView<T>({
  scenario,
  query,
  selectedId,
  onSelectId,
}: {
  scenario: ScenarioDescriptor<T>;
  query: string;
  selectedId: string | null;
  onSelectId: (id: string) => void;
}) {
  const visibleItems = filterCollection(scenario.items, query, scenario.matches);
  const selectedItem = resolveSelection(visibleItems, selectedId, scenario.getId);

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <ExplorerList
        title={scenario.title}
        items={visibleItems}
        selectedId={selectedItem ? scenario.getId(selectedItem) : null}
        emptyMessage={scenario.emptyMessage}
        getId={scenario.getId}
        renderPrimary={scenario.getLabel}
        renderMeta={scenario.getMeta}
        onSelect={(item) => onSelectId(scenario.getId(item))}
      />

      <div className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Scenario detail
            </p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">
              {selectedItem ? scenario.getLabel(selectedItem) : 'No selection'}
            </h3>
          </div>
          <StatusPill tone="warn">{scenario.id}</StatusPill>
        </div>

        <p className="text-sm leading-6 text-slate-600">{scenario.blurb}</p>

        {selectedItem ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {scenario.inspect(selectedItem).map((entry) => (
              <div
                key={entry.label}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {entry.label}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{entry.value}</p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <MetricCard
            label="Visible items"
            value={String(visibleItems.length)}
            hint="Filtering идёт через generic helper и сохраняет конкретный тип сущности."
            tone="accent"
          />
          <MetricCard
            label="Selected item"
            value={selectedItem ? scenario.getMeta(selectedItem) : 'none'}
            hint="Selection logic одна и та же, но item detail остаётся domain-specific."
            tone="cool"
          />
        </div>
      </div>
    </div>
  );
}

export function GenericComponentsLab() {
  const [scenarioId, setScenarioId] = useState<'endpoints' | 'tokens'>('endpoints');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setScenarioId('endpoints');
            setSelectedId(null);
          }}
          className={`chip ${scenarioId === 'endpoints' ? 'chip-active' : ''}`}
        >
          Endpoints
        </button>
        <button
          type="button"
          onClick={() => {
            setScenarioId('tokens');
            setSelectedId(null);
          }}
          className={`chip ${scenarioId === 'tokens' ? 'chip-active' : ''}`}
        >
          Tokens
        </button>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Filter query</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500"
          placeholder="Например: platform, color, stable"
          aria-label="Filter query"
        />
      </label>

      {scenarioId === 'endpoints' ? (
        <ScenarioView
          scenario={endpointScenario}
          query={query}
          selectedId={selectedId}
          onSelectId={setSelectedId}
        />
      ) : (
        <ScenarioView
          scenario={tokenScenario}
          query={query}
          selectedId={selectedId}
          onSelectId={setSelectedId}
        />
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        <CodeBlock label="Generic list contract" code={genericListSnippet} />
        <CodeBlock label="Scenario descriptor" code={genericScenarioSnippet} />
      </div>
    </div>
  );
}
