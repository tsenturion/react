import clsx from 'clsx';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  boardReset,
  draftApplied,
  draftChanged,
  filterSet,
  focusSet,
  itemPriorityCycled,
  itemResolvedToggled,
  resolvedVisibilityToggled,
} from '../../store/reviewBoardSlice';
import {
  selectBoardSummary,
  selectFocusedItem,
  selectReviewBoard,
  selectVisibleItems,
} from '../../store/selectors';
import type { ReviewTrack } from '../../lib/redux-domain';
import { MetricCard } from '../ui';

const filters: readonly ReviewTrack[] = [
  'all',
  'core',
  'state',
  'effects',
  'architecture',
];

export function ReduxStoreLab() {
  const dispatch = useAppDispatch();
  const board = useAppSelector(selectReviewBoard);
  const summary = useAppSelector(selectBoardSummary);
  const visibleItems = useAppSelector(selectVisibleItems);
  const focusedItem = useAppSelector(selectFocusedItem);
  const density = useAppSelector((state) => state.lessonView.density);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard
          label="Open items"
          value={String(summary.openCount)}
          hint="Один store отдаёт согласованную картину нескольким view-веткам."
          tone="cool"
        />
        <MetricCard
          label="Resolved"
          value={String(summary.resolvedCount)}
          hint="Derived summary считается от централизованного slice state."
        />
        <MetricCard
          label="Last action"
          value={summary.lastActionType}
          hint="Action log делает поток обновлений читаемым уже на уровне state tree."
          tone="accent"
        />
        <MetricCard
          label="Action count"
          value={String(summary.actionCount)}
          hint="Store фиксирует, сколько transitions уже прошло через reducer."
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
                  onClick={() => dispatch(filterSet(filter))}
                  className={clsx(
                    'rounded-xl px-3 py-2 text-sm font-medium transition',
                    board.filter === filter
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
                onClick={() => dispatch(resolvedVisibilityToggled())}
                className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                {board.showResolved ? 'Скрыть resolved' : 'Показать resolved'}
              </button>
              <button
                type="button"
                onClick={() => dispatch(boardReset())}
                className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Сбросить store
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            {visibleItems.map((item) => (
              <article
                key={item.id}
                className={clsx(
                  'rounded-[24px] border shadow-sm transition',
                  density === 'compact' ? 'p-4' : 'p-5',
                  board.focusedId === item.id
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

                <p className="mt-3 text-sm leading-6 text-slate-600">{item.note}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => dispatch(focusSet(item.id))}
                    className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Focus
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch(itemResolvedToggled(item.id))}
                    className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    {item.resolved ? 'Reopen' : 'Resolve'}
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch(itemPriorityCycled(item.id))}
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
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Inspector branch</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Эта ветка не владеет shared state сама. Она просто читает slice и
              dispatch-ит actions обратно в store.
            </p>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">
                {focusedItem?.title ?? 'Ничего не выбрано'}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                scope: <strong>{board.scopeName}</strong>
              </p>
            </div>

            <textarea
              value={board.draftNote}
              onChange={(event) => dispatch(draftChanged(event.target.value))}
              rows={6}
              className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-blue-400"
            />

            <button
              type="button"
              onClick={() => dispatch(draftApplied())}
              className="mt-3 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Применить draft к выбранной записи
            </button>
          </div>

          <div className="panel-dark p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Store snapshot
            </p>
            <pre className="mt-3 overflow-x-auto text-sm leading-6 text-slate-100">
              <code>{JSON.stringify(board, null, 2)}</code>
            </pre>
          </div>
        </aside>
      </div>
    </div>
  );
}
