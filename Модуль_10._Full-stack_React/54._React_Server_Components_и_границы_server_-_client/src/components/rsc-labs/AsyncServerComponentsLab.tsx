import { useState } from 'react';

import {
  asyncScenarios,
  compareAsyncStrategies,
  getAsyncScenario,
  type AsyncScenarioId,
} from '../../lib/async-server-model';
import { MetricCard, Panel, StatusPill } from '../ui';

export function AsyncServerComponentsLab() {
  const [scenarioId, setScenarioId] = useState<AsyncScenarioId>('catalog');
  const [networkMs, setNetworkMs] = useState(90);
  const [jsBootMs, setJsBootMs] = useState(180);
  const scenario = getAsyncScenario(scenarioId);
  const reports = compareAsyncStrategies({
    scenarioId,
    networkMs,
    jsBootMs,
  });
  const fastestData = [...reports].sort(
    (left, right) => left.dataReadyMs - right.dataReadyMs,
  )[0];

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="soft-label">Async server components</span>
          <p className="text-sm leading-6 text-slate-600">
            Здесь видно, что async server component меняет не только место запроса, но и
            порядок появления данных, HTML и hydration.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {asyncScenarios.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setScenarioId(item.id)}
              className={`chip ${scenarioId === item.id ? 'chip-active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Network: {networkMs}ms
            </span>
            <input
              className="mt-4 w-full"
              type="range"
              min={40}
              max={240}
              step={10}
              value={networkMs}
              onChange={(event) => setNetworkMs(Number(event.target.value))}
            />
          </label>
          <label className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              JS boot: {jsBootMs}ms
            </span>
            <input
              className="mt-4 w-full"
              type="range"
              min={80}
              max={420}
              step={20}
              value={jsBootMs}
              onChange={(event) => setJsBootMs(Number(event.target.value))}
            />
          </label>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm leading-6 text-slate-700">{scenario.privateDataNote}</p>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Fastest data"
          value={`${fastestData.dataReadyMs}ms`}
          hint={`${fastestData.label} раньше всех довозит содержимое до экрана.`}
          tone="accent"
        />
        <MetricCard
          label="Network"
          value={`${networkMs}ms`}
          hint="Сетевое время влияет на все стратегии, но waterfall у client fetch делает задержку заметнее."
          tone="cool"
        />
        <MetricCard
          label="JS boot"
          value={`${jsBootMs}ms`}
          hint="Чем позже поднимается клиент, тем дороже становится стратегия “сначала shell, потом client fetch”."
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {reports.map((report) => (
          <div
            key={report.id}
            className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-900">{report.label}</h3>
              <StatusPill tone={fastestData.id === report.id ? 'success' : 'warn'}>
                {fastestData.id === report.id
                  ? 'Самый быстрый data reveal'
                  : 'Сравните trade-off'}
              </StatusPill>
            </div>

            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              <p>HTML shell: {report.htmlShellMs}ms</p>
              <p>Data ready: {report.dataReadyMs}ms</p>
              <p>Interactive: {report.interactiveMs}ms</p>
              <p>Client bundle: {report.clientBundleKb}kB</p>
            </div>

            <div className="mt-4 rounded-[20px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Waterfall
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{report.waterfall}</p>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">{report.why}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
