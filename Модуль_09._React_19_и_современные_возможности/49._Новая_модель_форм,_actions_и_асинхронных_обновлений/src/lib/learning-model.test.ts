import { describe, expect, it } from 'vitest';

import {
  filterOverviewCardsByFocus,
  parseOverviewFocus,
} from './actions-overview-domain';
import {
  buildErrorActionState,
  buildSuccessActionState,
  initialFormActionState,
  validateLessonPayload,
} from './action-state-model';
import {
  buildSubmissionRecord,
  describeIntentOutcome,
  readLessonPayload,
} from './forms-actions-domain';
import { describeLabFromPath, lessonLabs } from './learning-model';
import { chooseFormPattern } from './workflow-playbook-model';

describe('lesson 49 models', () => {
  it('maps known routes to lab identifiers', () => {
    expect(describeLabFromPath('/form-action-basics')).toBe('form-action');
    expect(describeLabFromPath('/workflow-playbook')).toBe('workflow-playbook');
    expect(describeLabFromPath('/missing')).toBe('overview');
    expect(lessonLabs).toHaveLength(6);
  });

  it('parses overview focus safely', () => {
    expect(parseOverviewFocus('state')).toBe('state');
    expect(parseOverviewFocus('broken')).toBe('all');
    expect(filterOverviewCardsByFocus('workflow').length).toBeGreaterThan(0);
  });

  it('reads payload from form data', () => {
    const formData = new FormData();
    formData.set('title', ' React 19 ');
    formData.set('owner', ' Docs ');
    formData.set('cohort', ' Forms ');
    formData.set('audience', 'public');
    formData.set('notes', 'Action model payload');

    expect(readLessonPayload(formData)).toEqual({
      title: 'React 19',
      owner: 'Docs',
      cohort: 'Forms',
      audience: 'public',
      notes: 'Action model payload',
    });
  });

  it('validates payload for useActionState', () => {
    const issues = validateLessonPayload({
      title: 'abc',
      owner: 'D',
      cohort: '1',
      audience: 'team',
      notes: 'short',
    });

    expect(issues).toHaveLength(4);
  });

  it('builds action state transitions', () => {
    const errorState = buildErrorActionState(initialFormActionState, ['bad']);
    expect(errorState.status).toBe('error');
    expect(errorState.attempts).toBe(1);

    const successState = buildSuccessActionState(initialFormActionState, {
      title: 'Forms',
      owner: 'Docs',
      cohort: 'React 19',
      audience: 'team',
      notes: 'Enough details for returned state.',
    });
    expect(successState.status).toBe('success');
    expect(successState.receipt?.intent).toBe('review');
  });

  it('describes intent outcomes and records', () => {
    const outcome = describeIntentOutcome('publish', {
      title: 'Forms',
      owner: 'Docs',
      cohort: 'React 19',
      audience: 'public',
      notes: 'Detailed notes',
    });
    expect(outcome.badge).toBe('Published');

    const record = buildSubmissionRecord('draft', {
      title: 'Forms',
      owner: 'Docs',
      cohort: 'React 19',
      audience: 'team',
      notes: 'Detailed notes',
    });
    expect(record.intent).toBe('draft');
    expect(record.message).toContain('сохранён');
  });

  it('chooses workflow pattern from scenario', () => {
    expect(
      chooseFormPattern({
        isRealForm: true,
        needsFieldErrors: false,
        needsPendingUi: false,
        hasMultipleSubmitOutcomes: true,
        submitIsFireAndForget: false,
        needsReturnedState: false,
      }).primaryPattern,
    ).toBe('formAction-buttons');

    expect(
      chooseFormPattern({
        isRealForm: true,
        needsFieldErrors: true,
        needsPendingUi: true,
        hasMultipleSubmitOutcomes: false,
        submitIsFireAndForget: false,
        needsReturnedState: true,
      }).primaryPattern,
    ).toBe('useActionState');
  });
});
