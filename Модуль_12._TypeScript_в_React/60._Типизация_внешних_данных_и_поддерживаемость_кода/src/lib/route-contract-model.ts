import { z } from 'zod';

import {
  ExternalReviewItemSchema,
  summarizeSchemaIssues,
} from './zod-schema-boundary-model';

export type RouteStrategy = 'loader-parse' | 'component-parse' | 'unsafe-cast';
export type RoutePayloadVariant =
  | 'valid'
  | 'missing-permission'
  | 'bad-featured'
  | 'wrong-summary';

export type RouteOutcome =
  | {
      status: 'ready';
      location: 'loader' | 'component';
      summary: string;
      warning: string;
    }
  | {
      status: 'blocked';
      location: 'loader' | 'component';
      message: string;
      issues: readonly string[];
    }
  | {
      status: 'unsafe';
      location: 'unsafe';
      preview: string;
      risk: string;
    };

const RouteDashboardSchema = z.object({
  summary: z.object({
    team: z.string(),
    queueSize: z.number().int().nonnegative(),
    staleItems: z.number().int().nonnegative(),
  }),
  featured: ExternalReviewItemSchema,
  permissions: z.object({
    canApprove: z.boolean(),
    canReassign: z.boolean(),
  }),
});

const routePayloads: Record<RoutePayloadVariant, unknown> = {
  valid: {
    summary: {
      team: 'Release desk',
      queueSize: 12,
      staleItems: 2,
    },
    featured: {
      id: 'rvw-204',
      title: 'Release checklist cleanup',
      owner: 'Mila',
      stage: 'review',
      score: 7,
      updatedAt: '2026-03-26T09:30:00.000Z',
      tags: ['api', 'types'],
    },
    permissions: {
      canApprove: true,
      canReassign: true,
    },
  },
  'missing-permission': {
    summary: {
      team: 'Release desk',
      queueSize: 12,
      staleItems: 2,
    },
    featured: {
      id: 'rvw-204',
      title: 'Release checklist cleanup',
      owner: 'Mila',
      stage: 'review',
      score: 7,
      updatedAt: '2026-03-26T09:30:00.000Z',
      tags: ['api', 'types'],
    },
    permissions: {
      canApprove: true,
    },
  },
  'bad-featured': {
    summary: {
      team: 'Release desk',
      queueSize: 12,
      staleItems: 2,
    },
    featured: {
      id: 'rvw-204',
      title: 'Release checklist cleanup',
      owner: 'Mila',
      stage: 'queued',
      score: 7,
      updatedAt: '2026-03-26T09:30:00.000Z',
      tags: ['api', 'types'],
    },
    permissions: {
      canApprove: true,
      canReassign: true,
    },
  },
  'wrong-summary': {
    summary: {
      team: 'Release desk',
      queueSize: '12',
      staleItems: 2,
    },
    featured: {
      id: 'rvw-204',
      title: 'Release checklist cleanup',
      owner: 'Mila',
      stage: 'review',
      score: 7,
      updatedAt: '2026-03-26T09:30:00.000Z',
      tags: ['api', 'types'],
    },
    permissions: {
      canApprove: true,
      canReassign: true,
    },
  },
};

export function evaluateRouteBoundary(
  strategy: RouteStrategy,
  variant: RoutePayloadVariant,
): RouteOutcome {
  const payload = routePayloads[variant];

  if (strategy === 'unsafe-cast') {
    const assumed = payload as {
      summary?: { queueSize?: unknown };
      featured?: { stage?: unknown };
    };

    return {
      status: 'unsafe',
      location: 'unsafe',
      preview: `queueSize=${String(assumed.summary?.queueSize ?? 'missing')} / stage=${String(assumed.featured?.stage ?? 'missing')}`,
      risk: 'UI уже использует поля как будто контракт подтверждён, но никакой runtime проверки не было.',
    };
  }

  const parsed = RouteDashboardSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      status: 'blocked',
      location: strategy === 'loader-parse' ? 'loader' : 'component',
      message:
        strategy === 'loader-parse'
          ? 'Маршрут остановлен на loader boundary до рендера.'
          : 'Маршрут дошёл до компонента и сломался позже, уже внутри UI-дерева.',
      issues: summarizeSchemaIssues(parsed.error),
    };
  }

  return {
    status: 'ready',
    location: strategy === 'loader-parse' ? 'loader' : 'component',
    summary: `${parsed.data.summary.team}: ${parsed.data.summary.queueSize} items`,
    warning:
      strategy === 'loader-parse'
        ? 'Данные уже безопасны для остального дерева.'
        : 'Контракт всё ещё честный, но проверка произошла позже, чем могла бы.',
  };
}

export const routeLoaderSnippet = `const parsed = RouteDashboardSchema.safeParse(raw);

if (!parsed.success) {
  throw new Response('Schema mismatch', { status: 500 });
}

return parsed.data;`;

export const unsafeRouteSnippet = `const dashboard = rawPayload as RouteDashboard;
return <DashboardScreen dashboard={dashboard} />;`;
