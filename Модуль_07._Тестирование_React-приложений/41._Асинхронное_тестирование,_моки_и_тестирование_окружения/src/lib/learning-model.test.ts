import { describe, expect, it } from 'vitest';

import { describeLabFromPath, filterGuidesByFocus } from './async-testing-domain';
import {
  evaluateEnvironmentSetup,
  evaluateTestingSmell,
  evaluateWaitingStrategy,
  parseFocus,
  recommendMockingStrategy,
  summarizeProviderHarness,
} from './async-testing-runtime';
import { lessonLabs } from './learning-model';

describe('lesson model', () => {
  it('keeps mocked HTTP lab pointing to a concrete route', () => {
    const httpLab = lessonLabs.find((item) => item.id === 'http-mocks');

    expect(httpLab?.href).toBe('/mocked-http');
  });
});

describe('async domain', () => {
  it('resolves lesson lab id from pathname', () => {
    expect(describeLabFromPath('/loading-and-waiting')).toBe('waiting');
    expect(describeLabFromPath('/providers-and-context')).toBe('providers');
    expect(describeLabFromPath('/unknown')).toBe('overview');
  });

  it('filters guide cards by focus', () => {
    expect(
      filterGuidesByFocus('providers').every((item) => item.focus === 'providers'),
    ).toBe(true);
    expect(filterGuidesByFocus('all').length).toBeGreaterThan(4);
  });
});

describe('async runtime', () => {
  it('normalizes invalid focus values', () => {
    expect(parseFocus('broken')).toBe('all');
    expect(parseFocus('providers')).toBe('providers');
  });

  it('flags a waiting strategy with fixed delay and missing states as fragile', () => {
    const result = evaluateWaitingStrategy({
      coversLoading: false,
      coversError: false,
      coversEmpty: true,
      waitsForVisibleResult: false,
      usesFixedDelay: true,
    });

    expect(result.verdict).toBe('Стратегия хрупкая');
    expect(result.risks).toContain(
      'Фиксированная пауза делает тест медленным и увеличивает риск flaky-падений.',
    );
  });

  it('recommends mocking fetch at the HTTP boundary for component-level scenarios', () => {
    expect(
      recommendMockingStrategy({
        scope: 'component',
        needsRetry: true,
        exercisesProviders: false,
        rerendersWithNewInput: true,
      }).primary,
    ).toContain('Мокайте fetch на границе HTTP');
  });

  it('shows when a focused provider helper is justified', () => {
    expect(
      summarizeProviderHarness({
        needsRouter: true,
        needsContext: true,
        needsSearchParams: true,
        hidesUserIntent: false,
      }).verdict,
    ).toBe('Нужен focused custom render helper');
  });

  it('rates environment setup as stable only when resets are complete', () => {
    expect(
      evaluateEnvironmentSetup({
        resetsMocks: true,
        resetsTimers: true,
        restoresGlobals: true,
        includesJestDom: true,
      }).verdict,
    ).toBe('Окружение собрано устойчиво');
  });

  it('flags async smell when tests use sleep and leak environment', () => {
    expect(
      evaluateTestingSmell({
        usesSleep: true,
        assertsImplementation: true,
        leaksEnvironment: true,
        overMocks: false,
      }).severity,
    ).toBe('Высокая хрупкость');
  });
});
