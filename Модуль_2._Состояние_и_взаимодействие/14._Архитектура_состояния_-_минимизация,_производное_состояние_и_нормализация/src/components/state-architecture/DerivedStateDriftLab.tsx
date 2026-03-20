import { useMemo, useState } from 'react';

import {
  buildDerivedStateReport,
  calculatePricingSummary,
  createBadPricingState,
  incrementBadPricingWithoutSync,
  incrementLineQty,
  syncBadPricingState,
} from '../../lib/derived-state-model';
import { createPricingLines } from '../../lib/state-architecture-domain';
import { StatusPill } from '../ui';

export function DerivedStateDriftLab() {
  const [badState, setBadState] = useState(() =>
    createBadPricingState(createPricingLines()),
  );
  const [goodLines, setGoodLines] = useState(createPricingLines);
  const badReport = buildDerivedStateReport(badState);
  const goodSummary = useMemo(() => calculatePricingSummary(goodLines), [goodLines]);
  const badActualSummary = calculatePricingSummary(badState.lines);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <article className="rounded-[28px] border border-rose-300 bg-rose-50/80 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
              duplicated derived state
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-rose-950">
              lines + storedSubtotal + storedLineCount
            </h3>
          </div>
          <StatusPill tone={badReport.tone}>
            {badReport.mismatch ? 'drift' : 'sync'}
          </StatusPill>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-[22px] bg-white px-4 py-4 text-sm text-rose-950">
            stored subtotal: <strong>{badState.storedSubtotal}</strong>
          </div>
          <div className="rounded-[22px] bg-white px-4 py-4 text-sm text-rose-950">
            actual subtotal: <strong>{badActualSummary.subtotal}</strong>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              setBadState((current) => incrementBadPricingWithoutSync(current, 'line-1'))
            }
            className="chip"
          >
            Изменить lines без sync
          </button>
          <button
            type="button"
            onClick={() => setBadState((current) => syncBadPricingState(current))}
            className="chip"
          >
            Ручной sync totals
          </button>
          <button
            type="button"
            onClick={() => setBadState(createBadPricingState(createPricingLines()))}
            className="chip"
          >
            Сбросить
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {badState.lines.map((line) => (
            <div
              key={line.id}
              className="rounded-[22px] border border-rose-200 bg-white px-4 py-4 text-sm text-rose-950"
            >
              {line.title}: {line.qty} × {line.price}
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-[28px] border border-emerald-300 bg-emerald-50/80 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              derived summary
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-emerald-950">
              lines + вычисление totals в рендере
            </h3>
          </div>
          <StatusPill tone="success">always sync</StatusPill>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-[22px] bg-white px-4 py-4 text-sm text-emerald-950">
            subtotal: <strong>{goodSummary.subtotal}</strong>
          </div>
          <div className="rounded-[22px] bg-white px-4 py-4 text-sm text-emerald-950">
            line count: <strong>{goodSummary.lineCount}</strong>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setGoodLines((current) => incrementLineQty(current, 'line-1'))}
            className="chip"
          >
            Изменить lines
          </button>
          <button
            type="button"
            onClick={() => setGoodLines(createPricingLines())}
            className="chip"
          >
            Сбросить
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {goodLines.map((line) => (
            <div
              key={line.id}
              className="rounded-[22px] border border-emerald-200 bg-white px-4 py-4 text-sm text-emerald-950"
            >
              {line.title}: {line.qty} × {line.price}
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
