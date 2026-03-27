import clsx from 'clsx';
import { useState } from 'react';

import { boundaryScenarios, type BoundaryScenarioId } from '../../lib/escape-domain';
import { getEscapeRecommendation } from '../../lib/escape-boundary-model';
import { BeforeAfter, Panel, StatusPill } from '../ui';

export function EscapeBoundaryLab() {
  const [activeScenario, setActiveScenario] = useState<BoundaryScenarioId>('modal-layer');

  const scenario =
    boundaryScenarios.find((item) => item.id === activeScenario) ?? boundaryScenarios[0];
  const recommendation = getEscapeRecommendation(activeScenario);

  return (
    <Panel className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone="success">
          escape hatch only when architecture needs it
        </StatusPill>
        <span className="text-sm text-slate-500">
          Recommended: <strong>{recommendation.recommended}</strong>
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {boundaryScenarios.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveScenario(item.id)}
            className={clsx(
              'rounded-[24px] border px-5 py-5 text-left transition',
              activeScenario === item.id
                ? 'border-blue-300 bg-blue-50'
                : 'border-slate-200 bg-white hover:bg-slate-50',
            )}
          >
            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.prompt}</p>
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Current scenario
            </p>
            <h3 className="mt-3 text-xl font-semibold text-slate-900">
              {scenario.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{scenario.prompt}</p>
          </div>

          <BeforeAfter
            beforeTitle="Избыточный путь"
            before={recommendation.before}
            afterTitle="Архитектурно устойчивый путь"
            after={recommendation.after}
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/80 p-5 text-sm leading-6 text-emerald-950">
            <strong>Использовать:</strong> {recommendation.recommended}
          </div>
          <div className="rounded-[24px] border border-rose-200 bg-rose-50/80 p-5 text-sm leading-6 text-rose-950">
            <strong>Избегать:</strong> {recommendation.avoid}
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700 shadow-sm">
            {recommendation.why}
          </div>
        </div>
      </div>
    </Panel>
  );
}
