import { z } from 'zod';

import {
  ExternalReviewItemSchema,
  summarizeSchemaIssues,
} from './zod-schema-boundary-model';

export type ServerVariant = 'valid-response' | 'invalid-response' | 'reject';

export type DraftFormValues = {
  title: string;
  owner: string;
  stage: 'draft' | 'review' | 'approved';
  score: string;
};

export type MutationResult =
  | { status: 'success'; receipt: string; savedTitle: string }
  | { status: 'validation-error'; issues: readonly string[] }
  | { status: 'server-error'; message: string }
  | { status: 'schema-error'; issues: readonly string[] };

export const initialFormValues: DraftFormValues = {
  title: 'Typed external contract',
  owner: 'Nina',
  stage: 'review',
  score: '7',
};

export const DraftFormSchema = z.object({
  title: z.string().trim().min(3, 'Title должен быть длиннее трёх символов.'),
  owner: z.string().trim().min(2, 'Owner должен быть длиннее одного символа.'),
  stage: z.enum(['draft', 'review', 'approved']),
  score: z.coerce.number().int().min(0).max(10),
});

const MutationResponseSchema = z.object({
  savedAt: z.string().datetime(),
  item: ExternalReviewItemSchema,
});

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export async function submitValidatedMutation(
  formValues: DraftFormValues,
  serverVariant: ServerVariant,
): Promise<MutationResult> {
  const parsedInput = DraftFormSchema.safeParse(formValues);

  if (!parsedInput.success) {
    return {
      status: 'validation-error',
      issues: summarizeSchemaIssues(parsedInput.error),
    };
  }

  await delay(260);

  if (serverVariant === 'reject') {
    return {
      status: 'server-error',
      message: 'Сервер отклонил mutation до ответа с данными.',
    };
  }

  const responsePayload =
    serverVariant === 'valid-response'
      ? {
          savedAt: '2026-03-26T10:45:00.000Z',
          item: {
            id: 'rvw-402',
            title: parsedInput.data.title,
            owner: parsedInput.data.owner,
            stage: parsedInput.data.stage,
            score: parsedInput.data.score,
            updatedAt: '2026-03-26T10:45:00.000Z',
            tags: ['mutation', 'typed'],
          },
        }
      : {
          savedAt: '2026-03-26T10:45:00.000Z',
          item: {
            id: 'rvw-402',
            title: parsedInput.data.title,
            owner: parsedInput.data.owner,
            stage: 'shipping',
            score: parsedInput.data.score,
            updatedAt: '2026-03-26T10:45:00.000Z',
            tags: ['mutation', 'typed'],
          },
        };

  const parsedResponse = MutationResponseSchema.safeParse(responsePayload);

  if (!parsedResponse.success) {
    return {
      status: 'schema-error',
      issues: summarizeSchemaIssues(parsedResponse.error),
    };
  }

  return {
    status: 'success',
    receipt: parsedResponse.data.savedAt,
    savedTitle: parsedResponse.data.item.title,
  };
}

export const formSchemaSnippet = `const DraftFormSchema = z.object({
  title: z.string().trim().min(3),
  owner: z.string().trim().min(2),
  stage: z.enum(['draft', 'review', 'approved']),
  score: z.coerce.number().int().min(0).max(10),
});`;

export const responseSchemaSnippet = `const MutationResponseSchema = z.object({
  savedAt: z.string().datetime(),
  item: ExternalReviewItemSchema,
});`;
