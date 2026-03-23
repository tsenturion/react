import { describe, expect, it } from 'vitest';

import { evaluateConsistencyPlan } from './consistency-model';
import { getFreshnessProfile } from './freshness-profile-model';
import { recommendServerStateArchitecture } from './server-state-architecture-model';
import { serverStateKeys } from '../query/query-keys';

describe('query keys', () => {
  it('separates cache entries by resource and scope', () => {
    expect(serverStateKeys.catalog('catalog', 'published')).not.toEqual(
      serverStateKeys.catalog('mutation-board', 'published'),
    );
    expect(serverStateKeys.catalog('catalog', 'draft')).not.toEqual(
      serverStateKeys.catalog('catalog', 'published'),
    );
  });
});

describe('freshness profile model', () => {
  it('returns retry and stale strategy for balanced profile', () => {
    expect(getFreshnessProfile('balanced')).toMatchObject({
      staleTimeMs: 5_000,
      retryCount: 1,
    });
  });

  it('makes resilient profile less aggressive than aggressive profile', () => {
    expect(getFreshnessProfile('resilient').staleTimeMs).toBeGreaterThan(
      getFreshnessProfile('aggressive').staleTimeMs,
    );
    expect(getFreshnessProfile('resilient').retryCount).toBeGreaterThan(
      getFreshnessProfile('aggressive').retryCount,
    );
  });
});

describe('consistency model', () => {
  it('marks catalog-only invalidation as risky', () => {
    expect(evaluateConsistencyPlan('catalog-only').status).toBe(
      'Risky invalidation scope',
    );
  });

  it('marks catalog-and-summary invalidation as safe', () => {
    expect(evaluateConsistencyPlan('catalog-and-summary').status).toBe(
      'Safe invalidation scope',
    );
  });
});

describe('server-state architecture model', () => {
  it('keeps local fetch for trivial screen', () => {
    expect(
      recommendServerStateArchitecture({
        sharedAcrossWidgets: false,
        crossScreenReuse: false,
        needsRetries: false,
        hasMutations: false,
        needsFreshnessStrategy: false,
      }).approach,
    ).toBe('Local fetch in component');
  });

  it('recommends TanStack Query when shared cache and retries are involved', () => {
    expect(
      recommendServerStateArchitecture({
        sharedAcrossWidgets: true,
        crossScreenReuse: false,
        needsRetries: true,
        hasMutations: true,
        needsFreshnessStrategy: true,
      }).approach,
    ).toBe('TanStack Query layer');
  });
});
