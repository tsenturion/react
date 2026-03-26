import { useMemo, useState } from 'react';

import {
  chooseRecommendedMode,
  compareRenderingModes,
  formatFitLevel,
  pageIntentOptions,
  type FitLevel,
  type PageIntentId,
} from '../../lib/render-mode-model';
import { MetricCard, Panel, StatusPill } from '../ui';

function toneFromLevel(level: FitLevel): 'success' | 'warn' | 'error' {
  if (level === 'high') {
    return 'success';
  }

  if (level === 'medium') {
    return 'warn';
  }

  return 'error';
}

export function ModeComparisonLab() {
  const [pageIntent, setPageIntent] = useState<PageIntentId>('marketing');
  const [networkMs, setNetworkMs] = useState(120);
  const [serverMs, setServerMs] = useState(180);
  const [dataMs, setDataMs] = useState(140);
  const [jsBootMs, setJsBootMs] = useState(260);
  const [hydrationMs, setHydrationMs] = useState(90);

  const reports = useMemo(
    () =>
      compareRenderingModes({
        pageIntent,
        networkMs,
        serverMs,
        dataMs,
        jsBootMs,
        hydrationMs,
      }),
    [dataMs, hydrationMs, jsBootMs, networkMs, pageIntent, serverMs],
  );
  const winner = chooseRecommendedMode(reports);

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="soft-label">Latency simulator</span>
          <p className="text-sm leading-6 text-slate-600">
            Меняйте сеть, сервер и стоимость hydration: так видно, что режим рендеринга
            меняет не только первый HTML, но и всю цену interactivity.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Тип экрана</span>
            <select
              value={pageIntent}
              onChange={(event) => setPageIntent(event.target.value as PageIntentId)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
            >
              {pageIntentOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-sm leading-6 text-slate-500">
              {pageIntentOptions.find((item) => item.id === pageIntent)?.note}
            </p>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Сеть: {networkMs}ms
              </span>
              <input
                type="range"
                min="40"
                max="400"
                step="10"
                value={networkMs}
                onChange={(event) => setNetworkMs(Number(event.target.value))}
                className="w-full"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Серверный рендер: {serverMs}ms
              </span>
              <input
                type="range"
                min="20"
                max="500"
                step="10"
                value={serverMs}
                onChange={(event) => setServerMs(Number(event.target.value))}
                className="w-full"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                Data resolve: {dataMs}ms
              </span>
              <input
                type="range"
                min="20"
                max="500"
                step="10"
                value={dataMs}
                onChange={(event) => setDataMs(Number(event.target.value))}
                className="w-full"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                JS boot: {jsBootMs}ms
              </span>
              <input
                type="range"
                min="40"
                max="700"
                step="10"
                value={jsBootMs}
                onChange={(event) => setJsBootMs(Number(event.target.value))}
                className="w-full"
              />
            </label>
            <label className="space-y-2 sm:col-span-2">
              <span className="text-sm font-semibold text-slate-700">
                Hydration cost: {hydrationMs}ms
              </span>
              <input
                type="range"
                min="20"
                max="360"
                step="10"
                value={hydrationMs}
                onChange={(event) => setHydrationMs(Number(event.target.value))}
                className="w-full"
              />
            </label>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Рекомендуемый режим"
          value={winner.label}
          hint={winner.bestFor}
          tone="accent"
        />
        <MetricCard
          label="Первый полезный HTML"
          value={`${winner.firstHtmlMs}ms`}
          hint="Когда пользователь видит не пустой shell, а уже полезный контент."
          tone="cool"
        />
        <MetricCard
          label="Интерактивность"
          value={`${winner.interactiveMs}ms`}
          hint="Когда экран уже можно нажимать без ожидания полного оживления дерева."
          tone="dark"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {reports.map((report) => (
          <Panel
            key={report.mode}
            className={report.mode === winner.mode ? 'ring-2 ring-blue-500/60' : ''}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-slate-900">{report.label}</h3>
                  {report.mode === winner.mode ? (
                    <StatusPill tone="success">Recommended</StatusPill>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{report.bestFor}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill tone={toneFromLevel(report.seoReadiness)}>
                  SEO: {formatFitLevel(report.seoReadiness)}
                </StatusPill>
                <StatusPill tone={toneFromLevel(report.cacheability)}>
                  Cache: {formatFitLevel(report.cacheability)}
                </StatusPill>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <MetricCard
                label="HTML"
                value={`${report.firstHtmlMs}ms`}
                hint="Когда появляется первый полезный HTML."
              />
              <MetricCard
                label="Content ready"
                value={`${report.contentReadyMs}ms`}
                hint="Когда критичный контент уже на месте."
                tone="cool"
              />
              <MetricCard
                label="Interactive"
                value={`${report.interactiveMs}ms`}
                hint="Когда пользовательский ввод уже безопасен."
                tone="accent"
              />
            </div>

            <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Где сломаться проще всего
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-700">{report.watchout}</p>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
