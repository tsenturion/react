import { describe, expect, it } from 'vitest';

import { recommendFetchArchitecture } from './fetch-architecture-model';
import { getRaceDelay } from './race-model';
import { requestStatusOrder, statusSummary } from './request-lifecycle-model';
import { buildRetryPlan } from './retry-model';

describe('request lifecycle model', () => {
  it('keeps explicit lifecycle order and human summary', () => {
    expect(requestStatusOrder).toEqual([
      'idle',
      'loading',
      'success',
      'empty',
      'error',
      'aborted',
    ]);
    expect(statusSummary('aborted')).toContain('отменён');
  });
});

describe('retry model', () => {
  it('builds linear retry plan from max retries and base delay', () => {
    expect(buildRetryPlan(3, 350)).toEqual([350, 700, 1050]);
  });
});

describe('race model', () => {
  it('makes short query slower than long query to expose stale responses', () => {
    expect(getRaceDelay('re')).toBeGreaterThan(getRaceDelay('react'));
  });
});

describe('fetch architecture model', () => {
  it('recommends dedicated hook for auto queries with retry and abort', () => {
    expect(
      recommendFetchArchitecture({
        autoOnDependencyChange: true,
        needsRetry: true,
        needsAbort: true,
        sharedAcrossWidgets: false,
        crossScreenCaching: false,
      }).approach,
    ).toBe('Dedicated request hook');
  });

  it('recommends server-state layer when requests are shared and cached across screens', () => {
    expect(
      recommendFetchArchitecture({
        autoOnDependencyChange: true,
        needsRetry: true,
        needsAbort: true,
        sharedAcrossWidgets: true,
        crossScreenCaching: true,
      }).approach,
    ).toBe('Server-state layer');
  });

  it('keeps simple manual fetch inline when complexity is low', () => {
    expect(
      recommendFetchArchitecture({
        autoOnDependencyChange: false,
        needsRetry: false,
        needsAbort: false,
        sharedAcrossWidgets: false,
        crossScreenCaching: false,
      }).approach,
    ).toBe('Inline fetch handler');
  });
});
