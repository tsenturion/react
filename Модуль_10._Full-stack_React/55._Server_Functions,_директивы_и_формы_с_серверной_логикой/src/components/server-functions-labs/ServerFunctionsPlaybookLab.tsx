'use client';

import { useState } from 'react';

import { chooseServerFunctionStrategy } from '../../lib/server-function-playbook-model';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

type ToggleId =
  | 'submitDriven'
  | 'needsBrowserApi'
  | 'needsProtectedWrite'
  | 'wantsMinimalGlue'
  | 'expectsInstantTyping'
  | 'payloadSerializable';

type ToggleState = Record<ToggleId, boolean>;

const defaultState: ToggleState = {
  submitDriven: true,
  needsBrowserApi: false,
  needsProtectedWrite: true,
  wantsMinimalGlue: true,
  expectsInstantTyping: false,
  payloadSerializable: true,
};

const toggleLabels: Record<ToggleId, string> = {
  submitDriven: 'Сценарий живёт вокруг submit',
  needsBrowserApi: 'Нужен browser API',
  needsProtectedWrite: 'Есть защищённая серверная запись',
  wantsMinimalGlue: 'Важно убрать ручной full-stack glue',
  expectsInstantTyping: 'Нужен мгновенный onChange цикл',
  payloadSerializable: 'Payload сериализуемый',
};

export function ServerFunctionsPlaybookLab() {
  const [state, setState] = useState<ToggleState>(defaultState);
  const decision = chooseServerFunctionStrategy(state);

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="soft-label">Server function playbook</span>
          <p className="text-sm leading-6 text-slate-600">
            Отмечайте свойства реального экрана. Playbook подскажет, когда server function
            действительно упрощает full-stack поток, а когда нужен другой путь.
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
          label="Primary pattern"
          value={decision.primaryPattern}
          hint="Рекомендуемая архитектурная форма для текущего сценария."
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
