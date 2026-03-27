import { describe, expect, it } from 'vitest';

import {
  deprecatedApiCatalog,
  summarizeDeprecatedApis,
} from './deprecated-dom-api-model';
import { parseOverviewFocus } from './migration-overview-model';
import { buildMigrationPlan } from './migration-playbook-model';
import { recommendReleaseStrategy } from './codemod-release-model';
import { evaluateTestGuardrails } from './test-guardrail-model';
import { evaluateUpgradeReadiness } from './upgrade-discipline-model';

describe('lesson 63 learning models', () => {
  it('parses overview focus safely', () => {
    expect(parseOverviewFocus('dom')).toBe('dom');
    expect(parseOverviewFocus('unknown')).toBe('all');
  });

  it('summarizes removed api risk in React 19 mode', () => {
    const result = summarizeDeprecatedApis(['render', 'legacy-context'], '19-break');

    expect(result.tone).toBe('error');
    expect(result.removedCount).toBe(1);
    expect(deprecatedApiCatalog).toHaveLength(6);
  });

  it('recommends release strategy and evaluates guardrails', () => {
    expect(recommendReleaseStrategy('latest', ['removed-dom-helpers']).title).toContain(
      'Latest',
    );
    expect(
      evaluateTestGuardrails(['unit'], ['root-bootstrap', 'refs-focus']).missedCount,
    ).toBe(2);
  });

  it('builds migration plan and upgrade readiness', () => {
    expect(
      evaluateUpgradeReadiness(
        ['third-party-is-already-ready', 'supporting-code-is-neutral'],
        'codemod-only',
      ).tone,
    ).toBe('error');

    expect(
      buildMigrationPlan('legacy-heavy', ['removed-dom-apis', 'fragile-tests'], 'staged')
        .phases.length,
    ).toBe(5);
  });
});
