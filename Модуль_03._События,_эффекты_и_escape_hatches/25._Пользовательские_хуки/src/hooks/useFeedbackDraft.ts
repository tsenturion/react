import { useState } from 'react';

import {
  buildFeedbackPreview,
  defaultFeedbackDraft,
  type FeedbackDraft,
  validateFeedbackDraft,
} from '../lib/feedback-model';

export function useFeedbackDraft() {
  const [draft, setDraft] = useState<FeedbackDraft>(defaultFeedbackDraft);

  const errors = validateFeedbackDraft(draft);
  const preview = buildFeedbackPreview(draft);
  const isReady = Object.values(errors).every((value) => value === null);

  return {
    draft,
    errors,
    preview,
    isReady,
    updateField: <Key extends keyof FeedbackDraft>(
      field: Key,
      value: FeedbackDraft[Key],
    ) => setDraft((current) => ({ ...current, [field]: value })),
    toggleIncludeCode: () =>
      setDraft((current) => ({ ...current, includeCode: !current.includeCode })),
    reset: () => setDraft(defaultFeedbackDraft),
  };
}
