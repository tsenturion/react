import clsx from 'clsx';
import { useState } from 'react';

import { recommendArchitecture } from '../../lib/architecture-strategy-model';
import { strategyPresets, type StrategyScenario } from '../../lib/context-domain';
import { MetricCard, StatusPill } from '../ui';

function isPresetActive(
  current: StrategyScenario,
  preset: (typeof strategyPresets)[number],
) {
  return (
    current.treeDepth === preset.treeDepth &&
    current.distantConsumers === preset.distantConsumers &&
    current.logicComplexity === preset.logicComplexity &&
    current.sharedScope === preset.sharedScope &&
    current.updates === preset.updates &&
    current.providerEverywhere === preset.providerEverywhere
  );
}

export function StrategyCompareLab() {
  const [scenario, setScenario] = useState<StrategyScenario>({
    ...strategyPresets[1],
  });
  const recommendation = recommendArchitecture(scenario);

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
              <span className="text-sm font-medium text-slate-700">Сложность логики</span>
              <select
                value={scenario.logicComplexity}
                onChange={(event) =>
                  update(
                    'logicComplexity',
                    event.target.value as StrategyScenario['logicComplexity'],
                  )
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
              >
                <option value="simple">simple</option>
                <option value="complex">complex</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Общая область</span>
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
              <span className="text-sm font-medium text-slate-700">
                Частота обновлений
              </span>
              <select
                value={scenario.updates}
                onChange={(event) =>
                  update('updates', event.target.value as StrategyScenario['updates'])
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
              >
                <option value="rare">rare</option>
                <option value="frequent">frequent</option>
              </select>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              <input
                type="checkbox"
                checked={scenario.distantConsumers}
                onChange={(event) => update('distantConsumers', event.target.checked)}
              />
              <span className="text-sm text-slate-700">
                Данные нужны удалённым веткам дерева
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              <input
                type="checkbox"
                checked={scenario.providerEverywhere}
                onChange={(event) => update('providerEverywhere', event.target.checked)}
              />
              <span className="text-sm text-slate-700">
                Есть соблазн завернуть provider вокруг почти всего приложения
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
                Рекомендуемая архитектура: {recommendation.primary}
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
            hint="Чем шире область использования, тем осторожнее нужно проводить границы provider."
            tone="cool"
          />
          <MetricCard
            label="Logic"
            value={scenario.logicComplexity}
            hint="Complex transitions тянут к reducer, simple delivery — к props/context."
          />
          <MetricCard
            label="Tree depth"
            value={String(scenario.treeDepth)}
            hint="Глубокое дерево усиливает цену prop drilling и ценность delivery-layer."
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
            <p className="text-sm font-semibold text-slate-900">Что пойдёт не так</p>
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
