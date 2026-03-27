import { useState } from 'react';

import { buildBookingViewModel } from '../../lib/upward-flow-model';
import { createBookingState, type BookingState } from '../../lib/shared-state-domain';
import { StatusPill } from '../ui';

function SeatPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (nextValue: number) => void;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        seat picker
      </p>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, value - 1))}
          className="chip"
        >
          -1
        </button>
        <span className="text-2xl font-semibold text-slate-900">{value}</span>
        <button type="button" onClick={() => onChange(value + 1)} className="chip">
          +1
        </button>
      </div>
    </div>
  );
}

function TierPicker({
  value,
  onChange,
}: {
  value: BookingState['tier'];
  onChange: (nextValue: BookingState['tier']) => void;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        tier picker
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {(['starter', 'team', 'intensive'] as const).map((tier) => (
          <button
            key={tier}
            type="button"
            onClick={() => onChange(tier)}
            className={value === tier ? 'chip chip-active' : 'chip'}
          >
            {tier}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ChildParentFlowLab() {
  const [booking, setBooking] = useState(createBookingState);
  const view = buildBookingViewModel(booking);

  return (
    <div className="space-y-5">
      <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              child → parent → siblings
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              Дочерние контролы отправляют изменения вверх, summary читает их вниз
            </h3>
          </div>
          <StatusPill tone={booking.acceptedRules ? 'success' : 'warn'}>
            {view.actionLabel}
          </StatusPill>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_280px]">
          <SeatPicker
            value={booking.seats}
            onChange={(nextValue) =>
              setBooking((current) => ({ ...current, seats: nextValue }))
            }
          />
          <TierPicker
            value={booking.tier}
            onChange={(nextValue) =>
              setBooking((current) => ({ ...current, tier: nextValue }))
            }
          />
          <div className="rounded-[24px] border border-teal-300/60 bg-teal-100/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              summary
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              {view.totalPrice}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              за место: {view.seatPrice}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{view.summary}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={booking.acceptedRules}
              onChange={(event) =>
                setBooking((current) => ({
                  ...current,
                  acceptedRules: event.target.checked,
                }))
              }
            />
            Принять правила
          </label>
          <button
            type="button"
            onClick={() => setBooking(createBookingState())}
            className="chip"
          >
            Сбросить
          </button>
        </div>
      </article>
    </div>
  );
}
