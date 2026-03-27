import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useLessonTestPreferences } from '../../state/LessonTestPreferencesContext';

export function ProviderHarnessLab() {
  const location = useLocation();
  const { density, reviewMode, setDensity, toggleReviewMode } =
    useLessonTestPreferences();
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="space-y-5 rounded-[28px] border border-slate-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Provider harness
          </p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">
            Один и тот же компонент зависит и от provider, и от текущего route state
          </h3>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
          {density} / {reviewMode}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Context state
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Density: <strong>{density}</strong>
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Review mode: <strong>{reviewMode}</strong>
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                setDensity((current) =>
                  current === 'compact' ? 'comfortable' : 'compact',
                )
              }
              className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
            >
              Переключить density
            </button>
            <button
              type="button"
              onClick={toggleReviewMode}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
            >
              Переключить review mode
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Route state
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Pathname: <strong>{location.pathname}</strong>
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            Search: <strong>{location.search || '(empty)'}</strong>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
      >
        {expanded ? 'Скрыть contract summary' : 'Показать contract summary'}
      </button>

      {expanded ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
          Этот компонент в тесте требует и router, и provider, поэтому focused custom
          render helper здесь действительно уменьшает шум.
        </div>
      ) : null}
    </section>
  );
}
