import { z } from 'zod';

import {
  ExternalReviewItemSchema,
  summarizeSchemaIssues,
  type ExternalReviewItem,
} from './zod-schema-boundary-model';

export type RequestVariant = 'valid' | 'empty' | 'invalid-item' | 'wrong-envelope';
export type NetworkMode = 'ok' | 'offline';

export type RequestState =
  | { status: 'idle' }
  | { status: 'loading'; note: string }
  | { status: 'success'; items: readonly ExternalReviewItem[]; nextCursor: string | null }
  | { status: 'empty'; reason: string }
  | {
      status: 'error';
      source: 'network' | 'schema';
      message: string;
      issues: readonly string[];
    };

const ReviewFeedSchema = z.object({
  items: z.array(ExternalReviewItemSchema),
  nextCursor: z.string().nullable(),
});

type ReviewFeed = z.infer<typeof ReviewFeedSchema>;

const requestPayloads: Record<RequestVariant, unknown> = {
  valid: {
    items: [
      {
        id: 'rvw-204',
        title: 'Release checklist cleanup',
        owner: 'Mila',
        stage: 'review',
        score: 7,
        updatedAt: '2026-03-26T09:30:00.000Z',
        tags: ['api', 'types'],
      },
      {
        id: 'rvw-205',
        title: 'SDK changelog',
        owner: 'Artem',
        stage: 'draft',
        score: 5,
        updatedAt: '2026-03-25T14:10:00.000Z',
        tags: ['docs'],
      },
    ],
    nextCursor: 'cursor:205',
  },
  empty: {
    items: [],
    nextCursor: null,
  },
  'invalid-item': {
    items: [
      {
        id: 'rvw-204',
        title: 'Release checklist cleanup',
        owner: 'Mila',
        stage: 'review',
        score: 7,
        updatedAt: '2026-03-26T09:30:00.000Z',
        tags: ['api', 'types'],
      },
      {
        id: 'rvw-205',
        title: 'SDK changelog',
        owner: 'Artem',
        stage: 'queued',
        score: 5,
        updatedAt: '2026-03-25T14:10:00.000Z',
        tags: ['docs'],
      },
    ],
    nextCursor: 'cursor:205',
  },
  'wrong-envelope': {
    data: [],
    cursor: 'cursor:205',
  },
};

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function parseFeedPayload(payload: unknown): ReviewFeed | { issues: readonly string[] } {
  const parsed = ReviewFeedSchema.safeParse(payload);

  if (!parsed.success) {
    return { issues: summarizeSchemaIssues(parsed.error) };
  }

  return parsed.data;
}

export async function runValidatedRequest(
  networkMode: NetworkMode,
  variant: RequestVariant,
): Promise<RequestState> {
  await delay(260);

  if (networkMode === 'offline') {
    return {
      status: 'error',
      source: 'network',
      message: 'Сеть не ответила. До schema parse дело даже не дошло.',
      issues: [],
    };
  }

  const parsed = parseFeedPayload(requestPayloads[variant]);

  if ('issues' in parsed) {
    return {
      status: 'error',
      source: 'schema',
      message: 'Ответ пришёл, но его форма не совпала с контрактом.',
      issues: parsed.issues,
    };
  }

  if (parsed.items.length === 0) {
    return {
      status: 'empty',
      reason: 'Envelope валиден, но список реально пуст.',
    };
  }

  return {
    status: 'success',
    items: parsed.items,
    nextCursor: parsed.nextCursor,
  };
}

export function describeRequestState(state: RequestState): string {
  switch (state.status) {
    case 'idle':
      return 'Запрос ещё не запускался.';
    case 'loading':
      return state.note;
    case 'empty':
      return state.reason;
    case 'success':
      return `Валидный envelope с ${state.items.length} элементами.`;
    case 'error':
      return state.message;
    default:
      return 'Неизвестное состояние запроса.';
  }
}

export const requestSnippet = `const ReviewFeedSchema = z.object({
  items: z.array(ExternalReviewItemSchema),
  nextCursor: z.string().nullable(),
});`;

export const requestBoundarySnippet = `if (!parsed.success) {
  return {
    status: 'error',
    source: 'schema',
    issues: parsed.error.issues,
  };
}

if (parsed.data.items.length === 0) {
  return { status: 'empty' };
}`;
