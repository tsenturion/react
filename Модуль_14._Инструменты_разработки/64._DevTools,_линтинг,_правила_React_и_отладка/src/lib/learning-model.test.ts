import { describe, expect, it } from 'vitest';

import { explainRenderReason } from './devtools-inspector-model';
import { buildDebuggingWorkflow } from './debugging-workflow-model';
import { parseOverviewFocus } from './devtools-overview-model';
import { summarizeLintFindings } from './lint-rule-model';
import { buildQualitySystemPlan } from './quality-playbook-model';
import { analyzeRulePressure } from './rules-of-react-model';

describe('lesson 64 learning models', () => {
  it('parses overview focus safely', () => {
    expect(parseOverviewFocus('lint')).toBe('lint');
    expect(parseOverviewFocus('unknown')).toBe('all');
  });

  it('explains render reasons and lint summaries', () => {
    expect(
      explainRenderReason({
        nodeId: 'result-list',
        filter: 'timeout',
        selectedTab: 'warnings',
        theme: 'classic',
      }).title,
    ).toContain('ResultList');

    expect(
      summarizeLintFindings(['exhaustive-deps', 'purity'], 'strict').strictVisible,
    ).toBe(1);
  });

  it('analyzes rules pressure and debugging workflow', () => {
    expect(analyzeRulePressure(['conditional-hook']).hotZone).toBe('hooks-order');
    expect(buildDebuggingWorkflow('stale-effect', ['devtools']).missingTool).toBe('lint');
  });

  it('builds a quality-system plan', () => {
    expect(
      buildQualitySystemPlan({
        shape: 'platform',
        gaps: ['lint-too-weak', 'tests-detached'],
      }).phases,
    ).toHaveLength(3);
  });
});
