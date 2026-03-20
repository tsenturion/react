import { describe, expect, it } from 'vitest';

import { buildControlledFormReport } from './controlled-form-model';
import {
  buildFormModeComparison,
  serializeControlledForm,
  serializeUncontrolledForm,
} from './controlled-vs-uncontrolled-model';
import { createControlledLessonForm, createSignupForm } from './form-domain';
import {
  buildNativeFormPayload,
  buildNativeVsReactReport,
} from './native-react-form-model';
import { buildPitfallReport } from './pitfalls-model';
import { buildSubmitFlowReport, canSubmitControlledForm } from './submit-flow-model';
import { buildValidationReport, validateSignupForm } from './validation-model';

describe('forms lesson models', () => {
  it('describes controlled form completion', () => {
    const report = buildControlledFormReport(createControlledLessonForm());

    expect(report.completion).toBeGreaterThan(0);
    expect(report.previewLabel).toContain('Ирина');
  });

  it('compares controlled and uncontrolled snapshots', () => {
    const comparison = buildFormModeComparison(
      serializeControlledForm(createControlledLessonForm()),
      serializeUncontrolledForm({
        fullName: 'Ирина',
        track: 'forms',
        newsletter: 'on',
      }),
    );

    expect(comparison.tone).toBe('success');
  });

  it('detects submit readiness from current form state', () => {
    const ready = createControlledLessonForm();
    const notReady = { ...ready, bio: 'short' };

    expect(canSubmitControlledForm(ready)).toBe(true);
    expect(canSubmitControlledForm(notReady)).toBe(false);
    expect(buildSubmitFlowReport('idle', false).actionLabel).toContain('не готова');
  });

  it('validates signup form and reports errors', () => {
    const errors = validateSignupForm(createSignupForm());
    const report = buildValidationReport(errors);

    expect(Object.keys(errors).length).toBeGreaterThan(0);
    expect(report.tone).toBe('error');
  });

  it('builds native and react payload comparison', () => {
    const nativePayload = buildNativeFormPayload({
      topic: 'Submit',
      details: 'Long enough details',
      format: 'review',
    });
    const report = buildNativeVsReactReport(nativePayload, {
      topic: 'Submit',
      details: 'Long enough details',
      format: 'review',
    });

    expect(report.tone).toBe('success');
  });

  it('describes form pitfalls', () => {
    expect(buildPitfallReport('checkbox-value').badSnippet).toContain('value');
    expect(buildPitfallReport('dom-reset-vs-state').goodSnippet).toContain('setForm');
  });
});
