import { useState } from 'react';

import {
  choosePriorityStrategy,
  type PriorityScenario,
  type PriorityTool,
} from '../../lib/priority-playbook-model';
import { MetricCard, Panel, StatusPill } from '../ui';

const labels: Record<PriorityTool, string> = {
  'plain-state': 'Plain state',
  'use-transition': 'useTransition',
  'start-transition': 'startTransition',
  'use-deferred-value': 'useDeferredValue',
  'use-effect-event': 'useEffectEvent',
  activity: 'Activity',
  'compose-tools': 'Compose tools',
};

export function PriorityPlaybookLab() {
  const [scenario, setScenario] = useState<PriorityScenario>({
    urgentInput: true,
    needsPendingIndicator: true,
    backgroundViewMayLag: true,
    bulkNonUrgentEvent: false,
    externalEffectNeedsLatestValue: false,
    hiddenSubtreeKeepsState: false,
  });

  const recommendation = choosePriorityStrategy(scenario);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
      <Panel className="space-y-4">
        <p className="text-sm font-semibold text-slate-900">Выбор сценария</p>

        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <input
            type="checkbox"
            checked={scenario.urgentInput}
            onChange={(event) => {
              setScenario((current) => ({
                ...current,
                urgentInput: event.target.checked,
              }));
            }}
          />
          <span className="text-sm leading-6 text-slate-700">
            В интерфейсе есть срочный ввод, который должен оставаться мгновенным.
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <input
            type="checkbox"
            checked={scenario.needsPendingIndicator}
            onChange={(event) => {
              setScenario((current) => ({
                ...current,
                needsPendingIndicator: event.target.checked,
              }));
            }}
          />
          <span className="text-sm leading-6 text-slate-700">
            Нужен явный pending для background update.
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <input
            type="checkbox"
            checked={scenario.backgroundViewMayLag}
            onChange={(event) => {
              setScenario((current) => ({
                ...current,
                backgroundViewMayLag: event.target.checked,
              }));
            }}
          />
          <span className="text-sm leading-6 text-slate-700">
            Тяжёлое secondary view может отставать от срочного input.
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <input
            type="checkbox"
            checked={scenario.bulkNonUrgentEvent}
            onChange={(event) => {
              setScenario((current) => ({
                ...current,
                bulkNonUrgentEvent: event.target.checked,
              }));
            }}
          />
          <span className="text-sm leading-6 text-slate-700">
            Есть отдельное несрочное событие, для которого отдельный pending не
            обязателен.
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <input
            type="checkbox"
            checked={scenario.externalEffectNeedsLatestValue}
            onChange={(event) => {
              setScenario((current) => ({
                ...current,
                externalEffectNeedsLatestValue: event.target.checked,
              }));
            }}
          />
          <span className="text-sm leading-6 text-slate-700">
            Внешний listener должен видеть свежие значения без resubscribe.
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <input
            type="checkbox"
            checked={scenario.hiddenSubtreeKeepsState}
            onChange={(event) => {
              setScenario((current) => ({
                ...current,
                hiddenSubtreeKeepsState: event.target.checked,
              }));
            }}
          />
          <span className="text-sm leading-6 text-slate-700">
            Скрываемое поддерево должно вернуться с сохранённым локальным состоянием.
          </span>
        </label>
      </Panel>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Primary tool"
            value={labels[recommendation.primaryTool]}
            hint="Главный инструмент выбирается по типу проблемы интерфейса, а не по новизне API."
            tone="accent"
          />
          <MetricCard
            label="Supporting tools"
            value={String(recommendation.supportingTools.length)}
            hint="Иногда задача упирается в один инструмент, а иногда в связку нескольких."
            tone="cool"
          />
          <MetricCard
            label="Mindset"
            value={recommendation.maturity}
            hint="Важна не только техническая возможность API, но и то, насколько он оправдан в обычном продукте."
            tone="dark"
          />
        </div>

        <Panel className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Recommendation
              </p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {labels[recommendation.primaryTool]}
              </p>
            </div>
            <StatusPill
              tone={
                recommendation.maturity === 'stable-everyday'
                  ? 'success'
                  : recommendation.maturity === 'stable-situational'
                    ? 'warn'
                    : 'error'
              }
            >
              {recommendation.maturity}
            </StatusPill>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
            {recommendation.reason}
          </div>

          {recommendation.supportingTools.length > 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Supporting tools
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {recommendation.supportingTools.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-800"
                  >
                    {labels[item]}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-6 text-rose-900">
            {recommendation.warning}
          </div>
        </Panel>
      </div>
    </div>
  );
}
