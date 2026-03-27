import { useEffect, useRef, useState } from 'react';

import { formatPixels, readBoxMetrics, type BoxMetrics } from '../../lib/ref-domain';
import { Panel, StatusPill } from '../ui';

export function MeasureLab() {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(320);
  const [padding, setPadding] = useState(20);
  const [lines, setLines] = useState(3);
  const [metrics, setMetrics] = useState<BoxMetrics | null>(null);

  useEffect(() => {
    const node = boxRef.current;

    if (!node) {
      return;
    }

    const updateMetrics = () => {
      setMetrics(readBoxMetrics(node));
    };

    const frameId = window.requestAnimationFrame(updateMetrics);

    if (typeof ResizeObserver === 'undefined') {
      return () => {
        window.cancelAnimationFrame(frameId);
      };
    }

    const observer = new ResizeObserver(() => {
      updateMetrics();
    });

    observer.observe(node);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, []);

  function measureNow() {
    if (!boxRef.current) {
      return;
    }

    setMetrics(readBoxMetrics(boxRef.current));
  }

  return (
    <Panel className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone="success">DOM measurement via ref</StatusPill>
        <button
          type="button"
          onClick={measureNow}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Измерить сейчас
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Width {width}px</span>
          <input
            type="range"
            min={220}
            max={520}
            value={width}
            onChange={(event) => setWidth(Number(event.target.value))}
            className="w-full"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">
            Padding {padding}px
          </span>
          <input
            type="range"
            min={12}
            max={40}
            value={padding}
            onChange={(event) => setPadding(Number(event.target.value))}
            className="w-full"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Lines {lines}</span>
          <input
            type="range"
            min={2}
            max={8}
            value={lines}
            onChange={(event) => setLines(Number(event.target.value))}
            className="w-full"
          />
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[28px] border border-slate-200 bg-slate-50/70 p-6">
          <div
            ref={boxRef}
            className="rounded-[24px] border border-slate-200 bg-white text-slate-700 shadow-sm transition"
            style={{
              width,
              padding,
            }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Measured card
            </p>
            <div className="mt-4 space-y-3">
              {Array.from({ length: lines }, (_, index) => (
                <p key={index} className="text-sm leading-6">
                  DOM measuring становится полезным там, где итоговый layout зависит от
                  браузерного расчёта размеров, wrapping и padding.
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Последние метрики
          </p>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              clientWidth: {metrics ? formatPixels(metrics.clientWidth) : '—'}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              clientHeight: {metrics ? formatPixels(metrics.clientHeight) : '—'}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              rectWidth: {metrics ? formatPixels(metrics.rectWidth) : '—'}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              rectHeight: {metrics ? formatPixels(metrics.rectHeight) : '—'}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              scrollHeight: {metrics ? formatPixels(metrics.scrollHeight) : '—'}
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
