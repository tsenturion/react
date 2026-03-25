import { useState } from 'react';

import {
  chooseHookStrategy,
  type HookPattern,
  type HookScenario,
} from '../../lib/modern-hooks-playbook-model';
import { MetricCard, Panel, StatusPill } from '../ui';

const labels: Record<HookPattern, string> = {
  'manual-handler': 'Manual handler',
  'plain-form-action': 'Plain form action',
  'use-action-state': 'useActionState',
  'use-form-status': 'useFormStatus',
  'use-optimistic': 'useOptimistic',
  'combined-hooks': 'Combined hooks',
};

export function HooksPlaybookLab() {
  const [scenario, setScenario] = useState<HookScenario>({
    isRealForm: true,
    needsReturnedState: true,
    needsNestedPending: true,
    needsInstantFeedback: false,
    canFailAfterOptimistic: true,
  });

  const recommendation = chooseHookStrategy(scenario);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
      <Panel className="space-y-4">
        <p className="text-sm font-semibold text-slate-900">Выбор сценария</p>
        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <input
            type="checkbox"
            checked={scenario.isRealForm}
            onChange={(event) => {
              setScenario((current) => ({
                ...current,
                isRealForm: event.target.checked,
              }));
            }}
          />
          <span className="text-sm leading-6 text-slate-700">
            У сценария есть реальный submit формы и meaningful FormData.
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <input
            type="checkbox"
            checked={scenario.needsReturnedState}
            onChange={(event) => {
              setScenario((current) => ({
                ...current,
                needsReturnedState: event.target.checked,
              }));
            }}
          />
          <span className="text-sm leading-6 text-slate-700">
            Форма должна вернуть structured success/error/validation result.
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <input
            type="checkbox"
            checked={scenario.needsNestedPending}
            onChange={(event) => {
              setScenario((current) => ({
                ...current,
                needsNestedPending: event.target.checked,
              }));
            }}
          />
          <span className="text-sm leading-6 text-slate-700">
            Pending должен читаться глубоко внутри формы, а не только рядом с root
            submit-кнопкой.
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <input
            type="checkbox"
            checked={scenario.needsInstantFeedback}
            onChange={(event) => {
              setScenario((current) => ({
                ...current,
                needsInstantFeedback: event.target.checked,
              }));
            }}
          />
          <span className="text-sm leading-6 text-slate-700">
            Интерфейс должен показать результат сразу, до server confirmation.
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <input
            type="checkbox"
            checked={scenario.canFailAfterOptimistic}
            onChange={(event) => {
              setScenario((current) => ({
                ...current,
                canFailAfterOptimistic: event.target.checked,
              }));
            }}
          />
          <span className="text-sm leading-6 text-slate-700">
            Сервер может отклонить optimistic действие, и rollback должен быть
            осмысленным.
          </span>
        </label>
      </Panel>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Primary pattern"
            value={labels[recommendation.primaryPattern]}
            hint="Главный инструмент выбирается по структуре async потока, а не по моде на конкретный hook."
            tone="accent"
          />
          <MetricCard
            label="Supporting hooks"
            value={String(recommendation.supportingPatterns.length)}
            hint="Иногда один hook не покрывает весь UX, и форма требует связки API."
            tone="cool"
          />
          <MetricCard
            label="Real form"
            value={scenario.isRealForm ? 'yes' : 'no'}
            hint="Без настоящего submit-form lifecycle form hooks быстро превращаются в лишнюю абстракцию."
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
                {labels[recommendation.primaryPattern]}
              </p>
            </div>
            <StatusPill
              tone={
                recommendation.primaryPattern === 'combined-hooks'
                  ? 'warn'
                  : recommendation.primaryPattern === 'manual-handler'
                    ? 'error'
                    : 'success'
              }
            >
              {recommendation.primaryPattern}
            </StatusPill>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
            {recommendation.reason}
          </div>

          {recommendation.supportingPatterns.length > 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Supporting hooks
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {recommendation.supportingPatterns.map((item) => (
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
