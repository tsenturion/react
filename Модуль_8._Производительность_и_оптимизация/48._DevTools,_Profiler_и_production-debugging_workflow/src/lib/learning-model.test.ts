import { describe, expect, it } from 'vitest';

import { analyzeComponentTree, type RenderTrigger } from './component-tree-model';
import { filterOverviewCardsByFocus, parseOverviewFocus } from './devtools-domain';
import { describeLabFromPath, lessonLabs } from './learning-model';
import { projectPerformanceCases } from './performance-cases-model';
import { summarizeProfilerCommits } from './profiler-model';
import { summarizeTrackSamples } from './performance-tracks-model';
import { evaluateDebugWorkflow } from './workflow-playbook-model';

describe('lesson 48 models', () => {
  it('maps known routes to lab identifiers', () => {
    expect(describeLabFromPath('/performance-tracks')).toBe('performance-tracks');
    expect(describeLabFromPath('/workflow-playbook')).toBe('workflow-playbook');
    expect(describeLabFromPath('/missing')).toBe('overview');
    expect(lessonLabs).toHaveLength(6);
  });

  it('parses overview focus safely', () => {
    expect(parseOverviewFocus('profiler')).toBe('profiler');
    expect(parseOverviewFocus('broken')).toBe('all');
    expect(filterOverviewCardsByFocus('workflow').length).toBeGreaterThan(0);
  });

  it('projects performance cases with workload', () => {
    const projection = projectPerformanceCases({
      query: 'render',
      area: 'render',
      sort: 'impact',
      intensity: 2,
    });

    expect(projection.visibleItems.length).toBeGreaterThan(0);
    expect(projection.operations).toBeGreaterThan(0);
    expect(projection.totalDuration).toBeGreaterThan(0);
  });

  it('summarizes component tree diagnosis', () => {
    const diagnosis = analyzeComponentTree({
      treeMode: 'wide-parent',
      trigger: 'typing' satisfies RenderTrigger,
      highlightedBranch: 'list',
    });

    expect(diagnosis.tone).toBe('warn');
    expect(diagnosis.headline).toContain('слишком высоко');
  });

  it('summarizes profiler commits', () => {
    const summary = summarizeProfilerCommits([
      {
        id: 'List',
        phase: 'update',
        actualDuration: 18,
        baseDuration: 26,
        startTime: 0,
        commitTime: 20,
        interaction: 'typing',
      },
      {
        id: 'Shell',
        phase: 'update',
        actualDuration: 9,
        baseDuration: 11,
        startTime: 21,
        commitTime: 30,
        interaction: 'shell',
      },
    ]);

    expect(summary.commitCount).toBe(2);
    expect(summary.slowestCommit?.id).toBe('List');
    expect(summary.averageActualDuration).toBeGreaterThan(10);
  });

  it('summarizes track samples', () => {
    const summary = summarizeTrackSamples([
      { id: '1', label: 'Input', kind: 'input', startMs: 0, durationMs: 6 },
      { id: '2', label: 'Render', kind: 'render', startMs: 6, durationMs: 22 },
      { id: '3', label: 'Paint', kind: 'paint', startMs: 28, durationMs: 9 },
    ]);

    expect(summary.longestTrack?.label).toBe('Render');
    expect(summary.dominantKind).toBe('render');
  });

  it('chooses workflow by evidence', () => {
    expect(
      evaluateDebugWorkflow({
        symptom: 'refresh-spike',
        productionOnly: true,
        profilerShowsSlowCommit: false,
        browserTraceShowsLongTask: false,
        networkDominates: true,
        routeSpecific: false,
      }).firstTool,
    ).toBe('Browser Performance + Network');

    expect(
      evaluateDebugWorkflow({
        symptom: 'mystery-rerender',
        productionOnly: false,
        profilerShowsSlowCommit: true,
        browserTraceShowsLongTask: false,
        networkDominates: false,
        routeSpecific: false,
      }).firstTool,
    ).toBe('React Profiler');
  });
});
