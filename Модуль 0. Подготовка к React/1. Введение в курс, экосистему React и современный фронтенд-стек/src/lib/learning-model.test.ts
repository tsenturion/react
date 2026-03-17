import { describe, expect, it } from 'vitest';

import {
  analyzePipeline,
  analyzeReactValue,
  recommendDeliveryModes,
  runToolingCommand,
  type ToolingConfig,
} from './learning-model';

describe('learning model', () => {
  it('flags no-build + jsx as broken pipeline', () => {
    const result = analyzePipeline('no-build', ['jsx'], []);

    expect(result.overall).toBe('error');
    expect(result.stages.some((stage) => stage.status === 'error')).toBe(true);
  });

  it('recommends vite spa for course-like interactive client app', () => {
    const recommendation = recommendDeliveryModes([
      'fast-start',
      'interactive-dashboard',
      'minimal-tooling',
    ]);

    expect(recommendation.winner.id).toBe('vite-spa');
  });

  it('shows React value growing with complexity', () => {
    const result = analyzeReactValue(5, ['shared-state', 'async-states']);

    expect(result.manualSteps).toBeGreaterThan(result.reactUnits);
    expect(result.manualRisk).toBeGreaterThan(50);
  });

  it('warns about missing SPA fallback in docker mode', () => {
    const config: ToolingConfig = {
      nodeVersion: 20,
      hasDevScript: true,
      hasBuildScript: true,
      hasTestScript: true,
      hasReactDep: true,
      hasViteDep: true,
      hasRouterDep: true,
      hasVitestDep: true,
      usesRouter: true,
      envPrefixOk: true,
      importCaseMatches: true,
      dockerSpaFallback: false,
    };

    const result = runToolingCommand(config, 'docker');

    expect(result.status).toBe('warn');
    expect(result.lines.join(' ')).toContain('404');
  });
});
