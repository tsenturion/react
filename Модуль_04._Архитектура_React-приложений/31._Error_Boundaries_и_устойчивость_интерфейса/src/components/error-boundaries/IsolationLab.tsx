import clsx from 'clsx';
import { useState } from 'react';

import {
  getIsolationMetrics,
  type BoundaryPlacement,
} from '../../lib/boundary-scope-model';
import { CrashSurface } from './CrashSurface';
import { LessonErrorBoundary } from './LessonErrorBoundary';

const widgets = [
  { id: 'catalog', label: 'Каталог курсов' },
  { id: 'analytics', label: 'График прогресса' },
  { id: 'payments', label: 'Платёжный блок' },
] as const;

type WidgetId = (typeof widgets)[number]['id'] | 'none';

export function IsolationLab() {
  const [placement, setPlacement] = useState<BoundaryPlacement>('local');
  const [crashedWidget, setCrashedWidget] = useState<WidgetId>('none');

  const metrics = getIsolationMetrics(
    placement,
    widgets.length,
    crashedWidget === 'none' ? 0 : 1,
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        {(['local', 'shared'] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setPlacement(value)}
            className={clsx(
              'rounded-xl px-4 py-2 text-sm font-medium transition',
              placement === value
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
            )}
          >
            {value === 'local' ? 'Локальные boundaries' : 'Общий boundary'}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCrashedWidget('none')}
          className={clsx(
            'rounded-xl px-4 py-2 text-sm font-medium transition',
            crashedWidget === 'none'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
          )}
        >
          Без падения
        </button>
        {widgets.map((widget) => (
          <button
            key={widget.id}
            type="button"
            onClick={() => setCrashedWidget(widget.id)}
            className={clsx(
              'rounded-xl px-4 py-2 text-sm font-medium transition',
              crashedWidget === widget.id
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
            )}
          >
            Сломать {widget.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-4 md:grid-cols-3">
          {placement === 'shared' ? (
            <div className="md:col-span-3">
              <LessonErrorBoundary
                label="Вся секция"
                resetKeys={[placement, crashedWidget]}
                fallbackRender={({ error, reset }) => (
                  <div className="space-y-4 rounded-[28px] border border-rose-300 bg-rose-50 p-6">
                    <h3 className="text-xl font-semibold text-rose-950">
                      Весь раздел заменён общим fallback
                    </h3>
                    <p className="text-sm leading-6 text-rose-900">
                      Один общий boundary упростил код, но увеличил зону поражения:
                      соседние карточки тоже исчезли.
                    </p>
                    <div className="rounded-2xl border border-rose-300 bg-white px-4 py-4 text-sm leading-6 text-rose-900">
                      {error.message}
                    </div>
                    <button
                      type="button"
                      onClick={reset}
                      className="rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-800"
                    >
                      Повторить раздел
                    </button>
                  </div>
                )}
              >
                <div className="grid gap-4 md:grid-cols-3">
                  {widgets.map((widget) => (
                    <CrashSurface
                      key={widget.id}
                      label={widget.label}
                      summary="Карточка входит в общий раздел и делит один boundary со всеми соседями."
                      mode={crashedWidget === widget.id ? 'render' : 'safe'}
                    />
                  ))}
                </div>
              </LessonErrorBoundary>
            </div>
          ) : (
            widgets.map((widget) => (
              <LessonErrorBoundary
                key={widget.id}
                label={widget.label}
                resetKeys={[placement, crashedWidget]}
              >
                <CrashSurface
                  label={widget.label}
                  summary="Каждый widget обёрнут собственным boundary и может деградировать независимо от соседей."
                  mode={crashedWidget === widget.id ? 'render' : 'safe'}
                />
              </LessonErrorBoundary>
            ))
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Blast radius
            </p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Потеряно widget-ов
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {metrics.lostWidgets}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Осталось рабочим
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {metrics.healthyWidgets}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Вывод
            </p>
            <p className="mt-3 text-lg font-semibold text-slate-900">
              {metrics.scopeLabel}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{metrics.explanation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
