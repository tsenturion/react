import { useState } from 'react';

import { buildOwnerDecision } from '../../lib/owner-model';
import { createOwnerScenario, type OwnerScenario } from '../../lib/shared-state-domain';
import { CodeBlock, ListBlock, StatusPill } from '../ui';

const controls: readonly { field: keyof OwnerScenario; label: string }[] = [
  { field: 'usedBySiblings', label: 'Нужно нескольким siblings' },
  { field: 'usedByOneLeaf', label: 'Нужно только одному leaf' },
  { field: 'affectsLayoutSummary', label: 'Влияет на общий layout summary' },
  { field: 'needsCrossPagePersistence', label: 'Нужно на нескольких страницах' },
  { field: 'isTemporaryInput', label: 'Это временный локальный ввод' },
];

export function StateOwnerAdvisor() {
  const [scenario, setScenario] = useState(createOwnerScenario);
  const decision = buildOwnerDecision(scenario);

  return (
    <div className="space-y-5">
      <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              owner decision
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              Владелец определяется реальным влиянием состояния на дерево, а не привычкой
              поднимать всё наверх
            </h3>
          </div>
          <StatusPill tone={decision.tone}>{decision.target}</StatusPill>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {controls.map((control) => (
            <label
              key={control.field}
              className="inline-flex items-center gap-3 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700"
            >
              <input
                type="checkbox"
                checked={scenario[control.field]}
                onChange={(event) =>
                  setScenario((current) => ({
                    ...current,
                    [control.field]: event.target.checked,
                  }))
                }
              />
              {control.label}
            </label>
          ))}
        </div>
      </article>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm leading-6 text-slate-600">{decision.reason}</p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
            <ListBlock title="Checklist" items={decision.checklist} />
          </div>
        </div>

        <CodeBlock label="Owner decision" code={decision.snippet} />
      </div>
    </div>
  );
}
