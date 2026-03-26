import { useState } from 'react';

import { chooseBoundaryStrategy } from '../../lib/rsc-playbook-model';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

type ToggleId =
  | 'needsLiveTyping'
  | 'readsPrivateData'
  | 'wantsMinimalBundle'
  | 'requiresBrowserApi'
  | 'parentMostlyStatic'
  | 'sharesLargeLocalState';

type ToggleState = Record<ToggleId, boolean>;

const defaultState: ToggleState = {
  needsLiveTyping: false,
  readsPrivateData: true,
  wantsMinimalBundle: true,
  requiresBrowserApi: false,
  parentMostlyStatic: true,
  sharesLargeLocalState: false,
};

const toggleLabels: Record<ToggleId, string> = {
  needsLiveTyping: 'Есть живой ввод и local typing loop',
  readsPrivateData: 'Блок читает приватные данные',
  wantsMinimalBundle: 'Важно отправить минимум JS',
  requiresBrowserApi: 'Нужны browser APIs',
  parentMostlyStatic: 'Вокруг в основном статический server shell',
  sharesLargeLocalState: 'У subtree большая общая local state модель',
};

export function RscPlaybookLab() {
  const [state, setState] = useState<ToggleState>(defaultState);
  const decision = chooseBoundaryStrategy(state);

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="soft-label">Boundary playbook</span>
          <p className="text-sm leading-6 text-slate-600">
            Отмечайте реальные свойства экрана. Playbook подскажет, где лучше начать: с
            server default, с client island или с более крупного mixed subtree.
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
          hint="Это не формальная метка, а рекомендуемая стартовая архитектура для текущего набора условий."
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
