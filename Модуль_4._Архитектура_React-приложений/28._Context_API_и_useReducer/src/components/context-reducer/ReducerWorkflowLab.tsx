import clsx from 'clsx';
import { useReducer, useState } from 'react';

import { reviewBoardSeed, type ReviewTrack } from '../../lib/context-domain';
import {
  cloneWorkspaceState,
  createWorkspaceState,
  getVisibleItems,
  getWorkspaceSummary,
  workspaceReducer,
  type WorkspaceAction,
} from '../../lib/workspace-reducer-model';
import { MetricCard } from '../ui';

const filters: readonly ReviewTrack[] = [
  'all',
  'core',
  'state',
  'effects',
  'architecture',
];

function formatAction(action: WorkspaceAction) {
  switch (action.type) {
    case 'filter/set':
      return `dispatch({ type: 'filter/set', filter: '${action.filter}' })`;
    case 'focus/set':
      return `dispatch({ type: 'focus/set', id: '${action.id}' })`;
    case 'visibility/toggleResolved':
      return `dispatch({ type: 'visibility/toggleResolved' })`;
    case 'item/toggleResolved':
      return `dispatch({ type: 'item/toggleResolved', id: '${action.id}' })`;
    case 'item/cyclePriority':
      return `dispatch({ type: 'item/cyclePriority', id: '${action.id}' })`;
    case 'draft/set':
      return `dispatch({ type: 'draft/set', value: '...' })`;
    case 'draft/apply':
      return `dispatch({ type: 'draft/apply' })`;
    case 'workspace/reset':
      return `dispatch({ type: 'workspace/reset', snapshot })`;
    default:
      return 'dispatch(action)';
  }
}

export function ReducerWorkflowLab() {
  const [initialState] = useState(() =>
    createWorkspaceState('Reducer demo', reviewBoardSeed),
  );
  const [state, rawDispatch] = useReducer(workspaceReducer, initialState);
  const [history, setHistory] = useState<string[]>([
    "dispatch({ type: 'filter/set', filter: 'all' })",
  ]);

  function dispatch(action: WorkspaceAction) {
    rawDispatch(action);
    setHistory((current) => [formatAction(action), ...current].slice(0, 6));
  }

  const summary = getWorkspaceSummary(state);
  const visibleItems = getVisibleItems(state);
  const focusedItem = state.items.find((item) => item.id === state.focusedId) ?? null;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard
          label="Открытых задач"
          value={String(summary.openCount)}
          hint="Reducer держит бизнес-логику переходов, а не разбрасывает её по setState."
          tone="cool"
        />
        <MetricCard
          label="Resolved"
          value={String(summary.resolvedCount)}
          hint="Переходы вида toggle/cycle/apply удобно выражать через actions."
        />
        <MetricCard
          label="Actions"
          value={String(state.actionCount)}
          hint="Каждое действие проходит через один reducer и оставляет понятный след."
        />
        <MetricCard
          label="Focused item"
          value={focusedItem ? focusedItem.track : 'none'}
          hint="Reducer синхронизирует focus, draft и items в одной модели."
          tone="accent"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
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

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => dispatch({ type: 'visibility/toggleResolved' })}
                className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                {state.showResolved ? 'Скрыть resolved' : 'Показать resolved'}
              </button>
              <button
                type="button"
                onClick={() =>
                  dispatch({
                    type: 'workspace/reset',
                    snapshot: cloneWorkspaceState(initialState),
                  })
                }
                className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Сбросить reducer state
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            {visibleItems.map((item) => (
              <article
                key={item.id}
                className={clsx(
                  'rounded-[24px] border p-5 shadow-sm transition',
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
                  <span className="chip">priority: {item.priority}</span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">{item.note}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'focus/set', id: item.id })}
                    className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Focus
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'item/toggleResolved', id: item.id })}
                    className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    {item.resolved ? 'Reopen' : 'Resolve'}
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'item/cyclePriority', id: item.id })}
                    className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Cycle priority
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-slate-900">Focused inspector</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Reducer держит в одном месте связку `focusedId → draftNote → apply`.
            </p>

            <textarea
              value={state.draftNote}
              onChange={(event) =>
                dispatch({ type: 'draft/set', value: event.target.value })
              }
              rows={6}
              className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-blue-400"
            />

            <button
              type="button"
              onClick={() => dispatch({ type: 'draft/apply' })}
              className="mt-3 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Применить draft к выбранной записи
            </button>
          </div>

          <div className="panel-dark p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Последние dispatch
            </p>
            <div className="mt-3 space-y-2">
              {history.map((entry) => (
                <div
                  key={entry}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-100"
                >
                  <code>{entry}</code>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
