import { useState } from 'react';

import {
  buildSiblingSyncReport,
  deriveSelectionLabel,
} from '../../lib/sibling-sync-model';
import { createSelectionItems } from '../../lib/shared-state-domain';
import { StatusPill } from '../ui';

const items = createSelectionItems();

export function SiblingDriftLab() {
  const [toolbarSelectedId, setToolbarSelectedId] = useState<string | null>('alpha');
  const [detailsSelectedId, setDetailsSelectedId] = useState<string | null>('alpha');
  const [sharedSelectedId, setSharedSelectedId] = useState<string | null>('alpha');
  const report = buildSiblingSyncReport(
    items,
    toolbarSelectedId,
    detailsSelectedId,
    sharedSelectedId,
  );

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <article className="rounded-[28px] border border-rose-300 bg-rose-50/80 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
              duplicated local state
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-rose-950">
              Toolbar и Details живут каждый со своей копией selectedId
            </h3>
          </div>
          <StatusPill tone={report.tone}>{report.badLabel}</StatusPill>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-rose-950">Toolbar choice</p>
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setToolbarSelectedId(item.id)}
                className={`w-full rounded-[22px] border px-4 py-4 text-left text-sm ${
                  toolbarSelectedId === item.id
                    ? 'border-rose-300 bg-white text-rose-950'
                    : 'border-rose-200 bg-white/80 text-rose-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-rose-950">Details choice</p>
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setDetailsSelectedId(item.id)}
                className={`w-full rounded-[22px] border px-4 py-4 text-left text-sm ${
                  detailsSelectedId === item.id
                    ? 'border-rose-300 bg-white text-rose-950'
                    : 'border-rose-200 bg-white/80 text-rose-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </article>

      <article className="rounded-[28px] border border-emerald-300 bg-emerald-50/80 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              lifted shared state
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-emerald-950">
              Один selectedId в общем parent для двух siblings
            </h3>
          </div>
          <StatusPill tone="success">{report.goodLabel}</StatusPill>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-emerald-950">Toolbar</p>
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSharedSelectedId(item.id)}
                className={`w-full rounded-[22px] border px-4 py-4 text-left text-sm ${
                  sharedSelectedId === item.id
                    ? 'border-emerald-300 bg-white text-emerald-950'
                    : 'border-emerald-200 bg-white/80 text-emerald-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="rounded-[22px] border border-emerald-200 bg-white px-4 py-4 text-sm leading-6 text-emerald-950">
            <p className="font-semibold">Details panel</p>
            <p className="mt-3">
              Текущий выбор: {deriveSelectionLabel(items, sharedSelectedId)}
            </p>
          </div>
        </div>
      </article>
    </div>
  );
}
