import clsx from 'clsx';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import type { DensityMode, SyncMode } from '../../lib/dom-hooks-domain';
import {
  buildLayoutHookSequence,
  computePopoverPlacement,
  describeLayoutMode,
  fallbackPopoverPlacement,
  formatPlacementLabel,
} from '../../lib/layout-timing-model';
import { Panel, StatusPill } from '../ui';

export function LayoutTimingLab() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [syncMode, setSyncMode] = useState<SyncMode>('layout');
  const [density, setDensity] = useState<DensityMode>('compact');
  const [placement, setPlacement] = useState<{ top: number; left: number }>(
    fallbackPopoverPlacement,
  );
  const [measurements, setMeasurements] = useState(0);
  const [status, setStatus] = useState(
    'Выберите режим синхронизации и меняйте размер описания, чтобы увидеть, когда измерение происходит относительно paint.',
  );

  // В обработчиках мы намеренно сбрасываем popover в fallback-позицию.
  // Так легче увидеть, что layout-версия успевает исправиться до paint,
  // а passive effect делает correction уже после первого кадра.
  function resetToFallback(nextStatus: string) {
    setPlacement(fallbackPopoverPlacement);
    setStatus(nextStatus);
  }

  useLayoutEffect(() => {
    if (syncMode !== 'layout') {
      return;
    }

    const stage = stageRef.current;
    const anchor = anchorRef.current;
    const panel = panelRef.current;

    if (!stage || !anchor || !panel) {
      return;
    }

    const next = computePopoverPlacement(
      anchor.getBoundingClientRect(),
      stage.getBoundingClientRect(),
      panel.offsetWidth,
      panel.offsetHeight,
    );

    setPlacement(next);
    setMeasurements((current) => current + 1);
    setStatus(
      `useLayoutEffect измерил popover до paint: ${formatPlacementLabel(
        next.top,
        next.left,
      )}.`,
    );
  }, [density, syncMode]);

  useEffect(() => {
    if (syncMode !== 'effect') {
      return;
    }

    const stage = stageRef.current;
    const anchor = anchorRef.current;
    const panel = panelRef.current;

    if (!stage || !anchor || !panel) {
      return;
    }

    const next = computePopoverPlacement(
      anchor.getBoundingClientRect(),
      stage.getBoundingClientRect(),
      panel.offsetWidth,
      panel.offsetHeight,
    );

    setPlacement(next);
    setMeasurements((current) => current + 1);
    setStatus(
      `useEffect скорректировал popover после paint: ${formatPlacementLabel(
        next.top,
        next.left,
      )}.`,
    );
  }, [density, syncMode]);

  const narrative = describeLayoutMode(syncMode);
  const sequence = buildLayoutHookSequence(syncMode);

  return (
    <Panel className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone="success">{narrative.title}</StatusPill>
        <span className="text-sm text-slate-500">
          Measurements: <strong>{measurements}</strong>
        </span>
        <span className="text-sm text-slate-500">
          Placement:{' '}
          <strong>{formatPlacementLabel(placement.top, placement.left)}</strong>
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Sync hook</span>
          <div className="flex flex-wrap gap-2">
            {(['layout', 'effect'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  resetToFallback(
                    option === 'layout'
                      ? 'Переход на useLayoutEffect: сначала fallback snapshot, затем синхронное измерение.'
                      : 'Переход на useEffect: сначала fallback snapshot, затем correction после paint.',
                  );
                  setSyncMode(option);
                }}
                className={clsx(
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  syncMode === option
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Popover density</span>
          <div className="flex flex-wrap gap-2">
            {(['compact', 'expanded'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  resetToFallback(
                    option === 'compact'
                      ? 'Компактная панель поставлена в fallback и ждёт нового измерения.'
                      : 'Расширенная панель поставлена в fallback и ждёт нового измерения.',
                  );
                  setDensity(option);
                }}
                className={clsx(
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  density === option
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </label>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div
          ref={stageRef}
          className="relative min-h-[22rem] overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,rgba(241,245,249,0.95),rgba(255,255,255,0.92))] p-6 shadow-sm"
        >
          <div className="max-w-sm rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Anchor card
            </p>
            <h3 className="mt-3 text-xl font-semibold text-slate-900">
              Критичный сценарий измерения до paint
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Anchor живёт в обычном JSX, а floating panel рассчитывается уже из реальной
              геометрии DOM.
            </p>
            <button
              ref={anchorRef}
              type="button"
              className="mt-5 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Anchor
            </button>
          </div>

          <div
            ref={panelRef}
            style={{ top: placement.top, left: placement.left }}
            className="absolute w-[16rem] rounded-[24px] border border-blue-200 bg-blue-50/95 p-4 shadow-lg shadow-blue-200/30 transition-[top,left] duration-200"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              Floating panel
            </p>
            <p className="mt-3 text-sm leading-6 text-blue-950">
              {density === 'compact'
                ? 'Компактный блок проще измерить, но он всё равно зависит от реального DOM.'
                : 'Расширенный блок меняет высоту и ширину. Для такого overlay неправильный timing обычно заметнее всего.'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-blue-200 bg-blue-50/80 p-5 text-sm leading-6 text-blue-950">
            {status}
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Phase order
            </p>
            <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              {sequence.map((step, index) => (
                <li
                  key={step}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  {index + 1}. {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </Panel>
  );
}
