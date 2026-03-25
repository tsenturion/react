import { startTransition, useState } from 'react';

import { useRenderCount } from '../../hooks/useRenderCount';
import { projectSearchResults, type SearchTrack } from '../../lib/search-workload-model';
import {
  describeStartTransitionScenario,
  type TransitionTriggerMode,
  type WorkspaceView,
} from '../../lib/start-transition-model';
import { MetricCard, Panel, StatusPill } from '../ui';
import { SearchProjectionPreview } from './SearchProjectionPreview';

function trackForView(view: WorkspaceView): SearchTrack {
  if (view === 'schedule') {
    return 'forms';
  }

  if (view === 'insights') {
    return 'data';
  }

  return 'render';
}

export function StartTransitionLab() {
  const shellCommits = useRenderCount();
  const [mode, setMode] = useState<TransitionTriggerMode>('start-transition');
  const [activeView, setActiveView] = useState<WorkspaceView>('schedule');
  const [shellNote, setShellNote] = useState(
    'Переключайте heavy workspace и смотрите, что быстрый shell note можно обновить отдельно.',
  );

  const diagnosis = describeStartTransitionScenario({
    mode,
    target: activeView,
  });

  const projection = projectSearchResults({
    query: '',
    track: trackForView(activeView),
    sort: 'complexity',
    intensity: 4,
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Shell commits"
          value={`${shellCommits}`}
          hint="Imported startTransition не убирает parent render, а меняет приоритет тяжёлого workspace update."
          tone="accent"
        />
        <MetricCard
          label="Active view"
          value={diagnosis.viewLabel}
          hint={diagnosis.detail}
          tone="cool"
        />
        <MetricCard
          label="Pending signal"
          value={diagnosis.pendingSignal}
          hint="В отличие от useTransition, imported API сам по себе не возвращает isPending."
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              startTransition for imperative workflows
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              startTransition полезен, когда нужно понизить приоритет тяжёлого screen
              switch без отдельного pending hook
            </h2>
          </div>
          <StatusPill tone={mode === 'start-transition' ? 'success' : 'warn'}>
            {diagnosis.headline}
          </StatusPill>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Switch mode</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'start-transition', label: 'startTransition' },
                  { value: 'direct', label: 'Direct switch' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setMode(item.value as TransitionTriggerMode)}
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
                aria-label="Transition shell note"
                value={shellNote}
                onChange={(event) => setShellNote(event.target.value)}
                className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-cyan-400"
              />
            </label>

            <div className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Workspace</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'schedule', label: 'Schedule' },
                  { value: 'insights', label: 'Insights' },
                  { value: 'review', label: 'Review' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setShellNote(`Переход к ${item.label} зафиксирован в shell сразу.`);

                      if (mode === 'start-transition') {
                        startTransition(() => setActiveView(item.value as WorkspaceView));
                        return;
                      }

                      setActiveView(item.value as WorkspaceView);
                    }}
                    className={activeView === item.value ? 'chip chip-active' : 'chip'}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <SearchProjectionPreview
              title={`Workspace: ${diagnosis.viewLabel}`}
              summary={projection.summary}
              operations={projection.operations}
              items={projection.visibleItems}
              pendingLabel={
                mode === 'start-transition'
                  ? 'background screen switch'
                  : 'urgent screen switch'
              }
            />
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
