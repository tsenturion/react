import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router-dom';

import {
  actionTopics,
  dataPlaybooks,
  type DataTrack,
  type ErrorMode,
  type MutationRequest,
} from './data-router-domain';

export type MutationFormInput = {
  topicId: string;
  owner: string;
  note: string;
};

export type ComparisonScenario =
  | 'first-render'
  | 'param-change'
  | 'submit'
  | 'error-handling';

export type DataOwnershipInput = {
  dependsOnUrl: boolean;
  blocksScreen: boolean;
  submittedFromForm: boolean;
  shouldRevalidateRoute: boolean;
  purelyDerived: boolean;
  tiedToOneWidget: boolean;
  shouldUseRouteBoundary: boolean;
};

type ValidationErrors = Partial<Record<keyof MutationFormInput, string>>;

// В учебном проекте это in-memory store: он нужен, чтобы action действительно
// менял route-level данные, а loader потом отдавал уже новый snapshot.
let mutationRequests: MutationRequest[] = [
  {
    id: 'request-1',
    topicId: 'loader-first',
    owner: 'Саша',
    note: 'Нужно убрать дублирование fetch из компонента после первого рендера.',
    status: 'validated',
    createdAt: '22:10',
  },
  {
    id: 'request-2',
    topicId: 'error-branch',
    owner: 'Нина',
    note: 'Нужен отдельный route boundary для ветки nested loaders.',
    status: 'queued',
    createdAt: '22:24',
  },
];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function nowStamp() {
  return new Date().toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function parseTrack(value: string | null): DataTrack {
  return value === 'loaders' || value === 'actions' || value === 'errors' ? value : 'all';
}

export function parseErrorMode(value: string | undefined): ErrorMode {
  return value === 'response-404' || value === 'response-503' || value === 'throw-error'
    ? value
    : 'stable';
}

export function filterPlaybooksByTrack(track: DataTrack) {
  return track === 'all'
    ? [...dataPlaybooks]
    : dataPlaybooks.filter((item) => item.track === track);
}

export function validateMutationInput(input: MutationFormInput) {
  const errors: ValidationErrors = {};

  if (!actionTopics.some((item) => item.id === input.topicId)) {
    errors.topicId = 'Выберите валидную тему маршрутизаторной мутации.';
  }

  if (input.owner.trim().length < 2) {
    errors.owner = 'Имя должно быть длиннее одного символа.';
  }

  if (input.note.trim().length < 18) {
    errors.note =
      'Опишите сценарий подробнее, чтобы action было что валидировать и revalidate.';
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    values: {
      topicId: input.topicId,
      owner: input.owner.trim(),
      note: input.note.trim(),
    },
  };
}

export function buildComparisonScenario(scenario: ComparisonScenario) {
  if (scenario === 'first-render') {
    return {
      routeSteps: [
        'Навигация запускает loader до показа нового экрана.',
        'Router держит pending state и знает, какой branch сейчас грузится.',
        'Экран получает готовые данные уже в первом рендере через useLoaderData.',
      ],
      componentSteps: [
        'Компонент сначала рендерится без данных.',
        'useEffect стартует запрос уже после коммита.',
        'Потом появляется отдельный loading state и второй рендер с данными.',
      ],
    };
  }

  if (scenario === 'param-change') {
    return {
      routeSteps: [
        'Смена params автоматически перезапускает loader маршрута.',
        'Router связывает URL, pending navigation и итоговый screen data snapshot.',
        'Новый leaf screen приходит уже из route lifecycle.',
      ],
      componentSteps: [
        'Компонент сам должен заметить param change и перезапустить effect.',
        'Старые данные могут кратко жить рядом с новым URL.',
        'Логика гонок и cancel обычно сваливается в сам компонент.',
      ],
    };
  }

  if (scenario === 'submit') {
    return {
      routeSteps: [
        'Form отправляет данные в action маршрута.',
        'После action loader может автоматически revalidate текущий экран.',
        'Route tree сам синхронизирует submit, pending и итоговый UI.',
      ],
      componentSteps: [
        'Нужно вручную orchestrate submit, validation, refetch и pending UI.',
        'Легко забыть про повторную загрузку данных после мутации.',
        'Компонент начинает хранить слишком много transport-логики.',
      ],
    };
  }

  return {
    routeSteps: [
      'Loader может бросить Response или Error ещё до leaf render.',
      'errorElement branch-а локализует сбой и показывает fallback UI.',
      'Проблема остаётся на уровне маршрута, а не растворяется в произвольных catch по компонентам.',
    ],
    componentSteps: [
      'Нужно отдельно ловить ошибку после effect/fetch и хранить собственный error state.',
      'Граница между ошибкой данных и ошибкой рендера быстро размывается.',
      'Fallback UI сложнее локализовать именно на нужном route branch уровне.',
    ],
  };
}

export function recommendDataOwnership(input: DataOwnershipInput) {
  if (input.purelyDerived) {
    return {
      model: 'Plain compute',
      rationale: [
        'Если значение полностью вычисляется из уже имеющихся props и loader data, хранить его отдельно не нужно.',
        'Лишний loader или effect только размоет источник истины.',
      ],
      antiPattern:
        'Не превращайте обычное вычисление в сетевой или маршрутизаторный слой без реальной причины.',
      score: 24,
    };
  }

  if (input.submittedFromForm && input.shouldRevalidateRoute) {
    return {
      model: 'Action',
      rationale: [
        'Маршрутный submit flow естественно живёт в action и связан с Form.',
        'После action router может revalidate loader без ручного orchestration в компоненте.',
        'Validation и mutation остаются на одном маршрутизаторном уровне.',
      ],
      antiPattern:
        'Не заворачивайте route form в хаотичный onSubmit + fetch + local refetch, если сценарий уже является частью route lifecycle.',
      score: 94,
    };
  }

  if (input.dependsOnUrl && input.blocksScreen) {
    return {
      model: 'Loader',
      rationale: [
        'Если данные определяются route params или search params, loader связывает их с navigation напрямую.',
        'Экран получает готовый data snapshot уже при рендере маршрута.',
        'Ошибки и pending state остаются в route lifecycle, а не размазываются по компонентам.',
      ],
      antiPattern:
        'Не откладывайте URL-зависимый screen fetch в useEffect, если без этих данных экран не имеет смысла.',
      score: 92,
    };
  }

  if (input.tiedToOneWidget && !input.dependsOnUrl && !input.shouldUseRouteBoundary) {
    return {
      model: 'Component request',
      rationale: [
        'Локальный клиентский запрос уместен, если сценарий не определяет route branch и не влияет на navigation.',
        'Так route layer не забирает на себя мелкую widget-логику.',
      ],
      antiPattern:
        'Не поднимайте каждый маленький запрос в loader только потому, что data router это умеет.',
      score: 61,
    };
  }

  return {
    model: 'Hybrid loader + component logic',
    rationale: [
      'Базовый screen data может прийти из loader, а локальные уточнения или widget interactions остаться в компоненте.',
      'Главное разделить route-critical данные и небольшую client-only логику.',
    ],
    antiPattern:
      'Не смешивайте все данные экрана в один слой только ради единообразия. Route layer и component layer решают разные задачи.',
    score: 70,
  };
}

export async function lessonShellLoader() {
  await wait(80);

  return {
    loadedAt: nowStamp(),
    totalPlaybooks: dataPlaybooks.length,
    totalRequests: mutationRequests.length,
    routeFeatures: 6,
  };
}

export async function overviewLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const track = parseTrack(url.searchParams.get('track'));
  const cards = filterPlaybooksByTrack(track);

  await wait(220);

  return {
    track,
    cards,
    requestUrl: `${url.pathname}${url.search}`,
    loadedAt: nowStamp(),
    metrics: {
      cards: cards.length,
      routeOwned: cards.filter((item) => item.track === 'loaders').length,
    },
  };
}

