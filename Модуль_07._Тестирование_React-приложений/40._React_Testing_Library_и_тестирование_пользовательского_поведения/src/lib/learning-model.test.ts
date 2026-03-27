import { describe, expect, it } from 'vitest';

import { lessonLabs } from './learning-model';
import { describeLabFromPath, filterGuidesByFocus } from './rtl-domain';
import {
  evaluateFormCoverage,
  evaluateTestingSmell,
  parseFocus,
  recommendCustomRender,
  recommendInteractionAssertion,
  recommendPrimaryQuery,
} from './rtl-runtime';

describe('lesson model', () => {
  it('keeps forms lab pointing to a concrete route', () => {
    const formsLab = lessonLabs.find((item) => item.id === 'forms');

    expect(formsLab?.href).toBe('/forms-and-errors');
  });
});

describe('rtl domain', () => {
  it('resolves lab id from pathname', () => {
    expect(describeLabFromPath('/query-priority')).toBe('queries');
    expect(describeLabFromPath('/custom-render')).toBe('custom-render');
    expect(describeLabFromPath('/unknown')).toBeNull();
  });

  it('filters guide cards by focus', () => {
    expect(filterGuidesByFocus('forms').every((item) => item.focus === 'forms')).toBe(
      true,
    );
    expect(filterGuidesByFocus('all').length).toBeGreaterThan(4);
  });
});

describe('rtl runtime', () => {
  it('normalizes invalid focus values', () => {
    expect(parseFocus('broken')).toBe('all');
    expect(parseFocus('providers')).toBe('providers');
  });

  it('recommends an alert role query for delayed form errors', () => {
    expect(recommendPrimaryQuery('error-alert').method).toBe("findByRole('alert')");
  });

  it('suggests async role assertions for multi-step async interactions', () => {
    expect(
      recommendInteractionAssertion({
        multiStep: true,
        asyncUi: true,
        changesFocus: false,
        textEntry: true,
      }).model,
    ).toBe('userEvent + async role assertion');
  });

  it('shows missing form states when behavior coverage is incomplete', () => {
    const result = evaluateFormCoverage({
      validatesBeforeSubmit: true,
      showsFieldErrors: false,
      showsSuccessState: true,
      keepsAccessibleRoles: false,
      resetsOnlyOnSuccess: true,
    });

    expect(result.verdict).toBe('gaps-visible');
    expect(result.missingStates).toEqual([
      'field errors',
      'доступные роли ошибок и статусов',
    ]);
  });

  it('recommends a focused custom render helper for repeated provider setup', () => {
    expect(
      recommendCustomRender({
        needsRouter: true,
        needsProvider: true,
        repeatedSetup: true,
        mixesUserPaths: false,
      }).model,
    ).toBe('Use a focused custom render helper');
  });

  it('flags implementation-centric smell when tests read state and query by class', () => {
    expect(
      evaluateTestingSmell({
        readsInternalState: true,
        mocksSetState: true,
        queriesByClassName: true,
        assertsVisibleResult: false,
        hidesProviderNoise: false,
      }).verdict,
    ).toBe('implementation-centric');
  });
});
