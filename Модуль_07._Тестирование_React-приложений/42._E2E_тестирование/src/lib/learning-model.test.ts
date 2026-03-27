import { describe, expect, it } from 'vitest';

import { lessonLabs } from './learning-model';
import {
  describeLabFromPath,
  filterGuidesByFocus,
  sanitizeIntentPath,
} from './e2e-domain';
import {
  evaluateBoundaryDecision,
  evaluateRoutePlanning,
  parseFocus,
  summarizeDataJourney,
} from './e2e-runtime';

describe('lesson model', () => {
  it('keeps auth lab pointing to concrete route', () => {
    const authLab = lessonLabs.find((item) => item.id === 'auth');

    expect(authLab?.href).toBe('/auth-journeys');
  });
});

describe('e2e domain', () => {
  it('resolves hidden auth and review routes back to lesson labs', () => {
    expect(describeLabFromPath('/auth/login')).toBe('auth');
    expect(describeLabFromPath('/workspace/release')).toBe('auth');
    expect(describeLabFromPath('/submission-review')).toBe('forms');
  });

  it('filters guides by focus', () => {
    expect(filterGuidesByFocus('auth').every((item) => item.focus === 'auth')).toBe(true);
    expect(filterGuidesByFocus('all').length).toBeGreaterThan(4);
  });

  it('sanitizes broken intent path values', () => {
    expect(sanitizeIntentPath('//evil.example')).toBe('/workspace/release');
    expect(sanitizeIntentPath('/workspace/release')).toBe('/workspace/release');
  });
});

describe('e2e runtime', () => {
  it('normalizes invalid focus values', () => {
    expect(parseFocus('broken')).toBe('all');
    expect(parseFocus('routes')).toBe('routes');
  });

  it('recommends route e2e for multi-screen url-driven flow', () => {
    expect(
      evaluateRoutePlanning({
        spansMultipleScreens: true,
        dependsOnUrl: true,
        needsRedirects: true,
        assertsImplementationDetails: false,
      }).model,
    ).toBe('E2E route journey оправдан');
  });

  it('downgrades brittle async smoke with fixed waits', () => {
    expect(
      summarizeDataJourney({
        coversLoading: true,
        coversRetry: false,
        coversError: true,
        usesFixedWait: true,
      }).verdict,
    ).toContain('хрупкий async smoke');
  });

  it('recommends e2e as system seam protection', () => {
    expect(
      evaluateBoundaryDecision({
        crossesRouting: true,
        crossesAuth: true,
        crossesData: true,
        alreadyCoveredLower: false,
      }).verdict,
    ).toBe('E2E нужен как системная страховка');
  });
});
