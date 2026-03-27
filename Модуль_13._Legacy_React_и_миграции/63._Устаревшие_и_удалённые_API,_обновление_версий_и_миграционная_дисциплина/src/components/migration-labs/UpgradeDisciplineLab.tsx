import { useMemo, useState } from 'react';

import {
  evaluateUpgradeReadiness,
  upgradeAssumptionCards,
  upgradeDisciplineRules,
  type DisciplineMode,
  type UpgradeAssumptionId,
} from '../../lib/upgrade-discipline-model';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

export function UpgradeDisciplineLab() {
  const [disciplineMode, setDisciplineMode] =
    useState<DisciplineMode>('tests-plus-notes');
  const [selectedAssumptions, setSelectedAssumptions] = useState<UpgradeAssumptionId[]>([
    'effects-still-safe',
    'supporting-code-is-neutral',
  ]);

  const evaluation = useMemo(
    () => evaluateUpgradeReadiness(selectedAssumptions, disciplineMode),
    [disciplineMode, selectedAssumptions],
  );

  const toggleAssumption = (id: UpgradeAssumptionId) => {
    setSelectedAssumptions((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <StatusPill tone={evaluation.tone}>Upgrade discipline</StatusPill>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Здесь миграция читается как набор проверяемых предположений. Чем больше
              скрытых assumptions остаётся непроверенными, тем меньше смысла в
              механическом “upgrade passed”.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['codemod-only', 'tests-plus-notes', 'staged-rollout'] as const).map(
              (mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setDisciplineMode(mode)}
                  className={`chip ${disciplineMode === mode ? 'chip-active' : ''}`}
                >
                  {mode}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <MetricCard
            label="Risk score"
            value={String(evaluation.score)}
            hint="Чем выше счёт, тем меньше доверия к миграции как к управляемому изменению."
            tone={
              evaluation.tone === 'error'
                ? 'accent'
                : evaluation.tone === 'warn'
                  ? 'cool'
                  : 'default'
            }
          />
          <MetricCard
            label="Assumptions selected"
            value={String(selectedAssumptions.length)}
            hint="Количество непроверенных предположений, которые всё ещё висят над обновлением."
          />
          <MetricCard
            label="Rollout mode"
            value={disciplineMode}
            hint="Способ rollout либо компенсирует риск, либо оставляет его без страховки."
            tone="dark"
          />
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">{evaluation.title}</h3>
            <StatusPill tone={evaluation.tone}>{evaluation.tone}</StatusPill>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{evaluation.copy}</p>
        </div>
      </Panel>

      <Panel className="grid gap-4 xl:grid-cols-2">
        {upgradeAssumptionCards.map((item) => {
          const selected = selectedAssumptions.includes(item.id);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleAssumption(item.id)}
              className={`rounded-[24px] border p-5 text-left transition ${
                selected
                  ? 'border-amber-300 bg-amber-50/80 shadow-sm'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                  weight {item.weight}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.note}</p>
            </button>
          );
        })}
      </Panel>

      <Panel className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Blockers from current setup
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            {evaluation.blockers.length === 0 ? (
              <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                Явных assumption-blockers не выбрано.
              </li>
            ) : (
              evaluation.blockers.map((blocker) => (
                <li
                  key={blocker}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  {blocker}
                </li>
              ))
            )}
          </ul>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Next steps
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            {evaluation.nextSteps.map((step) => (
              <li
                key={step}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                {step}
              </li>
            ))}
          </ul>
        </div>

        <ListBlock title="Discipline rules" items={upgradeDisciplineRules} />
      </Panel>
    </div>
  );
}
