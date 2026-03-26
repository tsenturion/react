'use client';

import { useState } from 'react';

import {
  planRouteStructure,
  type RouteFrameworkId,
  type RouteScenarioId,
} from '../../lib/route-structure-model';
import { CodeBlock, ListBlock, MetricCard, Panel } from '../ui';

export function RouteStructureLab() {
  const [framework, setFramework] = useState<RouteFrameworkId>('next-app-router');
  const [scenario, setScenario] = useState<RouteScenarioId>('marketing-plus-app');
  const [hasProtectedArea, setHasProtectedArea] = useState(true);
  const [hasMutations, setHasMutations] = useState(true);
  const [usesStreaming, setUsesStreaming] = useState(true);
  const [coLocateData, setCoLocateData] = useState(true);

  const report = planRouteStructure({
    framework,
    scenario,
    hasProtectedArea,
    hasMutations,
    usesStreaming,
    coLocateData,
  });

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="soft-label">Route modules</span>
          <p className="text-sm leading-6 text-slate-600">
            Переключайте framework и свойства приложения, чтобы увидеть, как маршрут
            начинает владеть layout, data, mutations и асинхронными surfaces.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['next-app-router', 'react-router-framework'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFramework(value)}
              className={`chip ${framework === value ? 'chip-active' : ''}`}
            >
              {value === 'next-app-router'
                ? 'Next.js App Router'
                : 'React Router framework'}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {(['marketing-plus-app', 'docs-search', 'commerce-dashboard'] as const).map(
            (value) => (
              <button
                key={value}
                type="button"
                onClick={() => setScenario(value)}
                className={`chip ${scenario === value ? 'chip-active' : ''}`}
              >
                {value}
              </button>
            ),
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {[
            {
              value: hasProtectedArea,
              setValue: setHasProtectedArea,
              label: 'Есть protected area',
            },
            {
              value: hasMutations,
              setValue: setHasMutations,
              label: 'Маршрут содержит мутации',
            },
            {
              value: usesStreaming,
              setValue: setUsesStreaming,
              label: 'Нужен streaming / async surface',
            },
            {
              value: coLocateData,
              setValue: setCoLocateData,
              label: 'Данные co-located рядом с маршрутом',
            },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => item.setValue(!item.value)}
              className={`rounded-[24px] border px-4 py-4 text-left transition ${
                item.value
                  ? 'border-sky-500 bg-sky-50 text-sky-950'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <span className="text-sm font-semibold">{item.label}</span>
              <span className="mt-2 block text-sm leading-6 opacity-80">
                {item.value ? 'Да' : 'Нет'}
              </span>
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Route modules"
          value={String(report.routeModuleCount)}
          hint="Сколько route-owned файлов попало в структуру текущего сценария."
          tone="accent"
        />
        <MetricCard
          label="Server-owned files"
          value={String(report.serverOwnedFiles)}
          hint="Сколько файлов указывают на server-side ownership маршрута."
          tone="cool"
        />
        <MetricCard
          label="Layouts"
          value={String(report.layoutCount)}
          hint="Сколько layout/root surfaces определяют каркас маршрутов."
        />
      </div>

      <Panel className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">{report.headline}</h3>
        <CodeBlock label="Generated tree" code={report.tree.join('\n')} />
      </Panel>

      <Panel>
        <ListBlock title="Architectural notes" items={report.notes} />
      </Panel>
    </div>
  );
}
