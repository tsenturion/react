import {
  Profiler,
  memo,
  useCallback,
  useMemo,
  useState,
  type ProfilerOnRenderCallback,
} from 'react';

import { CaseProjectionPreview } from './CaseProjectionPreview';
import { TrackTimeline } from './TrackTimeline';
import { scenarioPresets } from '../../lib/production-debug-model';
import { summarizeProfilerCommits, type ProfilerCommit } from '../../lib/profiler-model';
import {
  projectPerformanceCases,
  type CaseSort,
  type PerformanceArea,
} from '../../lib/performance-cases-model';
import {
  summarizeTrackSamples,
  type TrackSample,
} from '../../lib/performance-tracks-model';
import {
  evaluateDebugWorkflow,
  type DebugSymptom,
} from '../../lib/workflow-playbook-model';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

function sleep(delayMs: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, delayMs);
  });
}

const ProductionWorkspace = memo(function ProductionWorkspace({
  projection,
  onRender,
  shellPulse,
}: {
  projection: ReturnType<typeof projectPerformanceCases>;
  onRender: ProfilerOnRenderCallback;
  shellPulse: number;
}) {
  return (
    <Profiler id="ProductionWorkspace" onRender={onRender}>
      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Release workspace shell
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Shell pulse {shellPulse}. Здесь удобно видеть, тянет ли route/layout
                signal за собой heavy review board.
              </p>
            </div>
            <span className="chip">{projection.matchCount} matches</span>
          </div>
        </div>
        <CaseProjectionPreview
          title="Production suspect subtree"
          summary="Этот subtree используется как suspect branch для повторяемого расследования. Вы меняете symptom preset и смотрите, как меняются commits и tracks."
          operations={projection.operations}
          totalDuration={projection.totalDuration}
          items={projection.visibleItems}
          statusLabel={projection.peakDuration > 40 ? 'hot subtree' : 'moderate subtree'}
        />
      </div>
    </Profiler>
  );
});

