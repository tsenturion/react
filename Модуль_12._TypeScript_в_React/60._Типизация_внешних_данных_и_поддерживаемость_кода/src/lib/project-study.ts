import type { LabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudyByLab: Record<LabId, StudyEntry> = {
  overview: {
    files: [
      {
        path: 'src/router.tsx',
        note: 'Shell урока сразу делит тему на schema boundary, requests, mutations, routes и playbook.',
      },
      {
        path: 'src/lib/learning-model.ts',
        note: 'Route map урока и модель лабораторий.',
      },
      {
        path: 'src/lib/external-data-overview-domain.ts',
        note: 'Карта темы и типичные failures на границе между TS и реальными данными.',
      },
    ],
    snippets: [
      {
        label: 'Lesson route map',
        note: 'Структура урока выражена через реальные boundary points приложения, а не через абстрактную теорию.',
        code: `export const lessonLabs = [
  { id: 'schemas', href: '/schema-boundaries' },
  { id: 'requests', href: '/validated-requests' },
  { id: 'mutations', href: '/validated-mutations' },
  { id: 'routes', href: '/route-contracts' },
];`,
      },
      {
        label: 'Overview focus parser',
        note: 'Даже обзор урока держится на typed-модели фокусов, а не на свободном наборе строк.',
        code: `export function parseOverviewFocus(value: string | null): OverviewFocus {
  switch (value) {
    case 'schemas':
    case 'requests':
      return value;
    default:
      return 'all';
  }
}`,
      },
    ],
  },
  schemas: {
    files: [
      {
        path: 'src/components/external-data-labs/SchemaBoundaryLab.tsx',
        note: 'Интерактивное сравнение raw payload, safeParse и unsafe cast.',
      },
      {
        path: 'src/lib/zod-schema-boundary-model.ts',
        note: 'Центральная схема внешней сущности и helpers для Zod issues.',
      },
      {
        path: 'src/components/external-data-labs/SchemaBoundaryLab.test.tsx',
        note: 'Проверка того, что лаборатория действительно ловит schema mismatch.',
      },
    ],
    snippets: [
      {
        label: 'External schema',
        note: 'Схема описывает не только типы, но и реальный контракт для неизвестного payload.',
        code: `const ExternalReviewItemSchema = z.object({
  title: z.string().min(3),
  stage: z.enum(['draft', 'review', 'approved']),
  updatedAt: z.string().datetime(),
});`,
      },
      {
        label: 'Boundary parse',
        note: 'Только после `safeParse` raw payload превращается в честный тип, а не в предположение.',
        code: `const parsed = ExternalReviewItemSchema.safeParse(rawPayload);

if (!parsed.success) {
  return { status: 'schema-error', issues: parsed.error.issues };
}`,
      },
    ],
  },
  requests: {
    files: [
      {
        path: 'src/components/external-data-labs/ValidatedRequestsLab.tsx',
        note: 'Async request flow с network error, schema error, empty и success branches.',
      },
      {
        path: 'src/lib/request-validation-model.ts',
        note: 'Envelope schema и schema-aware request state.',
      },
      {
        path: 'src/lib/zod-schema-boundary-model.ts',
        note: 'Nested item schema переиспользуется внутри request envelope.',
      },
    ],
    snippets: [
      {
        label: 'Envelope schema',
        note: 'Проверяется не только каждый item, но и форма самого response envelope.',
        code: `const ReviewFeedSchema = z.object({
  items: z.array(ExternalReviewItemSchema),
  nextCursor: z.string().nullable(),
});`,
      },
      {
        label: 'Schema-aware request state',
        note: 'Ошибки делятся по происхождению: сеть и контракт — это не одно и то же.',
        code: `type RequestState =
  | { status: 'loading' }
  | { status: 'empty'; reason: string }
  | { status: 'success'; items: ExternalReviewItem[] }
  | { status: 'error'; source: 'network' | 'schema'; issues: string[] };`,
      },
    ],
  },
  mutations: {
    files: [
      {
        path: 'src/components/external-data-labs/MutationValidationLab.tsx',
        note: 'Форма, submit и ответ сервера проходят через runtime contracts.',
      },
      {
        path: 'src/lib/mutation-validation-model.ts',
        note: 'Schema для входящего form payload и исходящего server response.',
      },
      {
        path: 'src/components/external-data-labs/MutationValidationLab.test.tsx',
        note: 'Проверка validation error и schema error после submit.',
      },
    ],
    snippets: [
      {
        label: 'Form schema',
        note: 'Даже локальная форма начинается с внешнего пользовательского ввода, а значит нуждается в runtime parse.',
        code: `const DraftFormSchema = z.object({
  title: z.string().trim().min(3),
  owner: z.string().trim().min(2),
  score: z.coerce.number().int().min(0).max(10),
});`,
      },
      {
        label: 'Response schema',
        note: 'Mutation считается успешной только после проверки ответа, а не просто после `await fetch(...)`.',
        code: `const MutationResponseSchema = z.object({
  savedAt: z.string().datetime(),
  item: ExternalReviewItemSchema,
});`,
      },
    ],
  },
  routes: {
    files: [
      {
        path: 'src/components/external-data-labs/RouteContractsLab.tsx',
        note: 'Сравнение parse в loader boundary, parse внутри компонента и unsafe cast.',
      },
      {
        path: 'src/lib/route-contract-model.ts',
        note: 'Чистая модель route strategies и их последствий.',
      },
      {
        path: 'src/router.tsx',
        note: 'Shell урока сам показывает, что route boundary — это архитектурная поверхность, а не “только про data fetching”.',
      },
    ],
    snippets: [
      {
        label: 'Loader parse',
        note: 'Loader boundary выгоден тем, что не пускает невалидные данные дальше по дереву.',
        code: `const parsed = RouteDashboardSchema.safeParse(raw);

if (!parsed.success) {
  throw new Response('Schema mismatch', { status: 500 });
}

return parsed.data;`,
      },
      {
        label: 'Unsafe cast',
        note: 'Каст создаёт иллюзию готового типа, хотя фактический payload всё ещё непроверенный.',
        code: `const dashboard = rawPayload as RouteDashboard;
return <DashboardScreen dashboard={dashboard} />;`,
      },
    ],
  },
  playbook: {
    files: [
      {
        path: 'src/components/external-data-labs/ExternalDataPlaybookLab.tsx',
        note: 'Итоговый chooser стратегии runtime validation.',
      },
      {
        path: 'src/lib/external-data-playbook-model.ts',
        note: 'Чистая модель рекомендаций по data boundaries.',
      },
      {
        path: 'README.md',
        note: 'README фиксирует, что схема — это не замена TypeScript, а boundary contract.',
      },
    ],
    snippets: [
      {
        label: 'Route-first advice',
        note: 'Если риск сидит в loader boundary, стратегия сразу рекомендует parse до рендера.',
        code: `if (input.source === 'route-loader') {
  return {
    title: 'Parse выгоднее делать в loader boundary',
    tone: 'error',
  };
}`,
      },
      {
        label: 'Form-first advice',
        note: 'Form payload остаётся внешним вводом, даже если форма локальна для одного компонента.',
        code: `if (input.source === 'form-data') {
  return {
    title: 'Поставьте schema прямо на входе формы',
    tone: 'warn',
  };
}`,
      },
    ],
  },
};
