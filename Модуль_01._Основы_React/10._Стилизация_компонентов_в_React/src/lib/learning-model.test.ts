import { describe, expect, it } from 'vitest';

import { buildClassNameViewModel, defaultClassNameControls } from './class-name-model';
import { buildConditionalStyleReport } from './conditional-style-model';
import { buildCssModulesReport } from './css-modules-model';
import { buildInlineStyleReport, defaultInlineControls } from './inline-style-model';
import {
  buildArchitectureReport,
  defaultArchitectureControls,
} from './styling-architecture-model';
import { buildThemeReport, defaultThemeControls } from './theme-model';

describe('component styling lesson models', () => {
  it('counts active className modifiers', () => {
    const report = buildClassNameViewModel({
      ...defaultClassNameControls,
      outlined: true,
      emphasis: 'strong',
    });

    expect(report.modifierCount).toBe(4);
  });

  it('marks css modules as safe under noisy global styles', () => {
    const report = buildCssModulesReport({
      tone: 'amber',
      compact: true,
      withRibbon: true,
      loudGlobalTitle: true,
    });

    expect(report.tone).toBe('success');
    expect(report.collisionRisk).toContain('не изменился');
  });

  it('describes inline styles as runtime-driven', () => {
    const report = buildInlineStyleReport({
      ...defaultInlineControls,
      hue: 210,
    });

    expect(report.stylePropertyCount).toBeGreaterThan(3);
    expect(report.accentLabel).toContain('холодный');
  });

  it('warns about conflicting disabled and busy states', () => {
    const report = buildConditionalStyleReport({
      tone: 'neutral',
      selected: false,
      disabled: true,
      busy: true,
      compact: false,
    });

    expect(report.tone).toBe('error');
  });

  it('exposes theme tokens for the selected theme', () => {
    const report = buildThemeReport({
      ...defaultThemeControls,
      theme: 'graphite',
    });

    expect(report.tokenCount).toBe(4);
    expect(report.snippet).toContain('data-theme');
  });

  it('recommends a hybrid architecture for reusable themed components', () => {
    const report = buildArchitectureReport(defaultArchitectureControls);

    expect(report.recommended.id).toBe('hybrid');
    expect(report.approaches[0].score).toBeGreaterThan(report.approaches[1].score);
  });
});
