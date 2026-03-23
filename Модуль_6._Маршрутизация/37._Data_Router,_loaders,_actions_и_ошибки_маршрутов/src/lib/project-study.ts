import type { LabId } from './learning-model';

type ProjectStudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudyByLab: Record<LabId, ProjectStudyEntry> = {
  overview: {
    files: [
      {
        path: 'src/router.tsx',
        note: 'Здесь объявлен data router entry route `data-router-overview` и видно, что loader живёт рядом с экраном.',
      },
      {
        path: 'src/lib/data-router-runtime.ts',
        note: 'Route loader читает request URL, нормализует track и отдаёт готовый snapshot данных до рендера страницы.',
      },
      {
        path: 'src/pages/OverviewPage.tsx',
        note: 'Экран читает `useLoaderData` и обновляет URL через GET Form, не запуская локальный fetch после рендера.',
      },
    ],
    snippets: [
      {
        label: 'router.tsx',
        note: 'Data router связывает маршрут и loader в одном route object.',
        code: `{
  id: 'overview-route',
  path: 'data-router-overview',
  loader: overviewLoader,
  element: <OverviewPage />,
}`,
      },
      {
        label: 'data-router-runtime.ts',
        note: 'Loader получает полноценный request и делает query string частью route-level данных.',
        code: `export async function overviewLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const track = parseTrack(url.searchParams.get('track'));
  const cards = filterPlaybooksByTrack(track);

  await wait(220);

  return {
    track,
    cards,
    requestUrl: \`\${url.pathname}\${url.search}\`,
    loadedAt: nowStamp(),
  };
}`,
      },
    ],
  },
  nested: {
    files: [
      {
        path: 'src/router.tsx',
        note: 'Nested loader branch описан как parent route `loader-tree` с child route `:lessonId` и собственным error boundary.',
      },
      {
        path: 'src/pages/LoaderTreePage.tsx',
        note: 'Parent route держит sidebar, branch notes и `Outlet`, внутри которого живёт leaf screen.',
      },
      {
        path: 'src/pages/LoaderLessonErrorBoundary.tsx',
        note: 'Child route error boundary изолирует сбой leaf loader-а и не рушит parent branch целиком.',
      },
    ],
    snippets: [
      {
        label: 'router.tsx',
        note: 'Parent и child loaders объявлены в одной ветке route tree и работают как единый branch contract.',
        code: `{
  id: 'loader-branch',
  path: 'loader-tree',
  loader: loaderBranchLoader,
  element: <LoaderTreePage />,
  children: [
    {
      id: 'loader-leaf',
      path: ':lessonId',
      loader: loaderLessonLoader,
      element: <LoaderLessonPage />,
      errorElement: <LoaderLessonErrorBoundary />,
    },
  ],
}`,
      },
      {
        label: 'LoaderTreePage.tsx',
        note: 'Parent route сам остаётся живым и только подменяет leaf через Outlet.',
        code: `<Panel className="space-y-4">
  <p className="text-sm leading-6 text-slate-600">
    Ниже рендерится child route branch...
  </p>
  <Outlet />
</Panel>`,
      },
    ],
  },
  actions: {
    files: [
      {
        path: 'src/lib/data-router-runtime.ts',
        note: 'Здесь находятся `actionsLoader` и `actionsAction`: route loader и мутация живут на одном маршрутизаторном уровне.',
      },
      {
        path: 'src/pages/ActionsPage.tsx',
        note: 'Страница использует `Form`, `useActionData`, `useLoaderData` и `useNavigation`, чтобы показать полный route submit flow.',
      },
      {
        path: 'src/router.tsx',
        note: 'Маршрут `actions-lab` объявляет и loader, и action рядом с экраном, который их использует.',
      },
    ],
    snippets: [
      {
        label: 'router.tsx',
        note: 'Action объявляется прямо у маршрута, а не прячется в случайный helper вне route tree.',
        code: `{
  id: 'actions-route',
  path: 'actions-lab',
  loader: actionsLoader,
  action: actionsAction,
  element: <ActionsPage />,
}`,
      },
      {
        label: 'ActionsPage.tsx',
        note: 'Route Form делает submit частью router lifecycle и даёт pending formData прямо из navigation.',
        code: `const actionData = useActionData() as ActionsActionData | undefined;
const navigation = useNavigation();
const pendingFormData = navigation.formData;

<Form method="post" className="space-y-4">
  ...
</Form>`,
      },
    ],
  },
  errors: {
    files: [
      {
        path: 'src/router.tsx',
        note: 'У ветки `error-routes/:mode` есть собственный `errorElement`, поэтому сбой локализуется на route branch уровне.',
      },
      {
        path: 'src/lib/data-router-runtime.ts',
        note: 'Loader специально бросает и `Response`, и обычный `Error`, чтобы показать оба типа route failures.',
      },
      {
        path: 'src/pages/ErrorRouteBoundary.tsx',
        note: 'Route boundary получает ошибку через `useRouteError()` и строит fallback UI без участия локального useState.',
      },
    ],
    snippets: [
      {
        label: 'data-router-runtime.ts',
        note: 'Route loader может оборвать normal render ещё до показа route element.',
        code: `if (mode === 'response-404') {
  throw new Response('Маршрутный loader не нашёл нужный dataset.', {
    status: 404,
    statusText: 'Dataset Missing',
  });
}

if (mode === 'throw-error') {
  throw new Error('Loader упал с обычным исключением до рендера route element.');
}`,
      },
      {
        label: 'ErrorRouteBoundary.tsx',
        note: 'Boundary различает route response errors и обычные исключения.',
        code: `const error = useRouteError();

{isRouteErrorResponse(error)
  ? \`\${error.status} \${error.statusText}\`
  : error instanceof Error
    ? error.message
    : 'Unknown route error'}`,
      },
    ],
  },
  comparison: {
    files: [
      {
        path: 'src/lib/data-router-runtime.ts',
        note: 'Pure-модель сравнивает route request и component request как две разные timeline-модели экрана.',
      },
      {
        path: 'src/pages/ComparisonPage.tsx',
        note: 'Лаборатория переключает сценарии и сравнивает route-driven и component-driven orchestration без лишнего сетевого шума.',
      },
      {
        path: 'src/router.tsx',
        note: 'Даже сравнительная страница получает исходный список сценариев через route loader, а не через local effect.',
      },
    ],
    snippets: [
      {
        label: 'data-router-runtime.ts',
        note: 'Сравнение оформлено как чистая функция, чтобы было видно именно отличие моделей, а не деталей UI.',
        code: `export function buildComparisonScenario(scenario: ComparisonScenario) {
  if (scenario === 'submit') {
    return {
      routeSteps: [
        'Form отправляет данные в action маршрута.',
        'После action loader может автоматически revalidate текущий экран.',
      ],
      componentSteps: [
        'Нужно вручную orchestrate submit, validation, refetch и pending UI.',
      ],
    };
  }
}`,
      },
      {
        label: 'ComparisonPage.tsx',
        note: 'Экран получает loader data и только локально меняет выбранный сценарий сравнения.',
        code: `const data = useLoaderData() as ComparisonLoaderData;
const [scenario, setScenario] = useState<ComparisonScenario>('first-render');
const comparison = buildComparisonScenario(scenario);`,
      },
    ],
  },
  architecture: {
    files: [
      {
        path: 'src/lib/data-router-runtime.ts',
        note: 'Функция `recommendDataOwnership` показывает, как route-critical данные отделяются от widget-only и purely-derived логики.',
      },
      {
        path: 'src/pages/ArchitecturePage.tsx',
        note: 'Интерактивный advisor меняет архитектурную рекомендацию по признакам конкретного сценария.',
      },
      {
        path: 'src/router.tsx',
        note: 'Сам shell урока построен на data router, поэтому архитектурные решения темы видны и в инфраструктуре приложения.',
      },
    ],
    snippets: [
      {
        label: 'data-router-runtime.ts',
        note: 'Архитектурное решение выражено как чистая модель, а не как случайные if-ветки по компонентам.',
        code: `if (input.submittedFromForm && input.shouldRevalidateRoute) {
  return {
    model: 'Action',
    rationale: [
      'Маршрутный submit flow естественно живёт в action и связан с Form.',
      'После action router может revalidate loader без ручного orchestration в компоненте.',
    ],
    score: 94,
  };
}`,
      },
      {
        label: 'ArchitecturePage.tsx',
        note: 'Лаборатория держит только входные признаки, а итоговую рекомендацию вычисляет через pure function.',
        code: `const recommendation = useMemo(() => recommendDataOwnership(input), [input]);

const toggle = (key: keyof typeof input) => {
  setInput((current) => ({
    ...current,
    [key]: !current[key],
  }));
};`,
      },
    ],
  },
};
