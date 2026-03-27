import clsx from 'clsx';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import type { SyncMode, TrackVariant } from '../../lib/dom-hooks-domain';
import {
  computeIndicatorBox,
  describePositioningMode,
  positioningTabs,
} from '../../lib/positioning-model';
import { Panel, StatusPill } from '../ui';

type IndicatorState = {
  left: number;
  width: number;
  ready: boolean;
};

type PositioningTabId = (typeof positioningTabs)[number]['id'];

const fallbackIndicator: IndicatorState = {
  left: 0,
  width: 72,
  ready: false,
};

export function CriticalPositioningLab() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [syncMode, setSyncMode] = useState<SyncMode>('layout');
  const [trackVariant, setTrackVariant] = useState<TrackVariant>('wide');
  const [activeId, setActiveId] = useState<PositioningTabId>(positioningTabs[0].id);
  const [indicator, setIndicator] = useState<IndicatorState>(fallbackIndicator);
  const [status, setStatus] = useState(
    'Underline ждёт измерения. Меняйте вкладку и ширину дорожки, чтобы увидеть remeasure.',
  );

  useLayoutEffect(() => {
    if (syncMode !== 'layout') {
      return;
    }

    const stage = trackRef.current;
    const activeButton = buttonRefs.current[activeId];

    if (!stage || !activeButton) {
      return;
    }

    const measure = () => {
      const next = computeIndicatorBox(
        activeButton.getBoundingClientRect(),
        stage.getBoundingClientRect(),
      );
      setIndicator({ ...next, ready: true });
      setStatus(`useLayoutEffect выровнял underline до paint: left ${next.left}px.`);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [activeId, syncMode, trackVariant]);

  useEffect(() => {
    if (syncMode !== 'effect') {
      return;
    }

    const stage = trackRef.current;
    const activeButton = buttonRefs.current[activeId];

    if (!stage || !activeButton) {
      return;
    }

    const measure = () => {
      const next = computeIndicatorBox(
        activeButton.getBoundingClientRect(),
        stage.getBoundingClientRect(),
      );
      setIndicator({ ...next, ready: true });
      setStatus(`useEffect поправил underline уже после paint: left ${next.left}px.`);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [activeId, syncMode, trackVariant]);

  const report = describePositioningMode(syncMode, trackVariant);

  return (
    <Panel className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone="success">{report.title}</StatusPill>
        <span className="text-sm text-slate-500">
          Active tab: <strong>{activeId}</strong>
        </span>
        <span className="text-sm text-slate-500">
          Indicator: <strong>{indicator.width}px</strong>
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Hook</span>
          <div className="flex flex-wrap gap-2">
            {(['layout', 'effect'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setIndicator(fallbackIndicator);
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
          <span className="text-sm font-semibold text-slate-700">Track width</span>
          <div className="flex flex-wrap gap-2">
            {(['wide', 'compact'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setIndicator(fallbackIndicator);
                  setTrackVariant(option);
                }}
                className={clsx(
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  trackVariant === option
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
          ref={trackRef}
          className={clsx(
            'relative rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm transition-all',
            trackVariant === 'wide' ? 'max-w-4xl' : 'max-w-[34rem]',
          )}
        >
          <div className="relative rounded-[24px] bg-slate-100 p-2">
            <div
              className={clsx(
                'absolute bottom-2 top-2 rounded-[20px] bg-white shadow-sm transition-[left,width,opacity] duration-200',
                indicator.ready ? 'opacity-100' : 'opacity-40',
              )}
              style={{
                left: indicator.left + 8,
                width: indicator.width,
              }}
            />

            <div className="relative grid gap-2 md:grid-cols-3">
              {positioningTabs.map((tab) => (
                <button
                  key={tab.id}
                  ref={(node) => {
                    buttonRefs.current[tab.id] = node;
                  }}
                  type="button"
                  onClick={() => {
                    setIndicator(fallbackIndicator);
                    setActiveId(tab.id);
                  }}
                  className="relative rounded-[20px] px-4 py-4 text-left"
                >
                  <p className="text-sm font-semibold text-slate-900">{tab.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{tab.summary}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-blue-200 bg-blue-50/80 p-5 text-sm leading-6 text-blue-950">
            {status}
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm leading-6 text-slate-600">{report.summary}</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}
