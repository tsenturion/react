import clsx from 'clsx';
import { useState } from 'react';

import { buildFluxReport } from '../../lib/flux-loop-model';
import { actionPresets } from '../../lib/redux-domain';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  draftApplied,
  filterSet,
  itemResolvedToggled,
} from '../../store/reviewBoardSlice';
import {
  selectBoardSummary,
  selectFocusedItem,
  selectVisibleItems,
} from '../../store/selectors';
import { MetricCard } from '../ui';

export function UnidirectionalFlowLab() {
  const [intentId, setIntentId] = useState(actionPresets[0]!.id);
  const dispatch = useAppDispatch();
  const summary = useAppSelector(selectBoardSummary);
  const visibleItems = useAppSelector(selectVisibleItems);
  const focusedItem = useAppSelector(selectFocusedItem);
  const report = buildFluxReport(intentId);

  function dispatchSelectedIntent() {
    switch (intentId) {
      case 'resolve-item':
        if (focusedItem) {
          dispatch(itemResolvedToggled(focusedItem.id));
        }
        break;
      case 'change-filter':
        dispatch(filterSet('architecture'));
        break;
      case 'apply-draft':
        dispatch(draftApplied());
        break;
      default:
        break;
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-wrap gap-2">
          {actionPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setIntentId(preset.id)}
              className={clsx(
                'rounded-xl px-4 py-3 text-sm font-medium transition',
                intentId === preset.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100',
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={dispatchSelectedIntent}
          className="mt-4 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Dispatch выбранный intent в store
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard
          label="Last action"
          value={summary.lastActionType}
          hint="Redux оставляет явный след того, какое действие прошло через reducer tree."
          tone="cool"
        />
        <MetricCard
          label="Visible rows"
          value={String(visibleItems.length)}
          hint="Selectors отдают derived data уже после reducer transition."
        />
        <MetricCard
          label="Focused item"
          value={focusedItem?.track ?? 'none'}
          hint="Несколько веток читают один и тот же источник истины."
        />
        <MetricCard
          label="Action count"
          value={String(summary.actionCount)}
          hint="Одна пользовательская операция всегда идёт через один и тот же dispatch boundary."
          tone="accent"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {report.steps.map((step, index) => (
          <article
            key={`${step.phase}-${index}`}
            className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {index + 1}. {step.phase}
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{step.title}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{step.detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
