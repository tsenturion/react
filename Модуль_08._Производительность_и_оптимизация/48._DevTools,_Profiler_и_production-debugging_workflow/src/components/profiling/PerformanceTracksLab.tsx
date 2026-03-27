import { useMemo, useState } from 'react';

import {
  projectPerformanceCases,
  type CaseSort,
  type PerformanceArea,
} from '../../lib/performance-cases-model';
import {
  summarizeTrackSamples,
  type TrackKind,
  type TrackSample,
} from '../../lib/performance-tracks-model';
import { CaseProjectionPreview } from './CaseProjectionPreview';
import { TrackTimeline } from './TrackTimeline';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

function sleep(delayMs: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, delayMs);
  });
}

function safeMark(name: string) {
  performance.mark?.(name);
}

function safeMeasure(name: string, start: string, end: string) {
  try {
    performance.measure?.(name, start, end);
  } catch {
    // В старых browser/test environments measure может быть частично недоступен.
    // Для урока важнее не падать, а продолжать собирать duration через performance.now.
  }
}

function buildTrackSample({
  label,
  kind,
  startMs,
  endMs,
}: {
  label: string;
  kind: TrackKind;
  startMs: number;
  endMs: number;
}): TrackSample {
  return {
    id: `${kind}-${label}-${startMs}`,
    label,
    kind,
    startMs,
    durationMs: endMs - startMs,
  };
}

