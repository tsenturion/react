import type { LabId } from './learning-model';

type ProjectStudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudies: Record<LabId, ProjectStudyEntry> = {
  basics: {
    files: [
      {
        path: 'src/main.tsx',
        note: 'Точка входа, где BrowserRouter поднимает client-side routing над всем приложением.',
      },
      {
        path: 'src/router.tsx',
        note: 'Layout route, child routes и реальная client-side navigation-панель проекта.',
      },
      {
        path: 'src/pages/BasicsPage.tsx',
        note: 'Лаборатория с живым сравнением Link и reloadDocument.',
      },
    ],
    snippets: [
      {
        label: 'main.tsx',
        note: 'Client-side routing появляется в приложении только после того, как BrowserRouter оборачивает весь tree.',
        code: `<BrowserRouter>
  <App />
</BrowserRouter>`,
      },
      {
        label: 'router.tsx',
        note: 'Shell state живёт в layout route и поэтому сохраняется между дочерними переходами.',
        code: `useEffect(() => {
  const stamp = \`\${location.pathname}\${location.search || ''}\`;
  setTransitionLog((current) =>
    [stamp, ...current.filter((item) => item !== stamp)].slice(0, 6),
  );
}, [location.pathname, location.search]);`,
      },
    ],
  },
  tree: {
    files: [
      {
        path: 'src/router.tsx',
        note: 'Здесь объявлен реальный route tree через Routes, Route, Outlet и Navigate.',
      },
      {
        path: 'src/lib/routing-domain.ts',
        note: 'Отдельная модель route tree и учебных route-сущностей для визуализации и анализа.',
      },
      {
        path: 'src/components/routing/RouteTreeVisualizer.tsx',
        note: 'Компонент, который показывает совпадение текущего pathname с route tree.',
      },
    ],
    snippets: [
      {
        label: 'router.tsx',
        note: 'Маршруты здесь описаны как дерево экранов, а не как произвольные условные ветки.',
        code: `<Route path="/" element={<LessonLayout />}>
  <Route index element={<Navigate to="/client-routing" replace />} />
  <Route path="client-routing" element={<BasicsPage />} />
  <Route path="route-tree" element={<TreePage />} />
  <Route path="params">
    <Route path=":lessonId" element={<ParamsPage />} />
  </Route>
</Route>`,
      },
      {
        label: 'path-model.ts',
        note: 'Совпадение route tree с pathname вынесено в pure function, а не зашито прямо в UI.',
        code: `const isMatch =
  normalized === '/'
    ? pathname === '/' || pathname.startsWith('/')
    : pathname === normalized || pathname.startsWith(\`\${normalized}/\`);`,
      },
    ],
  },
  navigation: {
    files: [
      {
        path: 'src/components/routing/NavigationPlayground.tsx',
        note: 'Живое сравнение Link, NavLink и useNavigate в одном экране.',
      },
      {
        path: 'src/router.tsx',
        note: 'NavLink используется и в главном меню урока, и в отдельной navigation-лаборатории.',
      },
      {
        path: 'src/pages/NavigationPage.tsx',
        note: 'Страница, где навигационные паттерны связаны с типичными сценариями использования.',
      },
    ],
    snippets: [
      {
        label: 'NavigationPlayground.tsx',
        note: 'Здесь рядом существуют декларативная и императивная навигация, потому что они решают разные задачи.',
        code: `<Link to="/params/profile-editor">Link to param route</Link>
<button type="button" onClick={() => navigate('/spa-mental-model')}>
  useNavigate to SPA lab
</button>`,
      },
      {
        label: 'router.tsx',
        note: 'NavLink нужен там, где активный экран должен быть виден прямо в меню.',
        code: `<NavLink
  to={item.href}
  className={({ isActive }) =>
    isActive ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-700'
  }
>`,
      },
    ],
  },
  params: {
    files: [
      {
        path: 'src/pages/ParamsPage.tsx',
        note: 'Экран, который читает lessonId из URL и строит содержимое уже из параметра маршрута.',
      },
      {
        path: 'src/lib/routing-domain.ts',
        note: 'Данные сущностей для param-route и helper для поиска по lessonId.',
      },
      {
        path: 'src/router.tsx',
        note: 'Маршрут `params/:lessonId` объявлен как отдельная ветка route tree.',
      },
    ],
    snippets: [
      {
        label: 'ParamsPage.tsx',
        note: 'Один и тот же экран переиспользуется для разных URL за счёт useParams.',
        code: `const { lessonId = '' } = useParams();
const lesson = findRouteLesson(lessonId);`,
      },
      {
        label: 'routing-domain.ts',
        note: 'Данные по param-route отделены от компонента, чтобы URL-параметр работал как ключ к сущности, а не как магическая строка в JSX.',
        code: `export function findRouteLesson(lessonId: string) {
  return routeParamLessons.find((item) => item.id === lessonId) ?? null;
}`,
      },
    ],
  },
  spa: {
    files: [
      {
        path: 'src/router.tsx',
        note: 'Layout route и shell note показывают, как SPA сохраняет общую оболочку между экранами.',
      },
      {
        path: 'src/pages/SpaPage.tsx',
        note: 'Страница, где компоненты, экраны и сценарии явно разнесены по разным уровням модели.',
      },
      {
        path: 'src/lib/learning-model.ts',
        note: 'Навигационные лаборатории описаны как отдельные экраны со своими href и смыслом.',
      },
    ],
    snippets: [
      {
        label: 'router.tsx',
        note: 'Shell остаётся общим, а Outlet подменяет только активный экран.',
        code: `<main className="panel p-6 sm:p-8">
  <Outlet />
</main>`,
      },
      {
        label: 'SpaPage.tsx',
        note: 'Страница показывает, что после появления роутинга появляется отдельный слой экранов и пользовательских сценариев.',
        code: `<ListBlock
  title="Экраны"
  items={[
    'Маршруты вроде /client-routing, /navigation или /params/:lessonId.',
    'Каждый экран имеет собственный URL и точку входа.',
  ]}
/>`,
      },
    ],
  },
  architecture: {
    files: [
      {
        path: 'src/lib/routing-domain.ts',
        note: 'Pure-модель выбора между маршрутом и локальным UI-state.',
      },
      {
        path: 'src/pages/ArchitecturePage.tsx',
        note: 'Интерактивный advisor, который меняет рекомендации по признакам сценария.',
      },
      {
        path: 'src/router.tsx',
        note: 'Даже сам урок закрепляет, что маршрут здесь действительно описывает отдельный экран, а не случайную панель.',
      },
    ],
    snippets: [
      {
        label: 'routing-domain.ts',
        note: 'Решение о маршруте здесь вынесено в pure function, чтобы trade-offs были явными и тестируемыми.',
        code: `if (
  input.representsScreen &&
  (input.hasShareableUrl || input.needsBrowserHistory || input.deepLinkingMatters)
) {
  return {
    approach: 'Route',
    score: 90,
  };
}`,
      },
      {
        label: 'ArchitecturePage.tsx',
        note: 'Архитектурная лаборатория не просто рассказывает правило, а даёт менять свойства сценария и видеть смену рекомендации.',
        code: `const recommendation = recommendRoutePlacement({
  hasShareableUrl,
  representsScreen,
  needsBrowserHistory,
  deepLinkingMatters,
  onlyTogglesUiFragment,
});`,
      },
    ],
  },
};
