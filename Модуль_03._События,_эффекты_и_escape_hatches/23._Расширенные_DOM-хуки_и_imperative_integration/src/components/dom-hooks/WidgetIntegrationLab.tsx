import clsx from 'clsx';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import {
  createDemoWidget,
  widgetDatasets,
  widgetThemes,
  type SyncMode,
  type WidgetDatasetId,
  type WidgetThemeId,
} from '../../lib/dom-hooks-domain';
import { describeWidgetSyncMode } from '../../lib/widget-integration-model';
import { Panel, StatusPill } from '../ui';

export function WidgetIntegrationLab() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const widgetRef = useRef<ReturnType<typeof createDemoWidget> | null>(null);
  const [connected, setConnected] = useState(true);
  const [syncMode, setSyncMode] = useState<SyncMode>('layout');
  const [themeId, setThemeId] = useState<WidgetThemeId>('midnight');
  const [datasetId, setDatasetId] = useState<WidgetDatasetId>('latency');
  const [status, setStatus] = useState(
    'Host готов. Внешний widget можно подключать и обновлять через ограниченный imperative bridge.',
  );

  useLayoutEffect(() => {
    if (syncMode !== 'layout' || !connected) {
      return;
    }

    const host = hostRef.current;

    if (!host) {
      return;
    }

    const widget = createDemoWidget();
    widget.mount(host);
    widgetRef.current = widget;

    return () => {
      widget.destroy();
      widgetRef.current = null;
    };
  }, [connected, syncMode]);

  useEffect(() => {
    if (syncMode !== 'effect' || !connected) {
      return;
    }

    const host = hostRef.current;

    if (!host) {
      return;
    }

    const widget = createDemoWidget();
    widget.mount(host);
    widgetRef.current = widget;

    return () => {
      widget.destroy();
      widgetRef.current = null;
    };
  }, [connected, syncMode]);

  useLayoutEffect(() => {
    if (syncMode !== 'layout' || !connected) {
      return;
    }

    const widget = widgetRef.current;

    if (!widget) {
      return;
    }

    widget.setTheme(themeId);
    widget.setDataset(datasetId);
  }, [connected, datasetId, syncMode, themeId]);

  useEffect(() => {
    if (syncMode !== 'effect' || !connected) {
      return;
    }

    const widget = widgetRef.current;

    if (!widget) {
      return;
    }

    widget.setTheme(themeId);
    widget.setDataset(datasetId);
  }, [connected, datasetId, syncMode, themeId]);

  const report = describeWidgetSyncMode(syncMode);
  const activeDataset =
    widgetDatasets.find((dataset) => dataset.id === datasetId) ?? widgetDatasets[0];

  return (
    <Panel className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone="success">imperative integration</StatusPill>
        <span className="text-sm text-slate-500">
          Mounted: <strong>{connected ? 'yes' : 'no'}</strong>
        </span>
        <span className="text-sm text-slate-500">
          Bridge mode: <strong>{syncMode}</strong>
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Bridge mode</span>
          <div className="flex flex-wrap gap-2">
            {(['layout', 'effect'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setSyncMode(option);
                  setStatus(
                    option === 'layout'
                      ? 'Для bridge выбран layout-режим: полезно, когда widget влияет на layout.'
                      : 'Для bridge выбран passive-режим: widget подключится уже после paint.',
                  );
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
          <span className="text-sm font-semibold text-slate-700">Theme</span>
          <div className="flex flex-wrap gap-2">
            {widgetThemes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  setThemeId(theme.id);
                  setStatus(
                    `Theme переведена в ${theme.label}. Bridge синхронизирует instance.`,
                  );
                }}
                className={clsx(
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  themeId === theme.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                )}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Dataset</span>
          <div className="flex flex-wrap gap-2">
            {widgetDatasets.map((dataset) => (
              <button
                key={dataset.id}
                type="button"
                onClick={() => {
                  setDatasetId(dataset.id);
                  setStatus(
                    `Dataset переключён на ${dataset.label}. Bridge обновляет существующий widget.`,
                  );
                }}
                className={clsx(
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  datasetId === dataset.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                )}
              >
                {dataset.label}
              </button>
            ))}
          </div>
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            setConnected((current) => !current);
            setStatus(
              connected
                ? 'Widget отключён. React оставил host node, но внешний instance будет уничтожен cleanup-ом.'
                : 'Widget подключается заново через bridge к выделенному host node.',
            );
          }}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          {connected ? 'Disconnect widget' : 'Connect widget'}
        </button>
        <button
          type="button"
          onClick={() => {
            widgetRef.current?.focusPrimaryBar();
            setStatus('Bridge вызвал imperative focus у внешнего widget API.');
          }}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          Focus widget bar
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div
            ref={hostRef}
            className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-2"
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-blue-200 bg-blue-50/80 p-5 text-sm leading-6 text-blue-950">
            {status}
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm leading-6 text-slate-600">{report.summary}</p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                current theme: {themeId}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                current dataset: {datasetId}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                bars inside widget: {activeDataset.series.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