export function ProductionDebugLab() {
  const [scenario, setScenario] = useState<DebugSymptom>('typing-lag');
  const [query, setQuery] = useState(scenarioPresets['typing-lag'].query);
  const [area, setArea] = useState<PerformanceArea>(scenarioPresets['typing-lag'].area);
  const [sort] = useState<CaseSort>('impact');
  const [shellPulse, setShellPulse] = useState(1);
  const [commits, setCommits] = useState<ProfilerCommit[]>([]);
  const [samples, setSamples] = useState<TrackSample[]>([]);
  const [productionOnly, setProductionOnly] = useState(true);
  const [isReproducing, setIsReproducing] = useState(false);

  const projection = useMemo(
    () =>
      projectPerformanceCases({
        query,
        area,
        sort,
        intensity: 4,
      }),
    [area, query, sort],
  );

  const commitSummary = summarizeProfilerCommits(commits);
  const trackSummary = summarizeTrackSamples(samples);

  const workflow = evaluateDebugWorkflow({
    symptom: scenario,
    productionOnly,
    profilerShowsSlowCommit: (commitSummary.slowestCommit?.actualDuration ?? 0) > 18,
    browserTraceShowsLongTask: (trackSummary.longestTrack?.durationMs ?? 0) > 35,
    networkDominates: trackSummary.dominantKind === 'network',
    routeSpecific: scenario === 'navigation-stall',
  });

  const handleRender = useCallback<ProfilerOnRenderCallback>(
    (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
      setCommits((current) =>
        [
          {
            id,
            phase,
            actualDuration,
            baseDuration,
            startTime,
            commitTime,
            interaction: `${scenario} / ${query || 'empty'} / ${area}`,
          },
          ...current,
        ].slice(0, 6),
      );
    },
    [area, query, scenario],
  );

  async function reproduceScenario() {
    const preset = scenarioPresets[scenario];
    setIsReproducing(true);
    setQuery(preset.query);
    setArea(preset.area);
    setShellPulse((value) => value + 1);

    const nextSamples: TrackSample[] = [];
    const start = performance.now();
    nextSamples.push({
      id: `${scenario}-input`,
      label: 'Symptom reproduction',
      kind: 'input',
      startMs: start,
      durationMs: 9,
    });

    const renderStart = performance.now();
    projectPerformanceCases({
      query: preset.query,
      area: preset.area,
      sort,
      intensity: 4,
    });
    const renderEnd = performance.now();
    nextSamples.push({
      id: `${scenario}-render`,
      label: 'Render investigation',
      kind: 'render',
      startMs: renderStart,
      durationMs: renderEnd - renderStart,
    });

    if (scenario === 'refresh-spike') {
      const networkStart = performance.now();
      await sleep(70);
      const networkEnd = performance.now();
      nextSamples.push({
        id: `${scenario}-network`,
        label: 'Refresh network span',
        kind: 'network',
        startMs: networkStart,
        durationMs: networkEnd - networkStart,
      });
    }

    const commitStart = performance.now();
    await new Promise((resolve) =>
      window.requestAnimationFrame(() => resolve(undefined)),
    );
    const commitEnd = performance.now();
    nextSamples.push({
      id: `${scenario}-commit`,
      label: 'Commit handoff',
      kind: 'commit',
      startMs: commitStart,
      durationMs: commitEnd - commitStart,
    });

    setSamples(nextSamples);
    setIsReproducing(false);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Scenario"
          value={scenarioPresets[scenario].title}
          hint={scenarioPresets[scenario].summary}
          tone="accent"
        />
        <MetricCard
          label="First tool"
          value={workflow.firstTool}
          hint={workflow.firstQuestion}
          tone="cool"
        />
        <MetricCard
          label="Suspected layer"
          value={workflow.suspectedLayer}
          hint={workflow.nextStep}
          tone="dark"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Production debugging workflow
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Настоящее расследование сводит symptom, Profiler и browser trace в одну
              линию
            </h2>
          </div>
          <StatusPill tone={isReproducing ? 'warn' : 'success'}>
            {isReproducing ? 'reproducing issue' : 'workflow ready'}
          </StatusPill>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Symptom preset</span>
              <select
                aria-label="Production symptom"
                value={scenario}
                onChange={(event) => setScenario(event.target.value as DebugSymptom)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-400"
              >
                <option value="typing-lag">Typing lag</option>
                <option value="navigation-stall">Navigation stall</option>
                <option value="refresh-spike">Refresh spike</option>
                <option value="mystery-rerender">Mystery rerender</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Query</span>
              <input
                aria-label="Production query"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Area</span>
              <select
                aria-label="Production area"
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

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <input
                type="checkbox"
                checked={productionOnly}
                onChange={(event) => setProductionOnly(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300"
              />
              <span className="text-sm leading-6 text-slate-700">
                Проблема проявляется только в production-подобном сценарии
              </span>
            </label>

            <button
              type="button"
              onClick={() => {
                void reproduceScenario();
              }}
              disabled={isReproducing}
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {isReproducing ? 'Reproducing…' : 'Reproduce symptom'}
            </button>
          </div>

          <div className="space-y-4">
            <ProductionWorkspace
              projection={projection}
              onRender={handleRender}
              shellPulse={shellPulse}
            />

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-slate-900">Profiler evidence</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Slowest commit:{' '}
                  <strong>
                    {commitSummary.slowestCommit
                      ? `${commitSummary.slowestCommit.actualDuration.toFixed(1)} ms`
                      : 'not recorded'}
                  </strong>
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Average actual duration:{' '}
                  <strong>{commitSummary.averageActualDuration.toFixed(1)} ms</strong>
                </p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-slate-900">Browser evidence</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Dominant track: <strong>{trackSummary.dominantKind}</strong>
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Longest span:{' '}
                  <strong>
                    {trackSummary.longestTrack
                      ? `${trackSummary.longestTrack.label} (${trackSummary.longestTrack.durationMs.toFixed(1)} ms)`
                      : 'not recorded'}
                  </strong>
                </p>
              </div>
            </div>

            <TrackTimeline samples={samples} />
          </div>
        </div>
      </Panel>

      <ListBlock
        title="Production workflow"
        items={[
          'Зафиксируйте symptom и сделайте его повторяемым, иначе все дальнейшие цифры будут шумом.',
          'Сначала узнайте, где живёт бюджет: React tree, browser pipeline или network waterfall.',
          'Только после evidence выбирайте fix: tree narrowing, memoization, network policy или layout cleanup.',
        ]}
      />
    </div>
  );
}
