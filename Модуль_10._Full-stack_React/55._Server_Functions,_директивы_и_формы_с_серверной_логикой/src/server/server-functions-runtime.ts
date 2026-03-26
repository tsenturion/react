export type ServerActionId = 'save-draft' | 'publish-lesson' | 'assign-reviewer';
export type SubmitIntent = 'saveDraft' | 'publish';

export type LessonMutationInput = {
  title: string;
  slug: string;
  summary: string;
  reviewer: string;
  intent: SubmitIntent;
};

export type LessonField = 'title' | 'slug' | 'summary' | 'reviewer';
export type FieldErrors = Partial<Record<LessonField, string>>;

export type PersistedLesson = {
  slug: string;
  reviewer: string;
  status: 'draft' | 'published';
  revision: number;
};

export type ServerActionResult = {
  ok: boolean;
  actionId: ServerActionId;
  headline: string;
  message: string;
  fieldErrors: FieldErrors;
  auditTrail: string[];
  persisted: PersistedLesson | null;
};

export const serverActionCatalog = [
  {
    id: 'save-draft',
    label: 'Save draft',
    directive: 'use server',
    useCase: 'Черновое сохранение формы без отдельного ручного API-слоя.',
  },
  {
    id: 'publish-lesson',
    label: 'Publish lesson',
    directive: 'use server',
    useCase: 'Публикация и серверная валидация прав/данных в одном full-stack потоке.',
  },
  {
    id: 'assign-reviewer',
    label: 'Assign reviewer',
    directive: 'use server',
    useCase:
      'Короткая серверная мутация из client island без переноса бизнес-правил в браузер.',
  },
] as const;

function wait(delayMs: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

export function validateLessonMutation(input: LessonMutationInput): FieldErrors {
  const errors: FieldErrors = {};

  if (input.title.trim().length < 4) {
    errors.title = 'Заголовок должен быть не короче 4 символов.';
  }

  if (!/^[a-z0-9-]{3,}$/.test(input.slug.trim())) {
    errors.slug = 'Slug должен состоять из латиницы, цифр и дефисов.';
  }

  if (input.summary.trim().length < 12) {
    errors.summary = 'Краткое описание должно быть не короче 12 символов.';
  }

  if (input.intent === 'publish' && input.reviewer.trim().length < 2) {
    errors.reviewer = 'Для публикации нужно указать reviewer.';
  }

  return errors;
}

function computeRevision(input: LessonMutationInput) {
  return Math.max(
    1,
    Math.ceil((input.title.trim().length + input.summary.trim().length) / 12),
  );
}

export async function saveDraftOnServer(
  input: LessonMutationInput,
): Promise<ServerActionResult> {
  'use server';

  await wait(140);
  const fieldErrors = validateLessonMutation(input);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      actionId: 'save-draft',
      headline: 'Черновик не сохранён',
      message: 'Серверная валидация вернула ошибки и не выполнила мутацию.',
      fieldErrors,
      auditTrail: [
        'form -> server boundary',
        'validate draft payload',
        'reject mutation with field errors',
      ],
      persisted: null,
    };
  }

  return {
    ok: true,
    actionId: 'save-draft',
    headline: 'Черновик сохранён',
    message:
      'Серверная функция приняла сериализуемый payload и сохранила черновик без промежуточного route handler.',
    fieldErrors: {},
    auditTrail: [
      'form -> server boundary',
      'validate draft payload',
      'persist draft revision',
    ],
    persisted: {
      slug: input.slug.trim(),
      reviewer: input.reviewer.trim() || 'unassigned',
      status: 'draft',
      revision: computeRevision(input),
    },
  };
}

export async function publishLessonOnServer(
  input: LessonMutationInput,
): Promise<ServerActionResult> {
  'use server';

  await wait(220);
  const fieldErrors = validateLessonMutation(input);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      actionId: 'publish-lesson',
      headline: 'Публикация остановлена',
      message:
        'Сервер не пропустил публикацию, потому что форма не прошла полную валидацию.',
      fieldErrors,
      auditTrail: [
        'form -> server boundary',
        'validate publish payload',
        'stop publish mutation',
      ],
      persisted: null,
    };
  }

  return {
    ok: true,
    actionId: 'publish-lesson',
    headline: 'Урок опубликован',
    message:
      'Публикация прошла через server function: данные, правила и итоговый статус были собраны на сервере в одном full-stack потоке.',
    fieldErrors: {},
    auditTrail: [
      'form -> server boundary',
      'validate publish payload',
      'check reviewer and publication rules',
      'persist published revision',
    ],
    persisted: {
      slug: input.slug.trim(),
      reviewer: input.reviewer.trim(),
      status: 'published',
      revision: computeRevision(input) + 1,
    },
  };
}

export async function assignReviewerOnServer(input: {
  reviewer: string;
}): Promise<ServerActionResult> {
  'use server';

  await wait(110);

  if (input.reviewer.trim().length < 2) {
    return {
      ok: false,
      actionId: 'assign-reviewer',
      headline: 'Reviewer не назначен',
      message: 'Серверная функция не приняла пустой reviewer.',
      fieldErrors: {
        reviewer: 'Нужен reviewer.',
      },
      auditTrail: [
        'client button -> server boundary',
        'validate reviewer',
        'reject mutation',
      ],
      persisted: null,
    };
  }

  return {
    ok: true,
    actionId: 'assign-reviewer',
    headline: 'Reviewer назначен',
    message: 'Короткая серверная мутация прошла без отдельного route handler.',
    fieldErrors: {},
    auditTrail: [
      'client button -> server boundary',
      'validate reviewer',
      'persist reviewer assignment',
    ],
    persisted: {
      slug: 'n/a',
      reviewer: input.reviewer.trim(),
      status: 'draft',
      revision: 1,
    },
  };
}

export async function invokeServerAction(
  actionId: ServerActionId,
  input: LessonMutationInput,
): Promise<ServerActionResult> {
  if (actionId === 'publish-lesson') {
    return publishLessonOnServer(input);
  }

  if (actionId === 'save-draft') {
    return saveDraftOnServer(input);
  }

  return assignReviewerOnServer({
    reviewer: input.reviewer,
  });
}
