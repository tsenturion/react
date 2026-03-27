import { describe, expect, it } from 'vitest';

import { describeLabFromPath } from './accessibility-domain';
import {
  buildAuditChecklist,
  parseOverviewFocus,
  summarizeArchitectureScenario,
  summarizeKeyboardScenario,
  summarizeLabelScenario,
  summarizeSemanticsScenario,
  summarizeTestingScenario,
} from './accessibility-runtime';
import { lessonLabs } from './learning-model';

describe('lesson model', () => {
  it('keeps labels lab pointing to a concrete route', () => {
    const labelsLab = lessonLabs.find((item) => item.id === 'labels');

    expect(labelsLab?.href).toBe('/labels-and-names');
  });
});

describe('accessibility domain', () => {
  it('resolves lesson lab id from pathname', () => {
    expect(describeLabFromPath('/keyboard-and-focus')).toBe('keyboard');
    expect(describeLabFromPath('/testing-and-audits')).toBe('testing');
    expect(describeLabFromPath('/unknown')).toBe('overview');
  });
});

describe('accessibility runtime', () => {
  it('normalizes invalid overview focus values', () => {
    expect(parseOverviewFocus('broken')).toBe('all');
    expect(parseOverviewFocus('testing')).toBe('testing');
  });

  it('penalizes placeholder-only naming', () => {
    expect(
      summarizeLabelScenario({
        namingMode: 'placeholder-only',
        linksHint: false,
        linksError: false,
      }).score,
    ).toBeLessThan(55);
  });

  it('shows risk when keyboard support relies on click-only hotspots', () => {
    const result = summarizeKeyboardScenario({
      usesSemanticControls: false,
      restoresFocus: false,
      supportsEscape: false,
      clickOnlyHotspots: true,
    });

    expect(result.score).toBeLessThan(50);
    expect(result.tabPreview).toHaveLength(3);
  });

  it('rates wrong role lower than native semantics', () => {
    const nativeResult = summarizeSemanticsScenario({
      usesLandmarks: true,
      usesNativeControls: true,
      headingsAreOrdered: true,
      ariaStrategy: 'native',
    });
    const brokenResult = summarizeSemanticsScenario({
      usesLandmarks: true,
      usesNativeControls: false,
      headingsAreOrdered: true,
      ariaStrategy: 'wrong-role',
    });

    expect(brokenResult.score).toBeLessThan(nativeResult.score);
  });

  it('rewards user-centric testing strategy', () => {
    const result = summarizeTestingScenario({
      queriesByRole: true,
      checksKeyboard: true,
      checksAnnouncements: true,
      usesTestIds: false,
      assertsClasses: false,
    });

    expect(result.score).toBeGreaterThan(75);
    expect(result.verdict).toContain('пользователя');
  });

  it('raises a priority when the screen contains a custom widget', () => {
    const result = summarizeArchitectureScenario({
      hasForms: false,
      hasNavigation: true,
      hasDialog: false,
      hasCustomWidget: true,
      hasAsyncStatus: false,
      testsByBehavior: true,
    });

    expect(result.priorities[3]).toContain('Кастомный widget');
  });

  it('flags missing label and wrong control in the audit checklist', () => {
    const report = buildAuditChecklist({
      hasVisibleLabel: false,
      linksError: true,
      usesButtonElement: false,
      hasLandmarks: true,
    });

    expect(report.find((item) => item.title === 'Контролу доступно имя')?.passed).toBe(
      false,
    );
    expect(
      report.find((item) => item.title === 'Действие выражено через button')?.passed,
    ).toBe(false);
  });
});
