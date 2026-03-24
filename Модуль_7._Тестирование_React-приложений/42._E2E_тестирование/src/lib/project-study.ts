import type { LabId } from './learning-model';

type ProjectStudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudyByLab: Record<LabId, ProjectStudyEntry> = {
  overview: {
    files: [
      {
        path: 'src/lib/e2e-domain.ts',
        note: 'Карта focus-гайдов, route checkpoints и sanitization intent-path для auth journey.',
      },
      {
        path: 'src/lib/e2e-runtime.ts',
        note: 'Overview loader и pure-модели решений: когда route/data/boundary действительно тянут на E2E.',
      },
      {
        path: 'src/pages/OverviewPage.tsx',
        note: 'Главная страница связывает topic map, фильтр по URL и проектные route checkpoints.',
      },
    ],
    snippets: [
      {
        label: 'e2e-runtime.ts',
        note: 'Overview route получает focus из URL и отдаёт уже собранный снимок страницы.',
        code: `export async function overviewLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const focus = parseFocus(url.searchParams.get('focus'));

  return {
    focus,
    guides: filterGuidesByFocus(focus),
    requestUrl: \`\${url.pathname}\${url.search}\`,
  };
}`,
      },
      {
        label: 'e2e-domain.ts',
        note: 'Скрытые экраны и visible labs связаны одной предметной моделью путей.',
        code: `export function describeLabFromPath(pathname: string): LabId {
  if (pathname.startsWith('/route-journeys')) return 'routes';
  if (pathname.startsWith('/auth/') || pathname.startsWith('/workspace')) return 'auth';
  if (pathname.startsWith('/submission-review')) return 'forms';
  return 'overview';
}`,
      },
    ],
  },
  routes: {
    files: [
      {
        path: 'src/components/e2e/RouteJourneyLab.tsx',
        note: 'Интерактивный sandbox переводит шаги пути в URL и даёт ссылку в защищённую ветку.',
      },
      {
        path: 'src/pages/RouteJourneysPage.tsx',
        note: 'Страница собирает профиль маршрута и через pure-функцию показывает, когда browser path действительно нужен.',
      },
      {
        path: 'tests/e2e/e2e-journeys.spec.ts',
        note: 'Первый Playwright-сценарий проходит route -> auth redirect -> protected screen как единый путь.',
      },
    ],
    snippets: [
      {
        label: 'RouteJourneyLab.tsx',
        note: 'Шаги пути выражены через query string, поэтому браузерный тест наблюдает и UI, и адресную строку.',
        code: `const currentStage =
  routeStages.find((item) => item.id === searchParams.get('screen')) ?? routeStages[0];

<Link to={\`/route-journeys?screen=\${stage.id}\`}>{stage.label}</Link>`,
      },
      {
        label: 'e2e-runtime.ts',
        note: 'Решение строится не вокруг моды на E2E, а вокруг структуры сценария.',
        code: `export function evaluateRoutePlanning(input: RoutePlanningInput) {
  const score =
    Number(input.spansMultipleScreens) * 30 +
    Number(input.dependsOnUrl) * 25 +
    Number(input.needsRedirects) * 25 -
    Number(input.assertsImplementationDetails) * 35;
}`,
      },
    ],
  },
  auth: {
    files: [
      {
        path: 'src/router.tsx',
        note: 'Guard сохраняет intended destination в URL и переводит неавторизованного пользователя на hidden login route.',
      },
      {
        path: 'src/components/e2e/AuthFlowPanel.tsx',
        note: 'Форма входа не только открывает session, но и возвращает браузер на сохранённый путь.',
      },
      {
        path: 'src/pages/ReleaseWorkspacePage.tsx',
        note: 'Защищённый экран служит наблюдаемой целью для auth E2E-сценария.',
      },
    ],
    snippets: [
      {
        label: 'router.tsx',
        note: 'Guard и redirect завязаны на location, чтобы intent был наблюдаемым на уровне маршрута.',
        code: `if (!session) {
  const intent = encodeURIComponent(\`\${location.pathname}\${location.search}\`);
  return <Navigate to={\`/auth/login?intent=\${intent}\`} replace />;
}`,
      },
      {
        label: 'AuthFlowPanel.tsx',
        note: 'После login происходит переход именно на safeIntent, а не на жёстко зашитый экран.',
        code: `login({ name: name.trim(), role });
void navigate(safeIntent, { replace: true });`,
      },
    ],
  },
  forms: {
    files: [
      {
        path: 'src/components/e2e/ReleaseFormLab.tsx',
        note: 'Форма хранит draft локально, валидирует ввод и переводит путь на review route.',
      },
      {
        path: 'src/pages/SubmissionReviewPage.tsx',
        note: 'Отдельный review screen превращает submit в реальный screen-to-screen journey.',
      },
      {
        path: 'src/integration/release-form-flow.test.tsx',
        note: 'Integration-test подтверждает путь форма -> review screen внутри MemoryRouter.',
      },
    ],
    snippets: [
      {
        label: 'ReleaseFormLab.tsx',
        note: 'После валидного submit итог состояния уходит в context, а финальный UX принадлежит уже другому route.',
        code: `if (errors.length > 0) {
  return;
}

setLastSubmission(draft);
void navigate('/submission-review');`,
      },
      {
        label: 'SubmissionReviewPage.tsx',
        note: 'Review route умеет честно показать пустое состояние, если путь туда не проходился.',
        code: `if (!lastSubmission) {
  return <div role="alert">Сначала пройдите форму...</div>;
}`,
      },
    ],
  },
  data: {
    files: [
      {
        path: 'src/components/e2e/ReleaseQueueLab.tsx',
        note: 'Здесь собран user-visible async flow: loading, error, retry, empty и success.',
      },
      {
        path: 'src/lib/e2e-service.ts',
        note: 'Fake service имитирует стабильную, flaky и пустую очередь без поднятия отдельного backend-сервиса.',
      },
      {
        path: 'src/components/e2e/ReleaseQueueLab.test.tsx',
        note: 'Supporting component-test страхует async путь снизу и использует provider helper.',
      },
    ],
    snippets: [
      {
        label: 'ReleaseQueueLab.tsx',
        note: 'Retry делает повторный запрос с новым attempt и переводит экран в новый наблюдаемый phase.',
        code: `const nextAttempt = state.attempt + 1;
setState({ phase: 'loading', items: current.items, error: null, attempt: nextAttempt });`,
      },
      {
        label: 'e2e-service.ts',
        note: 'Flaky-профиль специально падает только на первой попытке, чтобы был виден реальный recovery flow.',
        code: `if (profile === 'flaky' && attempt === 1) {
  throw new Error('Транспортный слой не подтвердил очередь с первой попытки.');
}`,
      },
    ],
  },
  boundaries: {
    files: [
      {
        path: 'src/pages/BoundariesPage.tsx',
        note: 'Страница собирает профиль кандидата в E2E и показывает, когда системный слой оправдан.',
      },
      {
        path: 'src/lib/e2e-runtime.ts',
        note: 'Pure-функция boundary decision помогает отделить системную ценность от overkill-покрытия.',
      },
      {
        path: 'tests/e2e/e2e-journeys.spec.ts',
        note: 'Финальные Playwright-сценарии точечные: они не повторяют все ветки lower-level тестов.',
      },
    ],
    snippets: [
      {
        label: 'e2e-runtime.ts',
        note: 'Boundary-оценка учитывает, какие стыки реально пересекает сценарий и что уже застраховано ниже.',
        code: `export function evaluateBoundaryDecision(input: BoundaryInput) {
  const score =
    Number(input.crossesRouting) * 25 +
    Number(input.crossesAuth) * 25 +
    Number(input.crossesData) * 25 -
    Number(input.alreadyCoveredLower) * 20;
}`,
      },
      {
        label: 'tests/e2e/e2e-journeys.spec.ts',
        note: 'E2E здесь не проверяет внутренние callbacks, а проходит путь по ролям, URL и финальным экранам.',
        code: `await page.goto('/workspace/release');
await page.getByLabel('Имя в сессии').fill('Надежда QA');
await page.getByRole('button', { name: 'Войти и продолжить' }).click();
await expect(page).toHaveURL(/\\/workspace\\/release$/);`,
      },
    ],
  },
};