export function PerformanceTracksLab() {
  const [query, setQuery] = useState('route');
  const [area, setArea] = useState<PerformanceArea>('all');
  const [sort, setSort] = useState<CaseSort>('duration');
  const [intensity, setIntensity] = useState(3);
  const [simulateNetwork, setSimulateNetwork] = useState(true);
  const [samples, setSamples] = useState<TrackSample[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const projection = useMemo(
    () =>
      projectPerformanceCases({
        query,
        area,
        sort,
        intensity,
      }),
    [area, intensity, query, sort],
  );

  const summary = summarizeTrackSamples(samples);

  async function recordInteractionTrace() {
    setIsRecording(true);
    performance.clearMarks?.();
    performance.clearMeasures?.();

    const nextSamples: TrackSample[] = [];

    const inputStart = performance.now();
    safeMark('lesson48:input:start');
    await sleep(8);
    safeMark('lesson48:input:end');
    const inputEnd = performance.now();
    safeMeasure('lesson48:input', 'lesson48:input:start', 'lesson48:input:end');
    nextSamples.push(
      buildTrackSample({
        label: 'Input event',
        kind: 'input',
        startMs: inputStart,
        endMs: inputEnd,
      }),
    );

    const renderStart = performance.now();
    safeMark('lesson48:render:start');
    projectPerformanceCases({
      query,
      area,
      sort,
      intensity,
    });
    safeMark('lesson48:render:end');
    const renderEnd = performance.now();
    safeMeasure('lesson48:render', 'lesson48:render:start', 'lesson48:render:end');
    nextSamples.push(
      buildTrackSample({
        label: 'React render work',
        kind: 'render',
        startMs: renderStart,
        endMs: renderEnd,
      }),
    );

    if (simulateNetwork) {
      const networkStart = performance.now();
      safeMark('lesson48:network:start');
      await sleep(80);
      safeMark('lesson48:network:end');
      const networkEnd = performance.now();
      safeMeasure('lesson48:network', 'lesson48:network:start', 'lesson48:network:end');
      nextSamples.push(
        buildTrackSample({
          label: 'Network wait',
          kind: 'network',
          startMs: networkStart,
          endMs: networkEnd,
        }),
      );
    }

    const commitStart = performance.now();
    safeMark('lesson48:commit:start');
    await new Promise((resolve) =>
      window.requestAnimationFrame(() => resolve(undefined)),
    );
    safeMark('lesson48:commit:end');
    const commitEnd = performance.now();
    safeMeasure('lesson48:commit', 'lesson48:commit:start', 'lesson48:commit:end');
    nextSamples.push(
      buildTrackSample({
        label: 'Commit + layout handoff',
        kind: 'commit',
        startMs: commitStart,
        endMs: commitEnd,
      }),
    );

    const paintStart = performance.now();
    safeMark('lesson48:paint:start');
    await new Promise((resolve) =>
      window.requestAnimationFrame(() => resolve(undefined)),
    );
    safeMark('lesson48:paint:end');
    const paintEnd = performance.now();
    safeMeasure('lesson48:paint', 'lesson48:paint:start', 'lesson48:paint:end');
    nextSamples.push(
      buildTrackSample({
        label: 'Paint visible frame',
        kind: 'paint',
        startMs: paintStart,
        endMs: paintEnd,
      }),
    );

    setSamples(nextSamples);
    setIsRecording(false);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Dominant track"
          value={summary.dominantKind}
          hint={summary.guidance}
          tone="accent"
        />
        <MetricCard
          label="Total trace"
          value={`${summary.totalDuration.toFixed(1)} ms`}
          hint="Один interaction trace полезнее десятка догадок про “вроде тормозит”."
          tone="cool"
        />
        <MetricCard
          label="Longest span"
          value={
            summary.longestTrack
              ? `${summary.longestTrack.label} (${summary.longestTrack.durationMs.toFixed(1)} ms)`
              : 'trace not recorded'
          }
          hint="Tracks помогают увидеть, какой кусок interaction действительно съел budget."
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Browser Performance and tracks
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Trace связывает input, render, network, commit и paint в один сценарий
            </h2>
          </div>
          <StatusPill tone={isRecording ? 'warn' : 'success'}>
            {isRecording ? 'recording trace' : 'trace ready'}
          </StatusPill>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Trace query</span>
              <input
                aria-label="Performance trace query"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Area</span>
              <select
                aria-label="Performance trace area"
                value={area}
                onChange={(event) => setArea(event.target.value as PerformanceArea)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"
              >
                <option value="all">All</option>
                <option value="render">Render</option>
                <option value="routing">Routing</option>
                <option value="network">Network</option>
                <option value="forms">Forms</option>
                <option value="data">Data</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Sort mode</span>
              <select
                aria-label="Performance trace sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as CaseSort)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"
              >
                <option value="impact">Impact</option>
                <option value="duration">Duration</option>
                <option value="frequency">Frequency</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Projection load</span>
              <input
                aria-label="Performance trace intensity"
                type="range"
                min="1"
                max="5"
                value={intensity}
                onChange={(event) => setIntensity(Number(event.target.value))}
                className="w-full"
              />
              <p className="text-sm text-slate-600">{intensity}x synthetic workload</p>
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <input
                type="checkbox"
                checked={simulateNetwork}
                onChange={(event) => setSimulateNetwork(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm leading-6 text-slate-700">
                Добавить network span в trace
              </span>
            </label>

            <button
              type="button"
              onClick={() => {
                void recordInteractionTrace();
              }}
              disabled={isRecording}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {isRecording ? 'Recording…' : 'Record interaction trace'}
            </button>
          </div>

          <div className="space-y-4">
            <CaseProjectionPreview
              title="Current browser trace scenario"
              summary="Этот preview использует тот же workload, который затем разбивается на tracks. Так вы видите не только сумму, но и фазу, где budget сгорает."
              operations={projection.operations}
              totalDuration={projection.totalDuration}
              items={projection.visibleItems.slice(0, 4)}
              statusLabel={
                simulateNetwork ? 'render + network trace' : 'render-heavy trace'
              }
            />
            <TrackTimeline samples={samples} />
          </div>
        </div>
      </Panel>

      <ListBlock
        title="Что даёт browser trace"
        items={[
          'Показывает, сидит ли проблема внутри React render/commit или вне React: layout, paint, network, third-party scripting.',
          'Связывает symptom с цепочкой фаз, а не только с одной “медленной” цифрой.',
          'Помогает читать React Performance Tracks не как украшение DevTools, а как карту взаимодействия пользователя с приложением.',
        ]}
      />
    </div>
  );
}
