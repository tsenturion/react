import { useState } from 'react';

import { buildEnrollmentViewModel, type PlanId } from '../../lib/state-flow-model';
import { StatusPill } from '../ui';

export function EnrollmentWorkbench() {
  const [plan, setPlan] = useState<PlanId>('starter');
  const [seats, setSeats] = useState(3);
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Экран собирается из нескольких независимых state-срезов.
  // Ни один DOM-узел не переключается вручную: весь UI выводится из этого набора данных.
  const viewModel = buildEnrollmentViewModel({
    plan,
    seats,
    acceptedRules,
    submitted,
  });

  return (
    <div className="space-y-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            action → state → UI
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">План: {plan}</h3>
        </div>
        <StatusPill tone={viewModel.tone}>{viewModel.actionLabel}</StatusPill>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {(['starter', 'team', 'intensive'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              setPlan(option);
              // После изменения входных данных подтверждение больше нельзя считать актуальным.
              setSubmitted(false);
            }}
            className={`rounded-[24px] border px-4 py-4 text-left transition ${
              plan === option
                ? 'border-blue-500 bg-blue-50 text-blue-900'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setSeats((current) => Math.max(1, current - 1));
            setSubmitted(false);
          }}
          className="chip"
        >
          Забронировать место
        </button>
        <button
          type="button"
          onClick={() => {
            setSeats((current) => current + 1);
            setSubmitted(false);
          }}
          className="chip"
        >
          Освободить место
        </button>
        <label className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={acceptedRules}
            onChange={(event) => {
              setAcceptedRules(event.target.checked);
              setSubmitted(false);
            }}
          />
          Принять правила
        </label>
      </div>

      <div className="rounded-[24px] bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
        {viewModel.availability}. {viewModel.summary}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            if (!acceptedRules) return;
            setSubmitted(true);
          }}
          className="chip"
        >
          Отправить заявку
        </button>
        <button
          type="button"
          onClick={() => {
            // Сброс показывает, что исходный экран тоже является просто ещё одним состоянием.
            setPlan('starter');
            setSeats(3);
            setAcceptedRules(false);
            setSubmitted(false);
          }}
          className="chip"
        >
          Полный сброс
        </button>
      </div>
    </div>
  );
}
