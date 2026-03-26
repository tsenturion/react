import { describe, expect, it, vi } from 'vitest';

import { buildExternalDataRecommendation } from './external-data-playbook-model';
import { describeLabFromPath } from './learning-model';
import { submitValidatedMutation } from './mutation-validation-model';
import { runValidatedRequest } from './request-validation-model';
import { evaluateRouteBoundary } from './route-contract-model';
import { validateReviewItem } from './zod-schema-boundary-model';

describe('lesson 60 models', () => {
  it('maps path to routes lab', () => {
    expect(describeLabFromPath('/route-contracts')).toBe('routes');
  });

  it('rejects malformed external payload with enum mismatch', () => {
    const parsed = validateReviewItem({
      id: 'rvw-204',
      title: 'Release checklist cleanup',
      owner: 'Mila',
      stage: 'shipping',
      score: 7,
      updatedAt: '2026-03-26T09:30:00.000Z',
      tags: ['api', 'types'],
    });

    expect(parsed.success).toBe(false);
  });

  it('returns empty request state for valid but empty envelope', async () => {
    vi.useFakeTimers();
    const promise = runValidatedRequest('ok', 'empty');
    await vi.runAllTimersAsync();

    await expect(promise).resolves.toMatchObject({ status: 'empty' });
    vi.useRealTimers();
  });

  it('returns validation error when form payload is malformed', async () => {
    const result = await submitValidatedMutation(
      {
        title: 'No',
        owner: 'N',
        stage: 'review',
        score: '11',
      },
      'valid-response',
    );

    expect(result.status).toBe('validation-error');
  });

  it('blocks invalid route payload on loader boundary', () => {
    const outcome = evaluateRouteBoundary('loader-parse', 'bad-featured');

    expect(outcome).toMatchObject({ status: 'blocked', location: 'loader' });
  });

  it('recommends loader parsing for route-level boundaries', () => {
    const recommendation = buildExternalDataRecommendation({
      source: 'route-loader',
      failureMode: 'silent-shape-drift',
      team: 'confident',
    });

    expect(recommendation.tone).toBe('error');
    expect(recommendation.title).toMatch(/loader boundary/i);
  });
});
