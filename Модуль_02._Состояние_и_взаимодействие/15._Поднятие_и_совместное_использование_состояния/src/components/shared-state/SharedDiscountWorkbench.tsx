import { useState } from 'react';

import {
  buildLiftingReport,
  calculateNetPrice,
  updateNetPrice,
} from '../../lib/lifting-state-model';
import { createDiscountState } from '../../lib/shared-state-domain';
import { StatusPill } from '../ui';

function PercentField({
  value,
  onChange,
}: {
  value: number;
  onChange: (nextValue: number) => void;
}) {
  return (
    <label className="rounded-[24px] border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        discount percent
      </span>
      <input
        type="range"
        min={0}
        max={90}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-4 w-full"
      />
      <span className="mt-3 block text-2xl font-semibold text-slate-900">{value}%</span>
    </label>
  );
}

function NetPriceField({
  value,
  onChange,
}: {
  value: number;
  onChange: (nextValue: number) => void;
}) {
  return (
    <label className="rounded-[24px] border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        net price
      </span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 text-lg text-slate-900 outline-none"
      />
      <span className="mt-3 block text-sm text-slate-600">
        Это поле не хранит отдельный state у себя.
      </span>
    </label>
  );
}

export function SharedDiscountWorkbench() {
  const [discount, setDiscount] = useState(createDiscountState);
  const report = buildLiftingReport(discount);
  const netPrice = calculateNetPrice(discount);

  return (
    <div className="space-y-5">
      <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              lifting state up
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              Родитель владеет одним discount state для нескольких детей
            </h3>
          </div>
          <StatusPill tone={report.tone}>{report.netLabel}</StatusPill>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-3">
          <PercentField
            value={discount.discountPercent}
            onChange={(nextValue) =>
              setDiscount((current) => ({ ...current, discountPercent: nextValue }))
            }
          />
          <NetPriceField
            value={netPrice}
            // Оба child-компонента пишут в одно и то же состояние родителя.
            // Благодаря этому percent, net price и summary остаются синхронными.
            onChange={(nextValue) =>
              setDiscount((current) => updateNetPrice(current, nextValue))
            }
          />
          <div className="rounded-[24px] border border-teal-300/60 bg-teal-100/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              summary
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              {report.grossLabel} → {report.netLabel}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{report.summary}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setDiscount(createDiscountState())}
            className="chip"
          >
            Сбросить
          </button>
        </div>
      </article>
    </div>
  );
}
