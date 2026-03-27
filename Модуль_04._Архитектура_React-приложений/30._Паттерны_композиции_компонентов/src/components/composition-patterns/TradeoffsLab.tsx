import clsx from 'clsx';
import { useState } from 'react';

import { costPatternOptions, type CostScenario } from '../../lib/pattern-domain';
import { evaluatePatternCosts } from '../../lib/pattern-cost-model';
import { MetricCard, StatusPill } from '../ui';

export function TradeoffsLab() {
  const [scenario, setScenario] = useState<CostScenario>({
    pattern: 'compound components',
    thirdPartyChildren: false,
    wrapperLayers: 1,
    implicitContract: false,
    typingPressure: 'high',
    teamDiscoverability: 'high',
  });
  const report = evaluatePatternCosts(scenario);

  function update<Key extends keyof CostScenario>(key: Key, value: CostScenario[Key]) {
    setScenario((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone={report.tone}>{report.tone}</StatusPill>
        <p className="text-sm leading-6 text-slate-600">{report.headline}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Pattern
            </p>
            <div className="mt-4 grid gap-2">
              {costPatternOptions.map((pattern) => (
                <button
                  key={pattern}
                  type="button"
                  onClick={() => update('pattern', pattern)}
                  className={clsx(
                    'rounded-xl border px-3 py-3 text-left text-sm transition',
                    scenario.pattern === pattern
                      ? 'border-blue-500 bg-blue-50 text-blue-950'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                  )}
                >
                  {pattern}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Wrapper layers: {scenario.wrapperLayers}
              </span>
              <input
                type="range"
                min={0}
                max={4}
                value={scenario.wrapperLayers}
                onChange={(event) => update('wrapperLayers', Number(event.target.value))}
                className="mt-3 w-full"
              />
            </label>

            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                <input
                  type="checkbox"
                  checked={scenario.thirdPartyChildren}
                  onChange={(event) => update('thirdPartyChildren', event.target.checked)}
                />
                <span className="text-sm text-slate-700">
                  Есть third-party или не полностью контролируемые children
                </span>
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                <input
                  type="checkbox"
                  checked={scenario.implicitContract}
                  onChange={(event) => update('implicitContract', event.target.checked)}
                />
                <span className="text-sm text-slate-700">
                  API зависит от скрытых правил структуры
                </span>
              </label>
            </div>

            <div className="mt-4 grid gap-3">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Typing pressure
                </span>
                <select
                  value={scenario.typingPressure}
                  onChange={(event) =>
                    update(
                      'typingPressure',
                      event.target.value as CostScenario['typingPressure'],
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
                >
                  <option value="low">low</option>
                  <option value="high">high</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Discoverability
                </span>
                <select
                  value={scenario.teamDiscoverability}
                  onChange={(event) =>
                    update(
                      'teamDiscoverability',
                      event.target.value as CostScenario['teamDiscoverability'],
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
                >
                  <option value="high">high</option>
                  <option value="low">low</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="Risk score"
              value={String(report.score)}
              hint="Чем выше score, тем больше скрытой архитектурной стоимости у выбранного API."
              tone={report.tone === 'success' ? 'cool' : 'accent'}
            />
            <MetricCard
              label="Pattern"
              value={scenario.pattern}
              hint="Стоимость зависит не только от названия паттерна, но и от условий, в которых он используется."
            />
            <MetricCard
              label="Implicit contract"
              value={scenario.implicitContract ? 'yes' : 'no'}
              hint="Неявные правила почти всегда повышают хрупкость API-компонента."
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-slate-900">Основные проблемы</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {report.issues.length > 0 ? (
                  report.issues.map((issue) => (
                    <li
                      key={issue}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      {issue}
                    </li>
                  ))
                ) : (
                  <li className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    Явных критических проблем не видно.
                  </li>
                )}
              </ul>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-slate-900">Что делать дальше</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                {report.guidance.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