export async function loaderBranchLoader() {
  await wait(140);

  return {
    lessons: dataPlaybooks.filter((item) => item.track !== 'errors'),
    branchNotes: [
      'Parent loader даёт sidebar и branch context.',
      'Child loader даёт конкретную сущность по `:lessonId`.',
      'Child error boundary не рушит parent layout целиком.',
    ],
    loadedAt: nowStamp(),
  };
}

export async function loaderLessonLoader({ params }: LoaderFunctionArgs) {
  await wait(240);

  const lesson = dataPlaybooks.find((item) => item.id === params.lessonId);

  if (!lesson) {
    throw new Response('Loader branch does not know this lesson id.', {
      status: 404,
      statusText: 'Lesson Not Found',
    });
  }

  return {
    lesson,
    loadedAt: nowStamp(),
  };
}

export async function actionsLoader() {
  await wait(160);

  return {
    topics: actionTopics,
    requests: [...mutationRequests],
    loadedAt: nowStamp(),
  };
}

export async function actionsAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const payload: MutationFormInput = {
    topicId: String(formData.get('topicId') ?? ''),
    owner: String(formData.get('owner') ?? ''),
    note: String(formData.get('note') ?? ''),
  };
  const validation = validateMutationInput(payload);

  if (!validation.ok) {
    return {
      ok: false,
      message: 'Action остановила submit до мутации: данные формы ещё невалидны.',
      fieldErrors: validation.errors,
      values: validation.values,
    };
  }

  await wait(260);

  // Action обновляет route-owned dataset, а не локальный state компонента.
  // Следующий loader snapshot уже приходит из того же маршрутизаторного слоя.
  mutationRequests = [
    {
      id: `request-${mutationRequests.length + 1}`,
      topicId: validation.values.topicId,
      owner: validation.values.owner,
      note: validation.values.note,
      status: 'validated',
      createdAt: nowStamp().slice(0, 5),
    },
    ...mutationRequests,
  ];

  return {
    ok: true,
    message:
      'Action приняла submit и route loader автоматически отдал обновлённую очередь заявок.',
    fieldErrors: {},
    values: {
      topicId: '',
      owner: '',
      note: '',
    },
  };
}

