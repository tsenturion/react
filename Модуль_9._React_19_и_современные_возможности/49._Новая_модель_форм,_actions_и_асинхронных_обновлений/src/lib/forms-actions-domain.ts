export type Audience = 'team' | 'cross-functional' | 'public';
export type SubmissionIntent = 'draft' | 'review' | 'publish';

export type LessonPayload = {
  title: string;
  owner: string;
  cohort: string;
  audience: Audience;
  notes: string;
};

export type SubmissionRecord = {
  id: string;
  intent: SubmissionIntent;
  title: string;
  owner: string;
  cohort: string;
  audience: Audience;
  notesPreview: string;
  message: string;
};

export const audienceOptions: readonly { value: Audience; label: string }[] = [
  { value: 'team', label: 'Внутри команды' },
  { value: 'cross-functional', label: 'Для нескольких команд' },
  { value: 'public', label: 'Для общего каталога' },
] as const;

export function readLessonPayload(formData: FormData): LessonPayload {
  // Форма здесь нарочно почти не использует controlled state:
  // урок показывает новую модель, где payload читается из FormData в момент submit.
  return {
    title: String(formData.get('title') ?? '').trim(),
    owner: String(formData.get('owner') ?? '').trim(),
    cohort: String(formData.get('cohort') ?? '').trim(),
    audience: normalizeAudience(String(formData.get('audience') ?? 'team')),
    notes: String(formData.get('notes') ?? '').trim(),
  };
}

function normalizeAudience(value: string): Audience {
  if (value === 'cross-functional' || value === 'public') {
    return value;
  }

  return 'team';
}

export function delay(delayMs: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, delayMs);
  });
}

export function describeIntentOutcome(intent: SubmissionIntent, payload: LessonPayload) {
  if (intent === 'draft') {
    return {
      badge: 'Draft saved',
      message: `Черновик "${payload.title}" сохранён без публикации и может вернуться в редактирование.`,
      delayMs: 280,
    };
  }

  if (intent === 'review') {
    return {
      badge: 'Review requested',
      message: `Материал "${payload.title}" отправлен на ревью для потока "${payload.cohort}".`,
      delayMs: 420,
    };
  }

  return {
    badge: 'Published',
    message: `Материал "${payload.title}" опубликован для аудитории "${formatAudience(payload.audience)}".`,
    delayMs: 520,
  };
}

export function buildSubmissionRecord(
  intent: SubmissionIntent,
  payload: LessonPayload,
): SubmissionRecord {
  const outcome = describeIntentOutcome(intent, payload);

  return {
    id: `${intent}-${payload.title}-${payload.owner}-${payload.cohort}`.toLowerCase(),
    intent,
    title: payload.title,
    owner: payload.owner,
    cohort: payload.cohort,
    audience: payload.audience,
    notesPreview: payload.notes.slice(0, 80) || 'без заметок',
    message: outcome.message,
  };
}

export function formatAudience(audience: Audience) {
  return (
    audienceOptions.find((item) => item.value === audience)?.label ?? 'Внутри команды'
  );
}
