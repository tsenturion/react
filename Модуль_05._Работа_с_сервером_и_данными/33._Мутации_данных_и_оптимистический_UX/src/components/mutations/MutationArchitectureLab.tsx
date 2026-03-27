import clsx from 'clsx';
import { useState } from 'react';

import { recommendMutationUx } from '../../lib/mutation-ux-model';

export function MutationArchitectureLab() {
  const [reversible, setReversible] = useState(true);
  const [destructive, setDestructive] = useState(false);
  const [serverCanonicalizes, setServerCanonicalizes] = useState(false);
  const [instantFeedbackMatters, setInstantFeedbackMatters] = useState(true);
  const [highRisk, setHighRisk] = useState(false);

  const recommendation = recommendMutationUx({
    reversible,
    destructive,
    serverCanonicalizes,
    instantFeedbackMatters,
    highRisk,
  });

  const toggles = [
    {
      label: 'Операция обратима',
      value: reversible,
      toggle: () => setReversible((current) => !current),
    },
    {
      label: 'Операция разрушает данные',
      value: destructive,
      toggle: () => setDestructive((current) => !current),
    },
    {
      label: 'Сервер может изменить итог',
      value: serverCanonicalizes,
      toggle: () => setServerCanonicalizes((current) => !current),
    },
    {
      label: 'Мгновенный отклик критичен',
      value: instantFeedbackMatters,
      toggle: () => setInstantFeedbackMatters((current) => !current),
    },
    {
      label: 'Цена ошибки высокая',
      value: highRisk,
      toggle: () => setHighRisk((current) => !current),
    },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="grid gap-4 md:grid-cols-2">
        {toggles.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.toggle}
            className={clsx(
              'rounded-[24px] border p-5 text-left transition',
              item.value
                ? 'border-blue-300 bg-blue-50'
                : 'border-slate-200 bg-white hover:bg-slate-50',
            )}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Toggle
            </p>
            <h3 className="mt-2 text-lg font-semibold text-slate-950">{item.label}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {item.value ? 'Да' : 'Нет'}
            </p>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Recommendation
          </p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            {recommendation.approach}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Score: {recommendation.score}
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
