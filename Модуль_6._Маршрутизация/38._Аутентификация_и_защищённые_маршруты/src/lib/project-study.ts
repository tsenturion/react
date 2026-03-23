import type { LabId } from './learning-model';

type ProjectStudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudyByLab: Record<LabId, ProjectStudyEntry> = {
  overview: {
    files: [
      {
        path: 'src/lib/auth-domain.ts',
        note: 'Здесь собраны роли, personas, protected screens и playbooks темы.',
      },
      {
        path: 'src/lib/auth-runtime.ts',
        note: 'Loader overview получает `request.url`, фильтрует карточки темы и добавляет текущий session snapshot.',
      },
      {
        path: 'src/pages/OverviewPage.tsx',
        note: 'Экран показывает auth flow через route-owned data, а не через локальный fetch после рендера.',
      },
    ],
    snippets: [
      {
        label: 'auth-runtime.ts',
        note: 'Loader overview делает query-driven фильтрацию частью маршрутизаторного слоя.',
        code: `export async function overviewLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const focus = parseFocus(url.searchParams.get('focus'));
  const cards = filterAuthPlaybooksByFocus(focus);

  return {
    focus,
    cards,
    requestUrl: \`\${url.pathname}\${url.search}\`,
    session: authSessionStore.getSnapshot().session,
  };
}`,
      },
      {
        label: 'auth-domain.ts',
        note: 'Роли и protected screen matrix заданы отдельно от UI, чтобы routing и доступ опирались на чистую модель.',
        code: `export const roleScreens: readonly ScreenSpec[] = [
  {
    id: 'admin-panel',
    requiredRole: 'admin',
    allowedRoles: ['admin'],
  },
];`,
      },
    ],
  },
  protected: {
    files: [
      {
        path: 'src/router.tsx',
        note: 'Protected branch объявлен как parent route с `loader`, `Outlet` и child screen loaders.',
      },
      {
        path: 'src/lib/auth-runtime.ts',
        note: 'Guard loader проверяет session snapshot, пытается refresh и при необходимости делает redirect на login.',
      },
      {
        path: 'src/pages/ProtectedWorkspacePage.tsx',
        note: 'Parent protected layout держит sidebar, branch notes и текущую auth session.',
      },
    ],
    snippets: [
      {
        label: 'auth-runtime.ts',
        note: 'Protected loader решает access до leaf render и сохраняет intended destination.',
        code: `if (!session) {
  authSessionStore.setIntent(intended);
  throw redirect(\`/auth-ux?next=\${encodeURIComponent(intended)}\`);
}

if (session.expiresAt <= Date.now()) {
  const refresh = authSessionStore.refreshSession(source);
  if (!refresh.ok) {
    authSessionStore.setIntent(intended);
    throw redirect(\`/auth-ux?next=\${encodeURIComponent(intended)}&reason=expired\`);
  }
}`,
      },
      {
        label: 'router.tsx',
        note: 'Protected branch живёт как отдельная route subtree и не растворяется в случайных if-проверках внутри виджетов.',
        code: `{
  id: 'protected-branch',
  path: 'protected-workspace',
  loader: protectedBranchLoader,
  element: <ProtectedWorkspacePage />,
  children: [
    {
      id: 'protected-leaf',
      path: ':screenId',
      loader: protectedScreenLoader,
      element: <ProtectedScreenPage />,
    },
  ],
}`,
      },
    ],
  },
  roles: {
    files: [
      {
        path: 'src/lib/auth-domain.ts',
        note: 'Матрица ролей и экраны с `requiredRole` объявлены отдельно от компонентов.',
      },
      {
        path: 'src/lib/auth-runtime.ts',
        note: 'Route loader проверяет роль и бросает локальный 403, если session валидна, но роли не хватает.',
      },
      {
        path: 'src/pages/RoleAccessBoundary.tsx',
        note: 'Route-specific boundary показывает разницу между 403 и обычным logout/401 redirect.',
      },
    ],
    snippets: [
      {
        label: 'auth-runtime.ts',
        note: 'Role gate происходит после проверки сессии и не смешивается с login redirect.',
        code: `if (!canAccessRole(session.role, screen.requiredRole)) {
  throw new Response(
    \`Нужна роль \${screen.requiredRole}, а текущая сессия имеет роль \${session.role}.\`,
    { status: 403, statusText: 'Forbidden' },
  );
}`,
      },
      {
        label: 'RoleAccessBoundary.tsx',
        note: '403 обрабатывается на route уровне и не рушит весь lesson shell.',
        code: `const error = useRouteError();
const session = useSyncExternalStore(
  authSessionStore.subscribe,
  authSessionStore.getSnapshot,
  authSessionStore.getSnapshot,
).session;`,
      },
    ],
  },
  session: {
    files: [
      {
        path: 'src/lib/auth-store.ts',
        note: 'In-memory auth store показывает session snapshot, refresh mode, intended path и audit trail.',
      },
      {
        path: 'src/lib/auth-runtime.ts',
        note: 'Session actions управляют login, expire, refresh-fail и logout в одном учебном сценарии.',
      },
      {
        path: 'src/pages/SessionLifecyclePage.tsx',
        note: 'Лаборатория связана с route action и показывает жизненный цикл токена без лишнего локального шума.',
      },
    ],
    snippets: [
      {
        label: 'auth-store.ts',
        note: 'Refresh и logout меняют единый auth snapshot, который видят и shell, и route loaders.',
        code: `refreshSession(source: string): RefreshResult {
  if (snapshot.nextRefreshMode === 'fail-next') {
    snapshot = {
      ...snapshot,
      session: null,
      nextRefreshMode: 'success',
    };
    return { ok: false, reason: 'refresh-failed' };
  }
}`,
      },
      {
        label: 'SessionLifecyclePage.tsx',
        note: 'Route action получает конкретное session intent и обновляет snapshot через маршрутизаторный submit flow.',
        code: `<Form method="post" className="grid gap-3 md:grid-cols-2">
  <button name="intent" value="expire">Просрочить токен</button>
  <button name="intent" value="refresh">Запустить refresh</button>
</Form>`,
      },
    ],
  },
  ux: {
    files: [
      {
        path: 'src/lib/auth-runtime.ts',
        note: 'Login route sanitizes `next`, сохраняет intent и после входа делает redirect обратно в защищённую ветку.',
      },
      {
        path: 'src/pages/AuthUxPage.tsx',
        note: 'Экран входа показывает preserved intent и несколько personas для разных access сценариев.',
      },
      {
        path: 'src/lib/auth-store.ts',
        note: 'Intent path хранится отдельно от самой session и очищается после успешного входа.',
      },
    ],
    snippets: [
      {
        label: 'auth-runtime.ts',
        note: 'Redirect после входа идёт только на safe internal path.',
        code: `export function resolveSafeNextPath(raw: string | null) {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) {
    return '/protected-workspace/dashboard';
  }

  if (raw.startsWith('/auth-ux')) {
    return '/protected-workspace/dashboard';
  }

  return raw;
}`,
      },
      {
        label: 'auth-runtime.ts',
        note: 'Login action завершает auth flow не локальным state update, а реальным маршрутизаторным redirect.',
        code: `authSessionStore.loginAsPersona(persona.id);
authSessionStore.clearIntent();

return redirect(payload.next || persona.defaultNext);`,
      },
    ],
  },
  architecture: {
    files: [
      {
        path: 'src/lib/auth-runtime.ts',
        note: 'Pure-модель рекомендаций показывает, где auth flow должен жить: в route guard, role gate или локальном слое.',
      },
      {
        path: 'src/pages/ArchitecturePage.tsx',
        note: 'Интерактивный advisor меняет access architecture по признакам сценария.',
      },
      {
        path: 'src/router.tsx',
        note: 'Сам lesson shell тоже показывает, что auth state и route tree связаны, но не должны сливаться в один глобальный if.',
      },
    ],
    snippets: [
      {
        label: 'auth-runtime.ts',
        note: 'Route guard loader рекомендуется там, где access влияет на сам факт входа в экран.',
        code: `if (input.dependsOnRoute && input.blocksScreen && input.mustPreserveIntent) {
  return {
    model: 'Route guard loader',
    score: 94,
  };
}`,
      },
      {
        label: 'ArchitecturePage.tsx',
        note: 'Лаборатория хранит только признаки сценария, а решение вычисляет через pure function.',
        code: `const recommendation = useMemo(
  () => recommendAccessArchitecture(input),
  [input],
);`,
      },
    ],
  },
};
