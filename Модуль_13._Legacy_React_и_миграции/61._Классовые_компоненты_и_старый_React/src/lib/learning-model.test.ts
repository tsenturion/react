import { describe, expect, it } from 'vitest';

import {
  classStateTakeaways,
  describeCommitCallback,
  normalizeLegacyTag,
  previewDoubleIncrement,
} from './class-state-model';
import { describeLifecycleMethod } from './lifecycle-model';
import { parseOverviewFocus } from './legacy-overview-model';
import { recommendLegacyAction } from './legacy-playbook-model';
import { explainPureScenario } from './pure-component-model';

describe('lesson 61 learning models', () => {
  it('parses overview focus safely', () => {
    expect(parseOverviewFocus('refs')).toBe('refs');
    expect(parseOverviewFocus('unknown')).toBe('all');
  });

  it('models object-form versus updater-form queue', () => {
    expect(previewDoubleIncrement(4)).toEqual({
      objectFormResult: 5,
      updaterFormResult: 6,
      explanation: expect.any(Array),
    });
    expect(classStateTakeaways).toHaveLength(4);
  });

  it('normalizes legacy tags and describes callback timing', () => {
    expect(normalizeLegacyTag('  legacy   form  ')).toBe('legacy form');
    expect(describeCommitCallback('legacy form', 3)).toContain('после commit');
  });

  it('describes lifecycle and pure component scenarios', () => {
    expect(describeLifecycleMethod('componentDidMount')?.phase).toBe('mount');
    expect(explainPureScenario('mutated-object').tone).toBe('error');
  });

  it('returns migration advice for class-based boundaries', () => {
    const recommendation = recommendLegacyAction('error-boundary');

    expect(recommendation.tone).toBe('success');
    expect(recommendation.title).toContain('boundary');
    expect(recommendation.steps[0]).toContain('boundary');
  });
});
