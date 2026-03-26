'use client';

import { useState } from 'react';

import {
  compareFrameworkFlows,
  type FlowFrameworkId,
  type ScreenKind,
} from '../../lib/framework-flow-model';
import { ListBlock, MetricCard, Panel } from '../ui';
import { simulateFrameworkRequest } from '../../server/framework-runtime';

export function DataFlowLab() {
  const [framework, setFramework] = useState<FlowFrameworkId>('next-app-router');
  const [screenKind, setScreenKind] = useState<ScreenKind>('mixed');
  const [needsAuth, setNeedsAuth] = useState(true);
  const [seoCritical, setSeoCritical] = useState(true);

  const report = compareFrameworkFlows({
    framework,
    screenKind,
    needsAuth,
    seoCritical,
  });

  const runtimeReport =
    framework === 'vite-diy'
      ? null
      : simulateFrameworkRequest({
          framework,
          routeKind:
            screenKind === 'mutation-heavy'
              ? 'editor'
              : screenKind === 'read-heavy'
                ? 'marketing'
                : 'dashboard',
          hasMutation: screenKind !== 'read-heavy',
          renderIntent: screenKind === 'read-heavy' ? 'ssr' : 'streaming',
        });

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="soft-label">Full-stack flow</span>
          <p className="text-sm leading-6 text-slate-600">
            Смотрите, как framework меняет путь от URL до данных и мутаций. Важен не
            только `fetch`, а то, кто владеет экраном, auth, ошибками и server-side
            pipeline.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['vite-diy', 'react-router-framework', 'next-app-router'] as const).map(
            (value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFramework(value)}
                className={`chip ${framework === value ? 'chip-active' : ''}`}
              >
                {value}
              </button>
            ),
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {(['read-heavy', 'mutation-heavy', 'mixed'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setScreenKind(value)}
              className={`chip ${screenKind === value ? 'chip-active' : ''}`}
            >
              {value}
            </button>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {[
            { value: needsAuth, setValue: setNeedsAuth, label: 'Маршрут защищён auth' },
            { value: seoCritical, setValue: setSeoCritical, label: 'SEO критичен' },
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
          label="Manual glue"
          value={String(report.manualGlue)}
          hint="Сколько ручного склеивания между экраном, данными и серверной логикой остаётся на команде."
          tone="accent"
        />
        <MetricCard
          label="Framework coverage"
          value={String(report.frameworkCoverage)}
          hint="Насколько routing/data/rendering уже встроены в используемую поверхность."
          tone="cool"
        />
        <MetricCard
          label="Route ownership"
          value={report.routeOwnership}
          hint="Насколько маршрут сам владеет своим full-stack поведением."
        />
      </div>

      <Panel>
        <ListBlock title={report.headline} items={report.steps} />
      </Panel>

      {runtimeReport ? (
        <Panel className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {runtimeReport.headline}
          </h3>
          <div className="grid gap-4 lg:grid-cols-2">
            <ListBlock title="Server files" items={runtimeReport.serverFiles} />
            <ListBlock title="Client files" items={runtimeReport.clientFiles} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <MetricCard
              label="Bundle pressure"
              value={`${runtimeReport.bundlePressure}kB`}
              hint="Условная цена client surfaces в текущем runtime-report."
            />
            <Panel className="bg-slate-50">
              <ListBlock title="Runtime steps" items={runtimeReport.steps} />
            </Panel>
          </div>
        </Panel>
      ) : null}
    </div>
  );
}
