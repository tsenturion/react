import { useMemo, useState } from 'react';

import { queryTargets, type QueryTargetId } from '../../lib/rtl-domain';
import { recommendPrimaryQuery } from '../../lib/rtl-runtime';

export function QueryPriorityWorkbench() {
  const [activeTarget, setActiveTarget] = useState<QueryTargetId>('save-button');
  const [showError, setShowError] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  const recommendation = useMemo(
    () => recommendPrimaryQuery(activeTarget),
    [activeTarget],
  );

  return (
    <section className="space-y-5 rounded-[28px] border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Query workbench
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">
            Выберите поверхность UI и сравните её с рекомендуемым query
          </h3>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
          {activeTarget}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {queryTargets.map((target) => (
          <button
            key={target.id}
            type="button"
            aria-pressed={activeTarget === target.id}
            onClick={() => setActiveTarget(target.id)}
            className={`rounded-2xl border px-4 py-4 text-left transition ${
              activeTarget === target.id
                ? 'border-blue-300 bg-blue-50'
                : 'border-slate-200 bg-white'
            }`}
          >
            <p className="text-sm font-semibold text-slate-900">{target.label}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">
              {target.semanticSurface}
            </p>
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <h4 className="text-lg font-semibold text-slate-900">Live semantic surface</h4>
          <div className="mt-4 space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
            <label htmlFor="report-email" className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Email для отчёта</span>
              <input
                id="report-email"
                type="email"
                defaultValue="team@example.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
              />
            </label>

            <p className="text-sm leading-6 text-slate-600">
              Черновик сохранится только после подтверждения.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setShowStatus(true)}
                className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
              >
                Сохранить фильтр
              </button>
              <button
                type="button"
                onClick={() => setShowError((current) => !current)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
              >
                Показать ошибку
              </button>
            </div>

            {showError ? (
              <p
                role="alert"
                className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-900"
              >
                Сначала заполните email для отчёта.
              </p>
            ) : null}

            {showStatus ? (
              <p
                role="status"
                className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900"
              >
                Фильтр сохранён для следующего прогона.
              </p>
            ) : null}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Recommended query
          </p>
          <pre className="mt-3 overflow-x-auto rounded-2xl bg-slate-950 px-4 py-4 text-sm leading-6 text-slate-100">
            <code>{recommendation.method}</code>
          </pre>
          <p className="mt-4 text-sm leading-6 text-slate-600">{recommendation.reason}</p>
          <p className="mt-4 text-sm leading-6 text-slate-900">
            <strong>Не делайте так:</strong> {recommendation.antiPattern}
          </p>
        </div>
      </div>
    </section>
  );
}
