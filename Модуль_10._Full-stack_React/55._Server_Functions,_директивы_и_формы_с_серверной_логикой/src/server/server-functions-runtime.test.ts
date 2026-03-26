import { describe, expect, it } from 'vitest';

import {
  assignReviewerOnServer,
  publishLessonOnServer,
  saveDraftOnServer,
  validateLessonMutation,
} from './server-functions-runtime';

describe('server functions runtime', () => {
  it('validates lesson payload', () => {
    expect(
      validateLessonMutation({
        title: 'Hi',
        slug: 'x',
        summary: 'short',
        reviewer: '',
        intent: 'publish',
      }),
    ).toMatchObject({
      title: expect.any(String),
      slug: expect.any(String),
      summary: expect.any(String),
      reviewer: expect.any(String),
    });
  });

  it('saves a draft through server action', async () => {
    const result = await saveDraftOnServer({
      title: 'Server Functions',
      slug: 'server-functions',
      summary: 'Long enough summary for saving draft.',
      reviewer: '',
      intent: 'saveDraft',
    });

    expect(result.ok).toBe(true);
    expect(result.actionId).toBe('save-draft');
    expect(result.persisted?.status).toBe('draft');
  });

  it('blocks publish without reviewer and allows reviewer assignment', async () => {
    const publish = await publishLessonOnServer({
      title: 'Server Functions',
      slug: 'server-functions',
      summary: 'Long enough summary for publication.',
      reviewer: '',
      intent: 'publish',
    });
    const reviewer = await assignReviewerOnServer({
      reviewer: 'Ada',
    });

    expect(publish.ok).toBe(false);
    expect(publish.fieldErrors.reviewer).toBeDefined();
    expect(reviewer.ok).toBe(true);
  });
});
