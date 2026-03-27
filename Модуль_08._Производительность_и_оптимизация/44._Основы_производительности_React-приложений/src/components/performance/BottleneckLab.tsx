import { useState } from 'react';

import {
  diagnoseBottleneckScenario,
  getWorkUnits,
  type CostLevel,
} from '../../lib/bottleneck-model';
import { MetricCard, StatusPill } from '../ui';
import { useRenderCount } from '../../hooks/useRenderCount';

function burnCpu(units: number) {
  let checksum = 0;

  for (let index = 0; index < units; index += 1) {
    checksum += Math.sqrt((index % 11) + 1);
  }

  return checksum;
}

function estimateSyntheticCostMs(rowCount: number, workUnits: number) {
  return (rowCount * workUnits) / 1800;
}

function SlowGrid({
  rowCount,
  cost,
  outputLabel,
}: {
  rowCount: number;
  cost: CostLevel;
  outputLabel: string;
}) {
  const commits = useRenderCount();
  const workUnits = getWorkUnits(cost);

  let checksum = 0;
  for (let row = 0; row < rowCount; row += 1) {
    checksum += burnCpu(workUnits);
  }

  const elapsedMs = estimateSyntheticCostMs(rowCount, workUnits);
  const previewRows = Array.from(
    { length: Math.min(rowCount, 6) },
    (_, index) => index + 1,
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-800">Synthetic slow grid</p>
        <output aria-label={outputLabel} className="chip">
          {commits} commits
        </output>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Estimated render cost: <strong>~{elapsedMs.toFixed(2)} ms</strong>. Checksum:{' '}
        <strong>{checksum.toFixed(1)}</strong>.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {previewRows.map((row) => (
          <div
            key={row}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700"
          >
            Row {row}
          </div>
        ))}
      </div>
      {rowCount > previewRows.length ? (
        <p className="mt-3 text-sm leading-6 text-slate-500">
          И ещё {rowCount - previewRows.length} rows участвуют в synthetic work, даже если
          на экране вы видите только sample.
        </p>
      ) : null}
    </div>
  );
}

function WideInspectorBoard({ rowCount, cost }: { rowCount: number; cost: CostLevel }) {
  const commits = useRenderCount();
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const diagnosis = diagnoseBottleneckScenario({
    isolatedControls: false,
    rowCount,
    cost,
    lastInteraction: 'toggle-inspector',
  });

  return (
    <div className="space-y-4 rounded-[28px] border border-rose-200 bg-rose-50 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
            Широкий ререндер
          </p>
          <p className="mt-2 text-sm leading-6 text-rose-900">{diagnosis.detail}</p>
        </div>
        <output
          aria-label="Wide shell commits"
          className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-rose-700"
        >
          {commits} commits
        </output>
      </div>

      <button
        type="button"
        onClick={() => setInspectorOpen((value) => !value)}
        className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
      >
        {inspectorOpen ? 'Закрыть inspector' : 'Открыть inspector'}
      </button>

      <SlowGrid rowCount={rowCount} cost={cost} outputLabel="Wide grid commits" />

      <p className="text-sm leading-6 text-rose-900">
        Rows touched: <strong>{diagnosis.rowsTouched}</strong>. First move:{' '}
        <strong>{diagnosis.firstMove}</strong>.
      </p>
    </div>
  );
}

function LocalInspector() {
  const commits = useRenderCount();
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-800">Local inspector</p>
        <output aria-label="Local inspector commits" className="chip">
          {commits} commits
        </output>
      </div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
      >
        {open ? 'Скрыть local inspector' : 'Открыть local inspector'}
      </button>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Inspector открыт: <strong>{open ? 'да' : 'нет'}</strong>. Это состояние живёт
        рядом с контролом и не должно дёргать slow grid.
      </p>
    </div>
  );
}

function IsolatedInspectorBoard({
  rowCount,
  cost,
}: {
  rowCount: number;
  cost: CostLevel;
}) {
  const commits = useRenderCount();
  const diagnosis = diagnoseBottleneckScenario({
    isolatedControls: true,
    rowCount,
    cost,
    lastInteraction: 'toggle-inspector',
  });

  return (
    <div className="space-y-4 rounded-[28px] border border-emerald-200 bg-emerald-50 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Локализованный control
          </p>
          <p className="mt-2 text-sm leading-6 text-emerald-900">{diagnosis.detail}</p>
        </div>
        <output
          aria-label="Isolated shell commits"
          className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-emerald-700"
        >
          {commits} commits
        </output>
      </div>

      <LocalInspector />
      <SlowGrid rowCount={rowCount} cost={cost} outputLabel="Isolated grid commits" />

      <p className="text-sm leading-6 text-emerald-900">
        Rows touched: <strong>{diagnosis.rowsTouched}</strong>. First move:{' '}
        <strong>{diagnosis.firstMove}</strong>.
      </p>
    </div>
  );
}

export function BottleneckLab() {
  const [rowCount, setRowCount] = useState(36);
  const [cost, setCost] = useState<CostLevel>('medium');

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Сначала спросите"
          value="Что именно дорого?"
          hint="Не каждый rerender одинаково вреден: важна цена затронутого subtree."
          tone="accent"
        />
        <MetricCard
          label="Если lag есть"
          value="measure touched surface"
          hint="Сколько rows реально трогает действие и насколько они тяжёлые."
          tone="cool"
        />
        <MetricCard
          label="Плохой ход"
          value="guessing"
          hint="Догадки по ощущениям легко лечат не тот слой и усложняют код."
          tone="dark"
        />
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">
              Количество synthetic rows
            </span>
            <input
              type="range"
              min="12"
              max="72"
              step="6"
              value={rowCount}
              onChange={(event) => setRowCount(Number(event.target.value))}
              className="w-full"
            />
            <p className="text-sm text-slate-600">{rowCount} rows</p>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Цена одной строки</span>
            <select
              value={cost}
              onChange={(event) => setCost(event.target.value as CostLevel)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
            >
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="heavy">Heavy</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <WideInspectorBoard rowCount={rowCount} cost={cost} />
        <IsolatedInspectorBoard rowCount={rowCount} cost={cost} />
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-5 text-white">
        <div className="flex items-center justify-between gap-3">
          <p className="text-lg font-semibold">Где bottleneck заметнее всего</p>
          <StatusPill tone={cost === 'heavy' ? 'warn' : 'success'}>
            {cost === 'heavy' ? 'heavy rows' : 'contained cost'}
          </StatusPill>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Одинаковый toggle даёт совершенно разный эффект в зависимости от того, живёт ли
          control рядом с expensive branch и насколько дорогой каждая строка оказывается
          сама.
        </p>
      </div>
    </div>
  );
}
