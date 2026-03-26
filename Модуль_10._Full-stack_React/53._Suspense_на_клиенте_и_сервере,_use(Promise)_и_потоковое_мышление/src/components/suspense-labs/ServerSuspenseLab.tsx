import { useState } from 'react';

import {
  compareServerSuspenseStrategies,
  getServerScenario,
  serverScenarios,
  type ServerScenarioId,
} from '../../lib/server-suspense-model';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

export function ServerSuspenseLab() {
  const [scenarioId, setScenarioId] = useState<ServerScenarioId>('catalog');
  const [networkMs, setNetworkMs] = useState(90);
  const [serverMs, setServerMs] = useState(170);
  const [jsBootMs, setJsBootMs] = useState(220);

  const scenario = getServerScenario(scenarioId);
  const reports = compareServerSuspenseStrategies({
    scenarioId,
    networkMs,
    jsBootMs,
    serverMs,
  });
  const streamingReport =
    reports.find((report) => report.strategy === 'streaming') ?? reports[0];

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="soft-label">Server Suspense</span>
          <p className="text-sm leading-6 text-slate-600">
            Сравните три разные механики ожидания: клиент ждёт до boot, SSR отдаёт shell и
            fallback, а streaming раскрывает boundaries по мере готовности.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-wrap gap-2">
            {serverScenarios.map((item) => (
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

          <div className="grid gap-4">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Network: {networkMs}ms
              </span>
              <input
                type="range"
                min="40"
                max="300"
                step="10"
                value={networkMs}
                onChange={(event) => setNetworkMs(Number(event.target.value))}
                className="w-full"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Server render: {serverMs}ms
              </span>
              <input
                type="range"
                min="50"
                max="320"
                step="10"
                value={serverMs}
                onChange={(event) => setServerMs(Number(event.target.value))}
                className="w-full"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                JS boot: {jsBootMs}ms
              </span>
              <input
                type="range"
                min="80"
                max="500"
                step="10"
                value={jsBootMs}
                onChange={(event) => setJsBootMs(Number(event.target.value))}
                className="w-full"
              />
            </label>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm leading-6 text-slate-600">{scenario.note}</p>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Shell in streaming"
          value={`${streamingReport.htmlVisibleMs}ms`}
          hint="Когда shell может появиться без ожидания самого медленного блока."
          tone="cool"
        />
        <MetricCard
          label="Streaming interactive"
          value={`${streamingReport.interactiveMs}ms`}
          hint="Даже потоковый HTML всё равно должен пройти hydration на клиенте."
          tone="accent"
        />
        <div className="panel p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Ключевая разница
          </p>
          <div className="mt-3">
            <StatusPill tone="success">
              Suspense на сервере меняет сам способ доставки HTML
            </StatusPill>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {reports.map((report) => (
          <Panel key={report.strategy} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-semibold text-slate-900">{report.label}</h3>
              <StatusPill tone={report.strategy === 'streaming' ? 'success' : 'warn'}>
                {report.strategy}
              </StatusPill>
            </div>
            <div className="grid gap-3">
              <MetricCard
                label="HTML visible"
                value={`${report.htmlVisibleMs}ms`}
                hint="Когда появляется первая полезная разметка."
              />
              <MetricCard
                label="First useful"
                value={`${report.firstUsefulMs}ms`}
                hint="Когда экран уже несёт реальную пользу, а не только placeholder."
                tone="cool"
              />
              <MetricCard
                label="Interactive"
                value={`${report.interactiveMs}ms`}
                hint="Когда клиентская сторона уже оживила нужные boundaries."
                tone="accent"
              />
            </div>
            <p className="text-sm leading-6 text-slate-600">{report.waitingModel}</p>
          </Panel>
        ))}
      </div>

      <Panel>
        <ListBlock
          title="Streaming boundary timeline"
          items={streamingReport.rows.map(
            (row) =>
              `${row.label}: HTML ${row.serverVisibleMs}ms, interactive ${row.interactiveMs}ms`,
          )}
        />
      </Panel>
    </div>
  );
}
