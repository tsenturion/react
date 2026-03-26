export type ReviewDraft = {
  readonly title: string;
  readonly score: number;
  readonly urgent: boolean;
};

export type SubmitState =
  | { readonly status: 'idle' }
  | { readonly status: 'editing'; readonly dirtyFields: readonly string[] }
  | { readonly status: 'submitting'; readonly queuePosition: number }
  | { readonly status: 'success'; readonly receipt: string }
  | {
      readonly status: 'error';
      readonly field: 'title' | 'score';
      readonly message: string;
    };

export function parseScoreInput(value: string): number | null {
  if (value.trim() === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function validateReviewDraft(draft: ReviewDraft): SubmitState {
  if (draft.title.trim().length < 4) {
    return {
      status: 'error',
      field: 'title',
      message: 'Название слишком короткое для содержательной карточки.',
    };
  }

  if (draft.score < 1 || draft.score > 10) {
    return {
      status: 'error',
      field: 'score',
      message: 'Оценка должна быть в диапазоне от 1 до 10.',
    };
  }

  return {
    status: 'success',
    receipt: draft.urgent ? 'priority-queue' : 'standard-queue',
  };
}

export function buildEditingState(
  draft: ReviewDraft,
  previous: ReviewDraft,
): SubmitState {
  const dirtyFields = [
    draft.title !== previous.title ? 'title' : null,
    draft.score !== previous.score ? 'score' : null,
    draft.urgent !== previous.urgent ? 'urgent' : null,
  ].filter((item): item is string => item !== null);

  return dirtyFields.length === 0
    ? { status: 'idle' }
    : { status: 'editing', dirtyFields };
}
