import { useMemo, useState } from 'react';

import {
  buildMigrationPlan,
  migrationEvidenceChecklist,
  type CodebaseShape,
  type RolloutMode,
  type WorkflowBlockerId,
} from '../../lib/migration-playbook-model';
import { ListBlock, Panel, StatusPill } from '../ui';

export function MigrationWorkflowLab() {
  const [shape, setShape] = useState<CodebaseShape>('mixed');
  const [rolloutMode, setRolloutMode] = useState<RolloutMode>('staged');
  const [blockers, setBlockers] = useState<WorkflowBlockerId[]>([
    'removed-dom-apis',
    'fragile-tests',
    'third-party-lag',
  ]);

  const plan = useMemo(
    () => buildMigrationPlan(shape, blockers, rolloutMode),
    [shape, blockers, rolloutMode],
  );

  const toggleBlocker = (id: WorkflowBlockerId) => {
    setBlockers((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <StatusPill tone={plan.tone}>Migration workflow</StatusPill>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Эта лаборатория собирает целый migration plan из формы кодовой базы,
              blockers и режима rollout. Так видно, что обновление версии — это sequence
              шагов, а не один codemod-коммит.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['small-modern', 'mixed', 'legacy-heavy'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setShape(value)}
                className={`chip ${shape === value ? 'chip-active' : ''}`}
              >
                {value}
              </button>
            ))}
            {(['staged', 'big-bang'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRolloutMode(value)}
                className={`chip ${rolloutMode === value ? 'chip-active' : ''}`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">{plan.title}</h3>
            <StatusPill tone={plan.tone}>{plan.tone}</StatusPill>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{plan.summary}</p>
        </div>
      </Panel>

      <Panel className="grid gap-4 xl:grid-cols-2">
        {(
          [
            'removed-dom-apis',
            'legacy-context',
            'string-refs',
            'custom-entrypoints',
            'fragile-tests',
            'third-party-lag',
          ] as const
        ).map((blocker) => (
          <button
            key={blocker}
            type="button"
            onClick={() => toggleBlocker(blocker)}
            className={`rounded-[24px] border p-5 text-left transition ${
              blockers.includes(blocker)
                ? 'border-sky-300 bg-sky-50/80 shadow-sm'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <h3 className="text-lg font-semibold text-slate-900">{blocker}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Этот blocker будет влиять на порядок действий и доказательств в migration
              plan.
            </p>
          </button>
        ))}
      </Panel>

      <Panel className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          {plan.phases.map((phase) => (
            <div
              key={phase.title}
              className="rounded-[24px] border border-slate-200 bg-white p-5"
            >
              <h3 className="text-lg font-semibold text-slate-900">{phase.title}</h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
                {phase.steps.map((step) => (
                  <li
                    key={step}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <ListBlock title="Evidence checklist" items={migrationEvidenceChecklist} />
      </Panel>
    </div>
  );
}
