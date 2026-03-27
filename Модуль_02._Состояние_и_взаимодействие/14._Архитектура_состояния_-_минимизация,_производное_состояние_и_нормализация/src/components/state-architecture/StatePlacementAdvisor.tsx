import { useState } from 'react';

import { buildPlacementDecision } from '../../lib/placement-model';
import { createPlacementScenario } from '../../lib/state-architecture-domain';
import { CodeBlock, ListBlock, StatusPill } from '../ui';

export function StatePlacementAdvisor() {
  const [scenario, setScenario] = useState(createPlacementScenario);
  const decision = buildPlacementDecision(scenario);

  return (
    <div className="space-y-5">
      <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              state placement
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              Решение строится из требований к данным, а не из привычки хранить всё в
              одном месте
            </h3>
          </div>
          <StatusPill tone={decision.tone}>{decision.target}</StatusPill>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {(
            [
              ['onlyOneLeafUsesIt', 'Нужно только одному leaf-компоненту'],
              ['neededBySiblings', 'Нужно нескольким siblings'],
              ['derivedFromOtherState', 'Полностью выводится из другого state'],
              ['serverOwned', 'Источник данных находится вне компонента'],
              ['mustPersistAcrossPages', 'Знание нужно общему layout или маршруту'],
              [
                'duplicatedAcrossBranches',
                'Одна и та же сущность копируется в разных ветках',
              ],
            ] as const
          ).map(([field, label]) => (
            <label
              key={field}
              className="inline-flex items-center gap-3 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700"
            >
              <input
                type="checkbox"
                checked={scenario[field]}
                onChange={(event) =>
                  setScenario((current) => ({
                    ...current,
                    [field]: event.target.checked,
                  }))
                }
              />
              {label}
            </label>
          ))}
        </div>
      </article>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-slate-900">Почему так</h4>
            <p className="mt-3 text-sm leading-6 text-slate-600">{decision.reason}</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <ListBlock title="Checklist" items={decision.checklist} />
          </div>
        </div>

        <CodeBlock label="Decision shape" code={decision.snippet} />
      </div>
    </div>
  );
}
