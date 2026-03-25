import { lazy, Suspense, useState } from 'react';

import { useRenderCount } from '../../hooks/useRenderCount';
import { delayImport } from '../../lib/lazy-runtime';
import {
  describeProgressiveLoading,
  type ProgressivePattern,
} from '../../lib/progressive-loading-model';
import { MetricCard, Panel, StatusPill } from '../ui';

const LazySpinnerChunk = lazy(() =>
  delayImport(() => import('../lazy-chunks/ProgressiveSpinnerChunk'), 930).then(
    (module) => ({ default: module.ProgressiveSpinnerChunk }),
  ),
);
const LazySkeletonChunk = lazy(() =>
  delayImport(() => import('../lazy-chunks/ProgressiveSkeletonChunk'), 930).then(
    (module) => ({ default: module.ProgressiveSkeletonChunk }),
  ),
);
const LazyShellFirstChunk = lazy(() =>
  delayImport(() => import('../lazy-chunks/ProgressiveShellFirstChunk'), 930).then(
    (module) => ({ default: module.ProgressiveShellFirstChunk }),
  ),
);

function SpinnerFallback() {
  return (
    <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-6">
      <p className="text-sm font-semibold text-amber-950">Spinner fallback</p>
      <p className="mt-2 text-sm leading-6 text-amber-950/80">
        Пользователь видит загрузку, но почти весь контекст экрана исчезает.
      </p>
    </div>
  );
}

function SkeletonFallback() {
  return (
    <div className="rounded-[24px] border border-teal-200 bg-teal-50 p-6">
      <p className="text-sm font-semibold text-teal-950">Skeleton fallback</p>
      <div className="mt-4 space-y-3">
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-teal-200/70" />
        <div className="h-16 animate-pulse rounded-2xl bg-teal-200/70" />
      </div>
    </div>
  );
}

function ShellFirstFallback() {
  return (
    <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-6">
      <p className="text-sm font-semibold text-emerald-950">Shell-first fallback</p>
      <p className="mt-2 text-sm leading-6 text-emerald-950/80">
        Layout уже собран, поэтому fallback закрывает только тяжёлую визуализацию.
      </p>
    </div>
  );
}

export function ProgressiveLoadingLab() {
  const shellCommits = useRenderCount();
  const [pattern, setPattern] = useState<ProgressivePattern>('shell-first');
  const [isLoaded, setIsLoaded] = useState(false);
  const [shellNote, setShellNote] = useState(
    'Переключайте loading UX и смотрите, какой объём контекста остаётся доступным во время ожидания.',
  );

  const diagnosis = describeProgressiveLoading({ pattern });

  const PatternChunk =
    pattern === 'spinner'
      ? LazySpinnerChunk
      : pattern === 'skeleton'
        ? LazySkeletonChunk
        : LazyShellFirstChunk;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Shell commits"
          value={`${shellCommits}`}
          hint="Хороший loading UX сохраняет живой shell и не превращает ожидание в пустой экран."
          tone="accent"
        />
        <MetricCard
          label="Context retention"
          value={diagnosis.contextRetention}
          hint={diagnosis.detail}
          tone="cool"
        />
        <MetricCard
          label="Layout shift risk"
          value={diagnosis.layoutShiftRisk}
          hint="Форма fallback влияет на то, насколько резкой выглядит догрузка тяжёлого блока."
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Loading UX and perception
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Suspense должен помогать ощущению отзывчивости, а не просто показывать
              loading state
            </h2>
          </div>
          <StatusPill tone={pattern === 'shell-first' ? 'success' : 'warn'}>
            {diagnosis.headline}
          </StatusPill>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Loading pattern</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'spinner', label: 'Spinner' },
                  { value: 'skeleton', label: 'Skeleton' },
                  { value: 'shell-first', label: 'Shell-first' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setPattern(item.value as ProgressivePattern);
                      setIsLoaded(false);
                    }}
                    className={pattern === item.value ? 'chip chip-active' : 'chip'}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Shell note</span>
              <textarea
                aria-label="Progressive shell note"
                value={shellNote}
                onChange={(event) => setShellNote(event.target.value)}
                className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-cyan-400"
              />
            </label>

            <button
              type="button"
              onClick={() => setIsLoaded(true)}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Загрузить heavy visual
            </button>
          </div>

          <div className="space-y-4">
            {pattern === 'spinner' ? (
              <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                {isLoaded ? (
                  <Suspense fallback={<SpinnerFallback />}>
                    <PatternChunk />
                  </Suspense>
                ) : (
                  <p className="text-sm leading-6 text-slate-600">
                    Spinner-стратегия заменяет основной slot почти целиком, поэтому
                    контекст экрана удерживается хуже всего.
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    Shell metadata stays visible
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{shellNote}</p>
                </div>
                <div className="mt-4">
                  {isLoaded ? (
                    <Suspense
                      fallback={
                        pattern === 'skeleton' ? (
                          <SkeletonFallback />
                        ) : (
                          <ShellFirstFallback />
                        )
                      }
                    >
                      <PatternChunk />
                    </Suspense>
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-6 text-sm leading-6 text-slate-600">
                      Пока heavy visual не активирован, shell уже может показывать summary
                      и действия.
                    </div>
                  )}
                </div>
              </div>
            )}

            <Panel className="border-cyan-200 bg-cyan-50">
              <p className="text-sm font-semibold text-cyan-950">{diagnosis.headline}</p>
              <p className="mt-2 text-sm leading-6 text-cyan-950/80">
                {diagnosis.detail}
              </p>
            </Panel>
          </div>
        </div>
      </Panel>
    </div>
  );
}
