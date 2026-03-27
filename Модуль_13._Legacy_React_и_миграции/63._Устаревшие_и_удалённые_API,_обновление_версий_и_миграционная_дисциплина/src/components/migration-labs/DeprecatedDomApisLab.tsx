import { useMemo, useState } from 'react';

import {
  deprecatedApiCatalog,
  removedDomMigrationRules,
  summarizeDeprecatedApis,
  type DeprecatedApiId,
  type RuntimeMode,
} from '../../lib/deprecated-dom-api-model';
import { CodeBlock, ListBlock, MetricCard, Panel, StatusPill } from '../ui';

const entrypointDiff = `// before
import { render, hydrate, unmountComponentAtNode } from 'react-dom';

render(<App />, container);
hydrate(<App />, serverContainer);
unmountComponentAtNode(container);

// after
import { createRoot, hydrateRoot } from 'react-dom/client';

const root = createRoot(container);
root.render(<App />);

const hydratedRoot = hydrateRoot(serverContainer, <App />);
hydratedRoot.unmount();`;

export function DeprecatedDomApisLab() {
  const [runtimeMode, setRuntimeMode] = useState<RuntimeMode>('18.3-warning');
  const [selectedIds, setSelectedIds] = useState<DeprecatedApiId[]>([
    'render',
    'find-dom-node',
    'legacy-context',
  ]);

  const summary = useMemo(
    () => summarizeDeprecatedApis(selectedIds, runtimeMode),
    [runtimeMode, selectedIds],
  );

  const toggleId = (id: DeprecatedApiId) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <StatusPill tone={runtimeMode === '19-break' ? 'error' : 'warn'}>
              {runtimeMode === '19-break'
                ? 'React 19 break mode'
                : 'React 18.3 warning mode'}
            </StatusPill>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Переключайте режим между предупреждающим мостом 18.3 и реальной поломкой в
              19. Это показывает, что deprecated API важны не только как список замен, а
              как карта мест, где сломан старый mental model.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setRuntimeMode('18.3-warning')}
              className={`chip ${runtimeMode === '18.3-warning' ? 'chip-active' : ''}`}
            >
              18.3 warnings
            </button>
            <button
              type="button"
              onClick={() => setRuntimeMode('19-break')}
              className={`chip ${runtimeMode === '19-break' ? 'chip-active' : ''}`}
            >
              19 breakage
            </button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <MetricCard
            label="Selected call sites"
            value={String(selectedIds.length)}
            hint="Количество отмеченных устаревших поверхностей."
          />
          <MetricCard
            label="Removed in React 19"
            value={String(summary.removedCount)}
            hint="Эти вызовы уже не переживут обновление только за счёт warnings cleanup."
            tone="accent"
          />
          <MetricCard
            label="Still legacy"
            value={String(summary.warningCount)}
            hint="Они могут не падать напрямую, но всё ещё мешают migration reasoning."
            tone="cool"
          />
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">{summary.title}</h3>
            <StatusPill tone={summary.tone}>{summary.tone}</StatusPill>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{summary.copy}</p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            {summary.nextSteps.map((step) => (
              <li
                key={step}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                {step}
              </li>
            ))}
          </ul>
        </div>
      </Panel>

      <Panel className="grid gap-4 xl:grid-cols-2">
        {deprecatedApiCatalog.map((item) => {
          const selected = selectedIds.includes(item.id);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleId(item.id)}
              className={`rounded-[24px] border p-5 text-left transition ${
                selected
                  ? 'border-sky-300 bg-sky-50/80 shadow-sm'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <StatusPill tone={item.removedInReact19 ? 'error' : 'warn'}>
                  {item.removedInReact19 ? 'removed' : 'legacy'}
                </StatusPill>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Было: <code>{item.oldApi}</code>
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Теперь: <code>{item.replacement}</code>
              </p>
              <div className="mt-4 rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Почему это больно
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {item.whyItBreaks}
                </p>
              </div>
              <div className="mt-4 rounded-[20px] border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                  Скрытое предположение
                </p>
                <p className="mt-2 text-sm leading-6 text-amber-950">
                  {item.hiddenAssumption}
                </p>
              </div>
            </button>
          );
        })}
      </Panel>

      <Panel className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <CodeBlock label="Root API migration diff" code={entrypointDiff} />
        <ListBlock title="Migration rules" items={removedDomMigrationRules} />
      </Panel>
    </div>
  );
}
