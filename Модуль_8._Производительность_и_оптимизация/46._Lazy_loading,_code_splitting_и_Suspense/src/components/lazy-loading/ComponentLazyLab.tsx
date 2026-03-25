import { lazy, Suspense, useState } from 'react';

import { useRenderCount } from '../../hooks/useRenderCount';
import {
  describeComponentSplitScenario,
  type ComponentPanel,
  type ComponentSplitMode,
} from '../../lib/component-split-model';
import { delayImport } from '../../lib/lazy-runtime';
import { MetricCard, Panel, StatusPill } from '../ui';

const LazyBundleRadar = lazy(() =>
  delayImport(() => import('../lazy-chunks/ComponentBundleRadarChunk'), 900).then(
    (module) => ({ default: module.ComponentBundleRadarChunk }),
  ),
);
const LazyPreviewStudio = lazy(() =>
  delayImport(() => import('../lazy-chunks/ComponentPreviewStudioChunk'), 1050).then(
    (module) => ({ default: module.ComponentPreviewStudioChunk }),
  ),
);
const LazyAuditConsole = lazy(() =>
  delayImport(() => import('../lazy-chunks/ComponentAuditConsoleChunk'), 980).then(
    (module) => ({ default: module.ComponentAuditConsoleChunk }),
  ),
);

function EagerPanel({ panel }: { panel: ComponentPanel }) {
  const commits = useRenderCount();
  const content =
    panel === 'bundle-radar'
      ? {
          title: 'Bundle radar rendered eagerly',
          copy: 'Все данные уже приехали вместе с первым bundle, даже если панель не откроется.',
        }
      : panel === 'preview-studio'
        ? {
            title: 'Preview studio rendered eagerly',
            copy: 'Editor и preview surface уже лежат в initial payload и не требуют ожидания при открытии.',
          }
        : {
            title: 'Audit console rendered eagerly',
            copy: 'Тяжёлая консоль доступна сразу, но её стоимость оплачивается заранее.',
          };

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">{content.title}</p>
        <output aria-label="Eager panel commits" className="chip">
          {commits} commits
        </output>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{content.copy}</p>
    </div>
  );
}

function ComponentFallback({ panelTitle }: { panelTitle: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-5">
      <p className="text-sm font-semibold text-slate-900">Chunk панели загружается</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {panelTitle} вынесен в отдельный модуль и приходит только после явного намерения
        открыть панель.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-16 animate-pulse rounded-2xl bg-slate-200/70" />
        ))}
      </div>
    </div>
  );
}

export function ComponentLazyLab() {
  const shellCommits = useRenderCount();
  const [mode, setMode] = useState<ComponentSplitMode>('lazy');
  const [panel, setPanel] = useState<ComponentPanel>('bundle-radar');
  const [isOpen, setIsOpen] = useState(false);
  const [shellNote, setShellNote] = useState(
    'Выбирайте panel и режим загрузки, чтобы сравнить upfront cost и локальный fallback.',
  );

  const diagnosis = describeComponentSplitScenario({
    mode,
    panel,
    isOpen,
  });

  const LazyPanel =
    panel === 'bundle-radar'
      ? LazyBundleRadar
      : panel === 'preview-studio'
        ? LazyPreviewStudio
        : LazyAuditConsole;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Shell commits"
          value={`${shellCommits}`}
          hint="Parent shell остаётся интерактивным вне зависимости от того, где именно стоит split point."
          tone="accent"
        />
        <MetricCard
          label="Bundle strategy"
          value={diagnosis.bundleImpact}
          hint={diagnosis.detail}
          tone="cool"
        />
        <MetricCard
          label="Panel"
          value={diagnosis.panelTitle}
          hint={diagnosis.waitingExperience}
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              React.lazy for component chunks
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Component splitting хорош там, где тяжёлый блок нужен не в каждой сессии
            </h2>
          </div>
          <StatusPill tone={mode === 'lazy' ? 'success' : 'warn'}>
            {diagnosis.headline}
          </StatusPill>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Shell note</span>
              <textarea
                aria-label="Shell note"
                value={shellNote}
                onChange={(event) => setShellNote(event.target.value)}
                className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-cyan-400"
              />
            </label>

            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Loading mode</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'lazy', label: 'Lazy split' },
                  { value: 'eager', label: 'Eager import' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setMode(item.value as ComponentSplitMode)}
                    className={mode === item.value ? 'chip chip-active' : 'chip'}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Panel</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'bundle-radar', label: 'Bundle radar' },
                  { value: 'preview-studio', label: 'Preview studio' },
                  { value: 'audit-console', label: 'Audit console' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setPanel(item.value as ComponentPanel);
                      setIsOpen(true);
                    }}
                    className={panel === item.value ? 'chip chip-active' : 'chip'}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen((current) => !current)}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {isOpen ? 'Скрыть панель' : 'Открыть панель'}
            </button>
          </div>

          <div className="space-y-4">
            {!isOpen ? (
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-6 text-sm leading-6 text-slate-600">
                Пока панель закрыта, lazy-mode не тянет отдельный chunk. Это и есть
                главная экономия code splitting для редких инструментов.
              </div>
            ) : mode === 'eager' ? (
              <EagerPanel panel={panel} />
            ) : (
              <Suspense
                fallback={<ComponentFallback panelTitle={diagnosis.panelTitle} />}
              >
                <LazyPanel />
              </Suspense>
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
