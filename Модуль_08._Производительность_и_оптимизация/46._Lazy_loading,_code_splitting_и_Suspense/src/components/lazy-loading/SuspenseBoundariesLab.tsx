import { lazy, Suspense, useState, type ReactNode } from 'react';

import { useRenderCount } from '../../hooks/useRenderCount';
import { delayImport } from '../../lib/lazy-runtime';
import {
  describeBoundaryScenario,
  type BoundaryMode,
} from '../../lib/suspense-boundary-model';
import { MetricCard, Panel, StatusPill } from '../ui';

const LazyGlobalBoundaryWidget = lazy(() =>
  delayImport(() => import('../lazy-chunks/BoundaryGlobalChartChunk'), 980).then(
    (module) => ({ default: module.BoundaryGlobalChartChunk }),
  ),
);
const LazyLocalBoundaryWidget = lazy(() =>
  delayImport(() => import('../lazy-chunks/BoundaryLocalChartChunk'), 980).then(
    (module) => ({ default: module.BoundaryLocalChartChunk }),
  ),
);

function WorkspaceChrome({
  shellNote,
  children,
}: {
  shellNote: string;
  children: ReactNode;
}) {
  const commits = useRenderCount();

  return (
    <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-900">Sidebar stays visible</p>
          <output aria-label="Workspace shell commits" className="chip">
            {commits} commits
          </output>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-600">{shellNote}</p>
      </aside>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function GlobalFallback() {
  return (
    <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-6">
      <p className="text-sm font-semibold text-amber-950">Глобальный fallback</p>
      <p className="mt-2 text-sm leading-6 text-amber-950/80">
        Пока грузится один widget, скрыт весь workspace.
      </p>
    </div>
  );
}

function LocalFallback() {
  return (
    <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-6">
      <p className="text-sm font-semibold text-emerald-950">Локальный fallback</p>
      <p className="mt-2 text-sm leading-6 text-emerald-950/80">
        Загружается только widget slot, а shell остаётся в поле зрения.
      </p>
    </div>
  );
}

export function SuspenseBoundariesLab() {
  const [mode, setMode] = useState<BoundaryMode>('local');
  const [isOpen, setIsOpen] = useState(false);
  const [shellNote, setShellNote] = useState(
    'Меняйте shell note и смотрите, теряется ли контекст экрана во время загрузки.',
  );

  const diagnosis = describeBoundaryScenario({ mode });

  const localLayout = (
    <WorkspaceChrome shellNote={shellNote}>
      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
        <p className="text-sm font-semibold text-slate-900">Workspace summary</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Summary и navigation остаются доступными, пока внутри slot грузится тяжёлый
          модуль.
        </p>
      </div>
      <Suspense fallback={<LocalFallback />}>
        {isOpen ? (
          <LazyLocalBoundaryWidget />
        ) : (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-6 text-sm leading-6 text-slate-600">
            Widget пока не открыт. Локальная boundary сработает только внутри этой зоны.
          </div>
        )}
      </Suspense>
    </WorkspaceChrome>
  );

  const globalLayout = isOpen ? (
    <Suspense fallback={<GlobalFallback />}>
      <LazyGlobalBoundaryWidget shellNote={shellNote} />
    </Suspense>
  ) : (
    <WorkspaceChrome shellNote={shellNote}>
      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
        <p className="text-sm font-semibold text-slate-900">Workspace summary</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Widget пока не открыт. После старта global boundary заменит весь workspace одним
          fallback-экраном.
        </p>
      </div>
    </WorkspaceChrome>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Boundary mode"
          value={diagnosis.fallbackScope}
          hint={diagnosis.detail}
          tone="accent"
        />
        <MetricCard
          label="Shell visibility"
          value={diagnosis.shellVisible ? 'shell survives' : 'shell disappears'}
          hint="Граница Suspense управляет не только fallback-компонентом, но и тем, что пропадает со страницы."
          tone="cool"
        />
        <MetricCard
          label="Current pattern"
          value={mode === 'local' ? 'local boundary' : 'global boundary'}
          hint="На одном и том же widget разница между placement-стратегиями видна особенно быстро."
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Suspense boundary placement
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Граница fallback должна быть настолько узкой, насколько это позволяет UX
            </h2>
          </div>
          <StatusPill tone={mode === 'local' ? 'success' : 'warn'}>
            {diagnosis.headline}
          </StatusPill>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Boundary mode</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'local', label: 'Local boundary' },
                  { value: 'global', label: 'Global boundary' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setMode(item.value as BoundaryMode);
                      setIsOpen(false);
                    }}
                    className={mode === item.value ? 'chip chip-active' : 'chip'}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Shell note</span>
              <textarea
                aria-label="Boundary shell note"
                value={shellNote}
                onChange={(event) => setShellNote(event.target.value)}
                className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-cyan-400"
              />
            </label>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Открыть heavy widget
            </button>
          </div>

          {mode === 'local' ? localLayout : globalLayout}
        </div>
      </Panel>
    </div>
  );
}
