import { z } from 'zod';

export const ReviewStageSchema = z.enum(['draft', 'review', 'approved']);

export const ExternalReviewItemSchema = z.object({
  id: z.string().min(3, 'ID короче ожидаемого.'),
  title: z.string().min(3, 'Title должен быть длиннее трёх символов.'),
  owner: z.string().min(2, 'Owner должен быть строкой длиной не меньше 2.'),
  stage: ReviewStageSchema,
  score: z.number().int().min(0).max(10),
  updatedAt: z.string().datetime(),
  tags: z.array(z.string().min(2)).max(4),
});

export type ExternalReviewItem = z.infer<typeof ExternalReviewItemSchema>;

export type SchemaPayloadId =
  | 'valid'
  | 'missing-owner'
  | 'bad-stage'
  | 'bad-tags'
  | 'bad-date';

export const schemaPayloads: readonly {
  id: SchemaPayloadId;
  label: string;
  note: string;
  data: unknown;
}[] = [
  {
    id: 'valid',
    label: 'Valid payload',
    note: 'Схема подтверждает структуру, и после этого тип `ExternalReviewItem` уже заслужен.',
    data: {
      id: 'rvw-204',
      title: 'Release checklist cleanup',
      owner: 'Mila',
      stage: 'review',
      score: 7,
      updatedAt: '2026-03-26T09:30:00.000Z',
      tags: ['api', 'types'],
    },
  },
  {
    id: 'missing-owner',
    label: 'Missing owner',
    note: 'Один пропущенный ключ уже ломает договор между сервером и UI.',
    data: {
      id: 'rvw-204',
      title: 'Release checklist cleanup',
      stage: 'review',
      score: 7,
      updatedAt: '2026-03-26T09:30:00.000Z',
      tags: ['api', 'types'],
    },
  },
  {
    id: 'bad-stage',
    label: 'Bad enum',
    note: 'Строка похожа на правильную, но выпадает из допустимой доменной модели.',
    data: {
      id: 'rvw-204',
      title: 'Release checklist cleanup',
      owner: 'Mila',
      stage: 'shipping',
      score: 7,
      updatedAt: '2026-03-26T09:30:00.000Z',
      tags: ['api', 'types'],
    },
  },
  {
    id: 'bad-tags',
    label: 'Bad nested field',
    note: 'Envelope выглядит нормально, но один nested field уже другого типа.',
    data: {
      id: 'rvw-204',
      title: 'Release checklist cleanup',
      owner: 'Mila',
      stage: 'review',
      score: 7,
      updatedAt: '2026-03-26T09:30:00.000Z',
      tags: 'api,types',
    },
  },
  {
    id: 'bad-date',
    label: 'Bad date',
    note: 'Дата часто дрейфует между backend и frontend, хотя TypeScript этого сам не заметит.',
    data: {
      id: 'rvw-204',
      title: 'Release checklist cleanup',
      owner: 'Mila',
      stage: 'review',
      score: 7,
      updatedAt: '26/03/2026 09:30',
      tags: ['api', 'types'],
    },
  },
] as const;

export function getSchemaPayload(payloadId: SchemaPayloadId) {
  return schemaPayloads.find((payload) => payload.id === payloadId) ?? schemaPayloads[0];
}

export function validateReviewItem(payload: unknown) {
  return ExternalReviewItemSchema.safeParse(payload);
}

export function summarizeSchemaIssues(error: z.ZodError): readonly string[] {
  return error.issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join('.') : 'root';

    return `${path}: ${issue.message}`;
  });
}

export function describeUnsafePreview(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    return 'Unsafe cast не знает даже, объект это или нет.';
  }

  const record = payload as Record<string, unknown>;

  return `${String(record.title ?? 'missing title')} / ${String(record.stage ?? 'missing stage')}`;
}

export const schemaSnippet = `const ExternalReviewItemSchema = z.object({
  id: z.string().min(3),
  title: z.string().min(3),
  owner: z.string().min(2),
  stage: z.enum(['draft', 'review', 'approved']),
  score: z.number().int().min(0).max(10),
  updatedAt: z.string().datetime(),
  tags: z.array(z.string().min(2)).max(4),
});`;

export const boundarySnippet = `const parsed = ExternalReviewItemSchema.safeParse(rawPayload);

if (!parsed.success) {
  return {
    status: 'schema-error',
    issues: parsed.error.issues,
  };
}

return parsed.data;`;