export async function errorRouteLoader({ params }: LoaderFunctionArgs) {
  const mode = parseErrorMode(params.mode);
  await wait(180);

  if (mode === 'response-404') {
    throw new Response('Маршрутный loader не нашёл нужный dataset.', {
      status: 404,
      statusText: 'Dataset Missing',
    });
  }

  if (mode === 'response-503') {
    throw new Response('Внешний data source временно недоступен.', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }

  if (mode === 'throw-error') {
    throw new Error('Loader упал с обычным исключением до рендера route element.');
  }

  return {
    mode,
    loadedAt: nowStamp(),
    stableNotes: [
      'Route boundary можно держать рядом с проблемной branch.',
      'Response и Error обрабатываются через errorElement.',
      'Fallback UI строится маршрутизатором, а не отдельным local catch.',
    ],
  };
}

export async function comparisonLoader() {
  await wait(120);

  return {
    loadedAt: nowStamp(),
    scenarios: ['first-render', 'param-change', 'submit', 'error-handling'] as const,
  };
}

export type LessonShellLoaderData = Awaited<ReturnType<typeof lessonShellLoader>>;
export type OverviewLoaderData = Awaited<ReturnType<typeof overviewLoader>>;
export type LoaderBranchLoaderData = Awaited<ReturnType<typeof loaderBranchLoader>>;
export type LoaderLessonLoaderData = Awaited<ReturnType<typeof loaderLessonLoader>>;
export type ActionsLoaderData = Awaited<ReturnType<typeof actionsLoader>>;
export type ActionsActionData = Awaited<ReturnType<typeof actionsAction>>;
export type ErrorRouteLoaderData = Awaited<ReturnType<typeof errorRouteLoader>>;
export type ComparisonLoaderData = Awaited<ReturnType<typeof comparisonLoader>>;
