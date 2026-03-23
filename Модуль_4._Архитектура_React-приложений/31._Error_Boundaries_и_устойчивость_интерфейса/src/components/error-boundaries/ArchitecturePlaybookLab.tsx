import clsx from 'clsx';
import { useState } from 'react';

import {
  architectureLayers,
  recommendBoundaryPlacement,
  type CriticalityLevel,
  type RiskLevel,
  type SharedStateLevel,
} from '../../lib/error-architecture-model';

export function ArchitecturePlaybookLab() {
  const [risk, setRisk] = useState<RiskLevel>('high');
  const [sharedState, setSharedState] = useState<SharedStateLevel>('section');
  const [criticality, setCriticality] = useState<CriticalityLevel>('high');
  const [thirdParty, setThirdParty] = useState(true);

  const recommendation = recommendBoundaryPlacement({
    risk,
    sharedState,
    criticality,
    thirdParty,
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Risk
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(['low', 'medium', 'high'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRisk(value)}
                  className={clsx(
                    'rounded-xl px-4 py-2 text-sm font-medium transition',
                    risk === value
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Shared state
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(['isolated', 'section', 'app'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSharedState(value)}
                  className={clsx(
                    'rounded-xl px-4 py-2 text-sm font-medium transition',
                    sharedState === value
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Criticality
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(['low', 'medium', 'high'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCriticality(value)}
                  className={clsx(
                    'rounded-xl px-4 py-2 text-sm font-medium transition',
                    criticality === value
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Third-party
            </p>
            <button
              type="button"
              onClick={() => setThirdParty((current) => !current)}
              className={clsx(
                'mt-4 rounded-xl px-4 py-2 text-sm font-semibold transition',
                thirdParty
                  ? 'bg-amber-500 text-white shadow-md hover:bg-amber-600'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
              )}
            >
              {thirdParty
                ? 'Да, внутри сторонний widget'
                : 'Нет, всё под вашим контролем'}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {architectureLayers.map((layer) => {
            const highlighted = recommendation.highlightedLayers.includes(layer.id);

            return (
              <div
                key={layer.id}
                className={clsx(
                  'rounded-[24px] border p-5 transition',
                  highlighted
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-slate-200 bg-white',
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {layer.id}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-950">
                      {layer.label}
                    </h3>
                  </div>
                  {highlighted ? (
                    <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                      recommended
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{layer.note}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Primary layer
          </p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            {recommendation.primaryLayer}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {recommendation.blastRadius}
          </p>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Reset strategy
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            {recommendation.resetStrategy}
          </p>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Почему так
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            {recommendation.rationale.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[24px] border border-amber-300 bg-amber-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
            Anti-pattern
          </p>
          <p className="mt-3 text-sm leading-6 text-amber-950">
            {recommendation.antiPattern}
          </p>
        </div>
      </div>
    </div>
  );
}
