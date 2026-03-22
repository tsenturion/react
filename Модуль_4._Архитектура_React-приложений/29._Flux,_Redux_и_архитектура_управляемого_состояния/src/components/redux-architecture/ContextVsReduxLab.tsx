import clsx from 'clsx';
import { useState } from 'react';

import { recommendStateArchitecture } from '../../lib/redux-strategy-model';
import { strategyPresets, type StrategyScenario } from '../../lib/redux-domain';
import { MetricCard, StatusPill } from '../ui';

function isPresetActive(
  current: StrategyScenario,
  preset: (typeof strategyPresets)[number],
) {
  return (
    current.treeDepth === preset.treeDepth &&
    current.sharedScope === preset.sharedScope &&
    current.consumerSpread === preset.consumerSpread &&
    current.transitions === preset.transitions &&
    current.crossFeature === preset.crossFeature &&
    current.debugNeed === preset.debugNeed
  );
}

export function ContextVsReduxLab() {
  const [scenario, setScenario] = useState<StrategyScenario>({
    ...strategyPresets[1],
  });
  const recommendation = recommendStateArchitecture(scenario);

  function update<Key extends keyof StrategyScenario>(
    key: Key,
    value: StrategyScenario[Key],
  ) {
    setScenario((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px,1fr]">
      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Быстрые пресеты
          </p>
          <div className="mt-4 grid gap-2">
            {strategyPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setScenario({ ...preset })}
                className={clsx(
                  'rounded-xl border px-3 py-3 text-left text-sm transition',
                  isPresetActive(scenario, preset)
                    ? 'border-blue-500 bg-blue-50 text-blue-950'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                )}
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Глубина дерева: {scenario.treeDepth}
            </span>
            <input
              type="range"
              min={1}
              max={6}
              value={scenario.treeDepth}
              onChange={(event) => update('treeDepth', Number(event.target.value))}
              className="mt-3 w-full"
            />
          </label>

          <div className="mt-4 space-y-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Shared scope</span>
              <select
                value={scenario.sharedScope}
                onChange={(event) =>
                  update(
                    'sharedScope',
                    event.target.value as StrategyScenario['sharedScope'],
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
              >
                <option value="branch">branch</option>
                <option value="section">section</option>
                <option value="app">app</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Consumer spread</span>
              <select
                value={scenario.consumerSpread}
                onChange={(event) =>
                  update(
                    'consumerSpread',
                    event.target.value as StrategyScenario['consumerSpread'],
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
              >
                <option value="near">near</option>
                <option value="distant">distant</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Transitions</span>
              <select
                value={scenario.transitions}
                onChange={(event) =>
                  update(
                    'transitions',
                    event.target.value as StrategyScenario['transitions'],
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
              >
                <option value="simple">simple</option>
                <option value="complex">complex</option>
              </select>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              <input
                type="checkbox"
                checked={scenario.crossFeature}
                onChange={(event) => update('crossFeature', event.target.checked)}
              />
              <span className="text-sm text-slate-700">
                Несколько feature-модулей координируются через общий state
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              <input
                type="checkbox"
                checked={scenario.debugNeed}
                onChange={(event) => update('debugNeed', event.target.checked)}
              />
              <span className="text-sm text-slate-700">
                Нужна прозрачная app-level картина действий и переходов
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xl font-semibold text-slate-900">
                Рекомендуемый слой: {recommendation.primary}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {recommendation.summary}
              </p>
            </div>
            <StatusPill tone={recommendation.tone}>{recommendation.tone}</StatusPill>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <MetricCard
            label="Scope"
            value={scenario.sharedScope}
            hint="Redux начинает выигрывать там, где shared scope уже живёт на уровне приложения."
            tone="cool"
          />
          <MetricCard
            label="Consumers"
            value={scenario.consumerSpread}
            hint="Чем дальше разбросаны потребители, тем дороже становится хаотичный prop drilling."
          />
          <MetricCard
            label="Transitions"
            value={scenario.transitions}
            hint="Complex transitions тянут архитектуру от просто delivery к action/reducer модели."
            tone="accent"
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">Почему</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              {recommendation.reasons.map((reason) => (
                <li
                  key={reason}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">Где можно ошибиться</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              {recommendation.risks.map((risk) => (
                <li
                  key={risk}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
