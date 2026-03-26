'use client';

import { useState } from 'react';

import { chooseFrameworkStrategy } from '../../lib/framework-playbook-model';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

type ToggleId =
  | 'needsIntegratedFullStack'
  | 'wantsFileConventions'
  | 'needsNestedDataRouters'
  | 'teamValuesFlexibility'
  | 'needsStablePprStory'
  | 'appMostlyInteractiveInternal';

type ToggleState = Record<ToggleId, boolean>;

const defaultState: ToggleState = {
  needsIntegratedFullStack: true,
  wantsFileConventions: true,
  needsNestedDataRouters: true,
  teamValuesFlexibility: false,
  needsStablePprStory: true,
  appMostlyInteractiveInternal: false,
};

const toggleLabels: Record<ToggleId, string> = {
  needsIntegratedFullStack: 'Нужен integrated full-stack surface',
  wantsFileConventions: 'Нужны file conventions / framework structure',
  needsNestedDataRouters: 'Нужны nested route data surfaces',
  teamValuesFlexibility: 'Команда ценит более открытую архитектурную поверхность',
  needsStablePprStory: 'Нужна более зрелая story вокруг PPR',
  appMostlyInteractiveInternal: 'Приложение в основном internal и deeply interactive',
};

export function FrameworkPlaybookLab() {
  const [state, setState] = useState<ToggleState>(defaultState);
  const decision = chooseFrameworkStrategy(state);

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="soft-label">Framework playbook</span>
          <p className="text-sm leading-6 text-slate-600">
            Отмечайте свойства реального продукта. Playbook покажет, когда нужен Next.js,
            когда сильнее выглядит React Router framework mode, а когда framework-first
            переход пока преждевременен.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {(Object.keys(toggleLabels) as ToggleId[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() =>
                setState((current) => ({
                  ...current,
                  [key]: !current[key],
                }))
              }
              className={`rounded-[24px] border px-4 py-4 text-left transition ${
                state[key]
                  ? 'border-sky-500 bg-sky-50 text-sky-950'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <span className="text-sm font-semibold">{toggleLabels[key]}</span>
              <span className="mt-2 block text-sm leading-6 opacity-80">
                {state[key] ? 'Да' : 'Нет'}
              </span>
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Primary strategy"
          value={decision.primaryStrategy}
          hint="Главная рекомендуемая стратегия для текущего набора требований."
          tone="accent"
        />
        <div className="panel p-5 md:col-span-2">
          <StatusPill tone="success">{decision.title}</StatusPill>
          <p className="mt-4 text-sm leading-6 text-slate-700">{decision.why}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <ListBlock title="Рабочие шаги" items={decision.steps} />
        </Panel>
        <Panel className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600">
            Анти-паттерн
          </p>
          <p className="text-sm leading-6 text-slate-700">{decision.antiPattern}</p>
        </Panel>
      </div>
    </div>
  );
}
