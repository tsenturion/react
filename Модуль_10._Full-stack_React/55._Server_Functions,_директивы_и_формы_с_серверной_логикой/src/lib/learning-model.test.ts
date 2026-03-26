import { describe, expect, it } from 'vitest';

import {
  analyzeBoundaryWorkspace,
  getBoundaryPreset,
} from './server-function-boundary-model';
import { evaluateServerFunctionScenario } from './server-function-constraints-model';
import {
  initialFormState,
  parseLessonMutationFormData,
  submitLessonMutation,
} from './server-function-form-model';
import { compareInvocationStrategies } from './server-function-flow-model';
import { chooseServerFunctionStrategy } from './server-function-playbook-model';
import {
  filterOverviewCardsByFocus,
  parseOverviewFocus,
} from './server-functions-overview-domain';
import { describeLabFromPath, lessonLabs } from './learning-model';

describe('lesson route model', () => {
  it('keeps all lesson 55 labs in route map', () => {
    expect(lessonLabs.map((item) => item.id)).toEqual([
      'overview',
      'directives',
      'invocation',
      'forms',
      'constraints',
      'playbook',
    ]);
  });

  it('maps pathname to matching lab id', () => {
    expect(describeLabFromPath('/forms-with-server-logic')).toBe('forms');
    expect(describeLabFromPath('/server-function-constraints')).toBe('constraints');
    expect(describeLabFromPath('/unknown')).toBe('overview');
  });
});

describe('overview model', () => {
  it('parses URL focus safely', () => {
    expect(parseOverviewFocus('forms')).toBe('forms');
    expect(parseOverviewFocus('x')).toBe('all');
  });

  it('filters cards by focus', () => {
    expect(filterOverviewCardsByFocus('limits')).toHaveLength(1);
    expect(filterOverviewCardsByFocus('all').length).toBeGreaterThan(4);
  });
});

describe('directive boundary model', () => {
  it('analyzes hybrid preset and reports a narrow but valid boundary', () => {
    const report = analyzeBoundaryWorkspace(getBoundaryPreset('hybrid-forms'));

    expect(report.invalidCount).toBe(0);
    expect(report.clientBundleKb).toBe(62);
    expect(report.serverActionBridgeCount).toBe(2);
  });
});

describe('invocation model', () => {
  it('prefers server function over manual API on glue cost', () => {
    const reports = compareInvocationStrategies({
      networkMs: 100,
      validationComplexity: 3,
    });

    expect(reports).toHaveLength(3);
    expect(reports[1].id).toBe('server-function');
    expect(reports[1].handwrittenGlue).toBeLessThan(reports[0].handwrittenGlue);
    expect(reports[1].roundTripMs).toBeLessThan(reports[0].roundTripMs);
  });
});

describe('form model', () => {
  it('parses FormData into lesson mutation input', () => {
    const formData = new FormData();
    formData.set('title', 'Server Functions in React');
    formData.set('slug', 'server-functions-react');
    formData.set('summary', 'Форма пересекает серверную границу через submit.');
    formData.set('reviewer', 'Ada');
    formData.set('intent', 'publish');

    expect(parseLessonMutationFormData(formData)).toEqual({
      title: 'Server Functions in React',
      slug: 'server-functions-react',
      summary: 'Форма пересекает серверную границу через submit.',
      reviewer: 'Ada',
      intent: 'publish',
    });
  });

  it('returns success UI state after draft submit', async () => {
    const formData = new FormData();
    formData.set('title', 'Server Functions in React');
    formData.set('slug', 'server-functions-react');
    formData.set(
      'summary',
      'Форма пересекает серверную границу через submit и получает результат обратно.',
    );
    formData.set('reviewer', 'Ada');
    formData.set('intent', 'saveDraft');

    const nextState = await submitLessonMutation(initialFormState, formData);

    expect(nextState.status).toBe('success');
    expect(nextState.headline).toBe('Черновик сохранён');
    expect(nextState.persistedStatus).toBe('draft');
  });
});

describe('constraints model', () => {
  it('rejects browser API scenario for server function', () => {
    expect(
      evaluateServerFunctionScenario({
        callMoment: 'click',
        needsWindowApi: true,
        argsSerializable: true,
        needsSecretRead: false,
        expectsInstantTyping: false,
      }).tone,
    ).toBe('error');
  });
});

describe('playbook model', () => {
  it('recommends server form action for submit-driven protected write', () => {
    expect(
      chooseServerFunctionStrategy({
        submitDriven: true,
        needsBrowserApi: false,
        needsProtectedWrite: true,
        wantsMinimalGlue: true,
        expectsInstantTyping: false,
        payloadSerializable: true,
      }).primaryPattern,
    ).toBe('server-form-action');
  });

  it('recommends client island for browser-driven protected write', () => {
    expect(
      chooseServerFunctionStrategy({
        submitDriven: false,
        needsBrowserApi: true,
        needsProtectedWrite: true,
        wantsMinimalGlue: true,
        expectsInstantTyping: true,
        payloadSerializable: true,
      }).primaryPattern,
    ).toBe('client-island-calls-server-function');
  });
});
