import clsx from 'clsx';
import { useState } from 'react';

import { reviewBoardSeed, type ReviewTrack } from '../../lib/context-domain';
import {
  createWorkspaceState,
  getVisibleItems,
  getWorkspaceSummary,
} from '../../lib/workspace-reducer-model';
import { WorkspaceProvider } from '../../state/WorkspaceProvider';
import { useLessonViewState } from '../../state/useLessonViewState';
import { useWorkspaceDispatch } from '../../state/useWorkspaceDispatch';
import { useWorkspaceState } from '../../state/useWorkspaceState';
import { MetricCard } from '../ui';

const filters: readonly ReviewTrack[] = [
  'all',
  'core',
  'state',
  'effects',
  'architecture',
];

function WorkspaceToolbar() {
  const state = useWorkspaceState();
  const dispatch = useWorkspaceDispatch();

  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => dispatch({ type: 'filter/set', filter })}
            className={clsx(
              'rounded-xl px-3 py-2 text-sm font-medium transition',
              state.filter === filter
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100',
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => dispatch({ type: 'visibility/toggleResolved' })}
        className="mt-4 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        {state.showResolved ? 'Скрыть resolved' : 'Показать resolved'}
      </button>
    </div>
  );
}

function WorkspaceList() {
  const state = useWorkspaceState();
  const dispatch = useWorkspaceDispatch();
  const { density } = useLessonViewState();
  const visibleItems = getVisibleItems(state);

  return (
    <div className="grid gap-3">
      {visibleItems.map((item) => (
        <article
          key={item.id}
          className={clsx(
            'rounded-[24px] border shadow-sm transition',
            density === 'compact' ? 'p-4' : 'p-5',
            state.focusedId === item.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-200 bg-white',
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                {item.track} • {item.owner}
              </p>
            </div>
            <span className="chip">{item.priority}</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => dispatch({ type: 'focus/set', id: item.id })}
              className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Focus in inspector
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: 'item/toggleResolved', id: item.id })}
              className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              {item.resolved ? 'Reopen' : 'Resolve'}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function DeepPriorityButton() {
  const state = useWorkspaceState();
  const dispatch = useWorkspaceDispatch();
  const focusedId = state.focusedId;

  if (!focusedId) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => dispatch({ type: 'item/cyclePriority', id: focusedId })}
      className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
    >
      Cycle priority from deep child
    </button>
  );
}

function WorkspaceInspector() {
  const state = useWorkspaceState();
  const dispatch = useWorkspaceDispatch();
  const focusedItem = state.items.find((item) => item.id === state.focusedId) ?? null;

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">Inspector branch</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Глубокая боковая панель читает state через context и dispatch-ит actions напрямую,
        без цепочки `onSomethingChange` через промежуточные layout-компоненты.
      </p>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">
          {focusedItem?.title ?? 'Ничего не выбрано'}
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          scope: <strong>{state.scopeName}</strong>
        </p>
      </div>

      <textarea
        value={state.draftNote}
        onChange={(event) => dispatch({ type: 'draft/set', value: event.target.value })}
        rows={5}
        className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-blue-400"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => dispatch({ type: 'draft/apply' })}
          className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          Apply note
        </button>
        <DeepPriorityButton />
      </div>
    </div>
  );
}

function WorkspaceSurface() {
  const state = useWorkspaceState();
  const summary = getWorkspaceSummary(state);
  const { lens } = useLessonViewState();

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Scope"
          value={state.scopeName}
          hint="Provider даёт общую delivery area только этой секции, а не всему приложению."
          tone="cool"
        />
        <MetricCard
          label="Open items"
          value={String(summary.openCount)}
          hint="Reducer остаётся единой моделью переходов, а context доставляет state вниз по дереву."
        />
        <MetricCard
          label="Lesson lens"
          value={lens}
          hint="Над этим workspace живёт ещё один context: lesson shell и рабочий scope сосуществуют как независимые слои."
          tone="accent"
        />
      </div>

      <WorkspaceToolbar />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <WorkspaceList />
        <WorkspaceInspector />
      </div>
    </div>
  );
}

export function WorkspaceArchitectureLab() {
  const [initialState] = useState(() =>
    createWorkspaceState('Review workspace provider', reviewBoardSeed),
  );

  return (
    <WorkspaceProvider initialState={initialState}>
      <WorkspaceSurface />
    </WorkspaceProvider>
  );
}
