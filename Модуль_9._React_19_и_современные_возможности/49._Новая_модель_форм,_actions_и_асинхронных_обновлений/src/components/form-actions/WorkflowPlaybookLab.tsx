import { useState } from 'react';

import { chooseFormPattern } from '../../lib/workflow-playbook-model';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

export function WorkflowPlaybookLab() {
  const [isRealForm, setIsRealForm] = useState(true);
  const [needsFieldErrors, setNeedsFieldErrors] = useState(true);
  const [needsPendingUi, setNeedsPendingUi] = useState(true);
  const [hasMultipleSubmitOutcomes, setHasMultipleSubmitOutcomes] = useState(false);
  const [submitIsFireAndForget, setSubmitIsFireAndForget] = useState(false);
  const [needsReturnedState, setNeedsReturnedState] = useState(true);

  const verdict = chooseFormPattern({
    isRealForm,
    needsFieldErrors,
    needsPendingUi,
    hasMultipleSubmitOutcomes,
    submitIsFireAndForget,
    needsReturnedState,
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Primary pattern"
          value={verdict.primaryPattern}
          hint={verdict.rationale}
          tone="accent"
        />
        <MetricCard
          label="Design tone"
          value={verdict.tone}
          hint="Рекомендация строится не от моды, а от реальной формы async flow."
          tone="cool"
        />
        <MetricCard
          label="Follow-up"
          value={verdict.followUp}
          hint="Следующий шаг показывает, когда модель нужно усложнять, а когда нет."
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Action playbook
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Хорошая форма выбирает ровно тот action-паттерн, который нужен её submit
              flow
            </h2>
          </div>
          <StatusPill tone={verdict.tone}>{verdict.primaryPattern}</StatusPill>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            {[
              {
                checked: isRealForm,
                setChecked: setIsRealForm,
                label: 'Это настоящий submit формы, а не просто локальное действие.',
              },
              {
                checked: needsFieldErrors,
                setChecked: setNeedsFieldErrors,
                label: 'Нужны field-level errors или returned validation state.',
              },
              {
                checked: needsPendingUi,
                setChecked: setNeedsPendingUi,
                label: 'Нужен pending indicator внутри формы.',
              },
              {
                checked: hasMultipleSubmitOutcomes,
                setChecked: setHasMultipleSubmitOutcomes,
                label: 'У формы несколько submit outcomes: draft, review, publish.',
              },
              {
                checked: submitIsFireAndForget,
                setChecked: setSubmitIsFireAndForget,
                label: 'Submit скорее fire-and-forget и не требует rich result state.',
              },
              {
                checked: needsReturnedState,
                setChecked: setNeedsReturnedState,
                label: 'После submit форма должна получить structured result обратно.',
              },
            ].map((item) => (
              <label
                key={item.label}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(event) => item.setChecked(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300"
                />
                <span className="text-sm leading-6 text-slate-700">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="space-y-4">
            <Panel className="space-y-3 border-cyan-200 bg-cyan-50">
              <p className="text-sm font-semibold text-cyan-950">Почему это решение</p>
              <p className="text-sm leading-6 text-cyan-950/80">{verdict.rationale}</p>
              <p className="text-sm leading-6 text-cyan-950/80">{verdict.followUp}</p>
            </Panel>

            <ListBlock
              title="Анти-паттерны"
              items={[
                'Сразу писать общий onSubmit-handler со switch по типу кнопки.',
                'Поднимать pending/error state высоко в дерево только ради одной формы.',
                'Добавлять useEffect для синхронизации результата submit, который уже может вернуться из action напрямую.',
              ]}
            />
          </div>
        </div>
      </Panel>
    </div>
  );
}
