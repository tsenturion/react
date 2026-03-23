import type { LabId } from './learning-model';

type ProjectStudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudyByLab: Record<LabId, ProjectStudyEntry> = {
  nested: {
    files: [
      {
        path: 'src/router.tsx',
        note: 'Здесь объявлен nested route branch `nested-routes/:moduleId` и видно, как parent route держит общий экран.',
      },
      {
        path: 'src/pages/NestedRoutesPage.tsx',
        note: 'Parent screen рендерит sidebar, route tree и Outlet для leaf route.',
      },
      {
        path: 'src/pages/NestedModulePane.tsx',
        note: 'Leaf route читает `moduleId` и строит конкретное содержимое уже из параметра URL.',
      },
    ],
    snippets: [
      {
        label: 'router.tsx',
        note: 'Nested route собирает parent screen и child leaf в одну ветку route tree.',
        code: `<Route path="nested-routes" element={<NestedRoutesPage />}>
  <Route index element={<NestedIndexPane />} />
  <Route path=":moduleId" element={<NestedModulePane />} />
</Route>`,
      },
      {
        label: 'NestedRoutesPage.tsx',
        note: 'Parent route рендерит общий каркас и вставляет leaf screen через Outlet.',
        code: `<Panel className="space-y-4">
  <p className="text-sm leading-6 text-slate-600">
    Parent route ниже рендерит общий каркас...
  </p>
  <Outlet />
</Panel>`,
      },
    ],
  },
  layouts: {
    files: [
      {
        path: 'src/pages/LayoutRoutesPage.tsx',
        note: 'Реальный parent layout route с локальной заметкой и child navigation.',
      },
      {
        path: 'src/router.tsx',
        note: 'Здесь видно, что `overview`, `checklist` и `activity` живут внутри одного layout branch.',
      },
      {
        path: 'src/pages/LayoutOverviewPane.tsx',
        note: 'Один из child screens, который рендерится в Outlet родителя.',
      },
    ],
    snippets: [
      {
        label: 'LayoutRoutesPage.tsx',
        note: 'Локальное состояние родителя не теряется, потому что меняются только child routes.',
        code: `const [layoutNote, setLayoutNote] = useState(
  'Эта заметка живёт в parent layout route...'
);`,
      },
      {
        label: 'router.tsx',
        note: 'Layout branch описан как одна route-вкладка с тремя дочерними экранами.',
        code: `<Route path="layout-routes" element={<LayoutRoutesPage />}>
  <Route path="overview" element={<LayoutOverviewPane />} />
  <Route path="checklist" element={<LayoutChecklistPane />} />
  <Route path="activity" element={<LayoutActivityPane />} />
</Route>`,
      },
    ],
  },
  search: {
    files: [
      {
        path: 'src/components/routing-state/SearchParamsPlayground.tsx',
        note: 'UI фильтров и сортировки, который пишет состояние прямо в query string.',
      },
      {
        path: 'src/lib/url-state-model.ts',
        note: 'Pure-функции нормализации query string и фильтрации списка.',
      },
      {
        path: 'src/pages/SearchParamsPage.tsx',
        note: 'Страница связывает useSearchParams, derived data и смысл query-driven screen mode.',
      },
    ],
    snippets: [
      {
        label: 'url-state-model.ts',
        note: 'Состояние query string сначала нормализуется, и только потом используется в UI.',
        code: `export function resolveCatalogSearchState(searchParams: URLSearchParams) {
  return {
    level: normalizeValue(searchParams.get('level'), catalogLevels, 'all'),
    sort: normalizeValue(searchParams.get('sort'), catalogSorts, 'popular'),
    view: normalizeValue(searchParams.get('view'), catalogViews, 'cards'),
  };
}`,
      },
      {
        label: 'SearchParamsPlayground.tsx',
        note: 'Нет зеркального useState для filter/sort/view: адрес уже является источником истины.',
        code: `const state = resolveCatalogSearchState(searchParams);
const items = getCatalogItems(routingModules, state);
const updateQuery = (patch: Record<string, string>) => {
  setSearchParams(patchSearchParams(searchParams, patch));
};`,
      },
    ],
  },
  'url-state': {
    files: [
      {
        path: 'src/components/routing-state/UrlStateWorkbench.tsx',
        note: 'Tabs, status filter и sort mode меняются через query string.',
      },
      {
        path: 'src/lib/url-state-model.ts',
        note: 'Модель URL-driven workspace state и derived rows.',
      },
      {
        path: 'src/pages/UrlStatePage.tsx',
        note: 'Страница показывает, как один path может иметь много устойчивых screen states.',
      },
    ],
    snippets: [
      {
        label: 'url-state-model.ts',
        note: 'Один и тот же route path может иметь десятки режимов, если их безопасно нормализовать из search params.',
        code: `export function resolveWorkspaceUrlState(searchParams: URLSearchParams) {
  return {
    tab: normalizeValue(searchParams.get('tab'), workspaceTabs, 'outline'),
    status: normalizeValue(searchParams.get('status'), workspaceStatuses, 'all'),
    sort: normalizeValue(searchParams.get('sort'), workspaceSorts, 'progress'),
  };
}`,
      },
      {
        label: 'UrlStateWorkbench.tsx',
        note: 'Preset deep links показывают, что URL действительно кодирует screen mode.',
        code: `const presets = [
  {
    label: 'outline / all / progress',
    href: '/url-state?tab=outline&status=all&sort=progress',
  },
];`,
      },
    ],
  },
  entities: {
    files: [
      {
        path: 'src/pages/EntitySelectionPage.tsx',
        note: 'Path param и query string читаются вместе и образуют один screen contract.',
      },
      {
        path: 'src/components/routing-state/EntityUrlWorkbench.tsx',
        note: 'Смена сущности сохраняет query-driven mode, потому что path и search params работают вместе.',
      },
      {
        path: 'src/lib/routing-domain.ts',
        note: 'Каталог сущностей, которые открываются по `:entityId`.',
      },
    ],
    snippets: [
      {
        label: 'EntitySelectionPage.tsx',
        note: 'Экран получает identity из path, а режим просмотра из query string.',
        code: `const { entityId } = useParams();
const [searchParams] = useSearchParams();
const entity = findRoutingModule(entityId ?? '');
const state = resolveEntityUrlState(searchParams);`,
      },
      {
        label: 'EntityUrlWorkbench.tsx',
        note: 'При переключении сущности query string можно сохранить, не теряя tab и panel mode.',
        code: `to={\`/entities/\${item.id}\${preservedQuery ? \`?\${preservedQuery}\` : ''}\`}`,
      },
    ],
  },
  architecture: {
    files: [
      {
        path: 'src/lib/route-placement-model.ts',
        note: 'Pure-модель выбора между nested route, path param, search params и local state.',
      },
      {
        path: 'src/pages/ArchitecturePage.tsx',
        note: 'Интерактивный advisor, который меняет рекомендацию по признакам сценария.',
      },
      {
        path: 'src/router.tsx',
        note: 'Сам урок показывает, что routing-решения живут на уровне общей архитектуры app shell.',
      },
    ],
    snippets: [
      {
        label: 'route-placement-model.ts',
        note: 'Архитектурное решение выражено как чистая функция, а не как разрозненные if-ветки по компонентам.',
        code: `if (input.selectedEntity && (input.shareable || input.needsBackButton)) {
  return {
    model: 'Path param',
    score: 93,
  };
}`,
      },
      {
        label: 'ArchitecturePage.tsx',
        note: 'Лаборатория меняет признаки сценария и сразу показывает смену routing-модели.',
        code: `const recommendation = useMemo(
  () => recommendUrlPlacement(input),
  [input],
);`,
      },
    ],
  },
};
