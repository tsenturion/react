import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router-dom';
import { redirect } from 'react-router-dom';

import {
  authPersonas,
  canAccessRole,
  filterAuthPlaybooksByFocus,
  findProtectedScreen,
  findRoleScreen,
  protectedScreens,
  roleScreens,
  sessionPolicies,
  type AuthFocus,
} from './auth-domain';
import { authSessionStore } from './auth-store';

export type LoginFormInput = {
  personaId: string;
  next: string;
};

export type SessionActionIntent =
  | 'login-member'
  | 'login-editor'
  | 'login-admin'
  | 'expire'
  | 'refresh'
  | 'arm-refresh-failure'
  | 'logout';

export type AccessArchitectureInput = {
  dependsOnRoute: boolean;
  mustPreserveIntent: boolean;
  roleBased: boolean;
  blocksScreen: boolean;
  needsSessionRefresh: boolean;
  affectsSingleWidget: boolean;
  purelyPresentational: boolean;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stamp() {
  return new Date().toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function parseFocus(value: string | null): AuthFocus {
  return value === 'routing' || value === 'roles' || value === 'session' || value === 'ux'
    ? value
    : 'all';
}

// После логина можно редиректить только на внутренние пути проекта.
// Так lesson code показывает, что сохранение намерения связано не только с UX, но и с безопасностью.
export function resolveSafeNextPath(raw: string | null) {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) {
    return '/protected-workspace/dashboard';
  }

  if (raw.startsWith('/auth-ux')) {
    return '/protected-workspace/dashboard';
  }

  return raw;
}

async function requireSession(request: Request, source: string) {
  const url = new URL(request.url);
  const intended = `${url.pathname}${url.search}`;
  let session = authSessionStore.getSnapshot().session;

  if (!session) {
    authSessionStore.setIntent(intended);
    throw redirect(`/auth-ux?next=${encodeURIComponent(intended)}`);
  }

  if (session.expiresAt <= Date.now()) {
    const refresh = authSessionStore.refreshSession(source);

    if (!refresh.ok) {
      authSessionStore.setIntent(intended);
      throw redirect(`/auth-ux?next=${encodeURIComponent(intended)}&reason=expired`);
    }

    session = refresh.session;
  }

  return session;
}

export function recommendAccessArchitecture(input: AccessArchitectureInput) {
  if (input.purelyPresentational) {
    return {
      model: 'Plain compute',
      score: 22,
      rationale: [
        'Если сценарий только меняет текст или визуальный tone без влияния на доступ и навигацию, отдельный auth layer не нужен.',
        'Лишний guard или глобальный auth context здесь только усложнит код.',
      ],
      antiPattern:
        'Не превращайте обычный UI toggle в будто бы “безопасностную” архитектуру без реального доступа.',
    };
  }

  if (input.dependsOnRoute && input.blocksScreen && input.mustPreserveIntent) {
    return {
      model: 'Route guard loader',
      score: 94,
      rationale: [
        'Если экран не имеет смысла без сессии, проверка должна происходить до рендера маршрута.',
        'Loader естественно связывает redirect на login и сохранение intended destination.',
        'Auth logic остаётся рядом с route tree, а не размазывается по leaf-компонентам.',
      ],
      antiPattern:
        'Не откладывайте route-critical access check до useEffect после первого рендера.',
    };
  }

  if (input.roleBased && input.dependsOnRoute) {
    return {
      model: 'Role gate + layout branch',
      score: 91,
      rationale: [
        'Role-sensitive access должен жить рядом с branch или экраном, который реально ограничивается.',
        'Так можно локально показать 403 fallback и не рушить всю защищённую часть приложения.',
      ],
      antiPattern:
        'Не складывайте все роли в один глобальный switch без понимания, где именно проходит граница маршрута.',
    };
  }

  if (input.needsSessionRefresh && input.blocksScreen) {
    return {
      model: 'Server-driven auth + router bridge',
      score: 88,
      rationale: [
        'Когда навигация зависит от живой сессии и refresh logic, маршрутизатор должен уметь встроиться в серверный auth lifecycle.',
        'Protected loaders могут либо продолжить путь после refresh, либо честно вернуть на login.',
      ],
      antiPattern:
        'Не держите refresh токена в случайном widget effect, если от него зависит сам доступ к экрану.',
    };
  }

  if (input.affectsSingleWidget && !input.dependsOnRoute) {
    return {
      model: 'Local widget guard',
      score: 58,
      rationale: [
        'Если ограничение касается только одного локального виджета и не влияет на навигацию, локальный guard допустим.',
        'Так route tree не забирает на себя всё приложение целиком.',
      ],
      antiPattern:
        'Не используйте локальный widget guard для экранов, которые уже должны быть недоступны на route уровне.',
    };
  }

  return {
    model: 'Hybrid auth shell',
    score: 71,
    rationale: [
      'Часть auth state может жить в общем shell, а route guards — только там, где доступ реально влияет на навигацию.',
      'Так приложение не превращается ни в глобальный auth-монолит, ни в хаос из локальных if-проверок.',
    ],
    antiPattern:
      'Не тащите каждый access decision в один универсальный контейнер только ради единообразия.',
  };
}

export async function lessonShellLoader() {
  await wait(80);

  return {
    loadedAt: stamp(),
    totalPlaybooks: filterAuthPlaybooksByFocus('all').length,
    protectedScreens: protectedScreens.length + roleScreens.length,
    personas: authPersonas.length,
  };
}

export async function overviewLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const focus = parseFocus(url.searchParams.get('focus'));
  const cards = filterAuthPlaybooksByFocus(focus);
  const snapshot = authSessionStore.getSnapshot();

  await wait(180);

  return {
    focus,
    cards,
    requestUrl: `${url.pathname}${url.search}`,
    session: snapshot.session,
    loadedAt: stamp(),
  };
}

export async function protectedBranchLoader({ request }: LoaderFunctionArgs) {
  const session = await requireSession(request, 'protected branch loader');

  await wait(150);

  return {
    session,
    screens: protectedScreens,
    branchNotes: [
      'Branch guard loader решает access до leaf render.',
      'Intent path хранится до момента успешного входа.',
      'Просроченная сессия сначала пытается пройти refresh, и только потом ведёт на login.',
    ],
    loadedAt: stamp(),
  };
}

export async function protectedScreenLoader({ params }: LoaderFunctionArgs) {
  await wait(180);

  const screen = findProtectedScreen(params.screenId ?? '');

  if (!screen) {
    throw new Response('Такого protected screen в этой ветке нет.', {
      status: 404,
      statusText: 'Protected Screen Missing',
    });
  }

  return {
    screen,
    loadedAt: stamp(),
  };
}

export async function roleAccessLoader({ params, request }: LoaderFunctionArgs) {
  const screen = findRoleScreen(params.screenId ?? '');

  if (!screen) {
    throw new Response('Такого role-based screen не существует.', {
      status: 404,
      statusText: 'Role Screen Missing',
    });
  }

  const session = await requireSession(request, 'role access loader');

  await wait(190);

  if (!canAccessRole(session.role, screen.requiredRole)) {
    throw new Response(
      `Нужна роль ${screen.requiredRole}, а текущая сессия имеет роль ${session.role}.`,
      {
        status: 403,
        statusText: 'Forbidden',
      },
    );
  }

  return {
    screen,
    session,
    loadedAt: stamp(),
  };
}

export async function sessionLifecycleLoader() {
  await wait(120);

  const snapshot = authSessionStore.getSnapshot();

  return {
    session: snapshot.session,
    intendedPath: snapshot.intendedPath,
    auditTrail: snapshot.auditTrail,
    nextRefreshMode: snapshot.nextRefreshMode,
    policies: sessionPolicies,
    loadedAt: stamp(),
  };
}

export async function sessionLifecycleAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get('intent') ?? '') as SessionActionIntent;

  await wait(120);

  switch (intent) {
    case 'login-member':
      authSessionStore.loginAsPersona('irina-member');
      return {
        ok: true,
        message: 'Создана member session для protected branch демонстрации.',
      };
    case 'login-editor':
      authSessionStore.loginAsPersona('roman-editor');
      return {
        ok: true,
        message: 'Создана editor session для role-based access сценариев.',
      };
    case 'login-admin':
      authSessionStore.loginAsPersona('elena-admin');
      return {
        ok: true,
        message: 'Создана admin session с полным доступом ко всем защищённым веткам.',
      };
    case 'expire':
      authSessionStore.expireSession();
      return {
        ok: true,
        message:
          'Сессия искусственно просрочена. Следующая защищённая навигация столкнётся с refresh logic.',
      };
    case 'refresh': {
      const refresh = authSessionStore.refreshSession('manual session lab');

      return refresh.ok
        ? {
            ok: true,
            message: 'Refresh выполнился успешно и выдал новую access token snapshot.',
          }
        : {
            ok: false,
            message: 'Refresh не выполнен: активной сессии нет или она уже очищена.',
          };
    }
    case 'arm-refresh-failure':
      authSessionStore.armRefreshFailure();
      return {
        ok: true,
        message: 'Следующий refresh принудительно завершится неудачей.',
      };
    case 'logout':
      authSessionStore.logout('ручной logout из лаборатории session lifecycle');
      return {
        ok: true,
        message: 'Сессия очищена. Protected routes снова будут переводить на login.',
      };
    default:
      return {
        ok: false,
        message: 'Неизвестное session действие.',
      };
  }
}

export async function authUxLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const next = resolveSafeNextPath(url.searchParams.get('next'));
  const reason = url.searchParams.get('reason') ?? 'login';

  authSessionStore.setIntent(next);
  await wait(100);

  return {
    next,
    reason,
    personas: authPersonas,
    session: authSessionStore.getSnapshot().session,
    loadedAt: stamp(),
  };
}

export async function authUxAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const payload: LoginFormInput = {
    personaId: String(formData.get('personaId') ?? ''),
    next: resolveSafeNextPath(String(formData.get('next') ?? '')),
  };

  const persona = authPersonas.find((item) => item.id === payload.personaId);

  if (!persona) {
    return {
      ok: false,
      message: 'Выберите одну из доступных auth personas.',
      values: payload,
    };
  }

  await wait(180);

  authSessionStore.loginAsPersona(persona.id);
  authSessionStore.clearIntent();

  return redirect(payload.next || persona.defaultNext);
}

export type LessonShellLoaderData = Awaited<ReturnType<typeof lessonShellLoader>>;
export type OverviewLoaderData = Awaited<ReturnType<typeof overviewLoader>>;
export type ProtectedBranchLoaderData = Awaited<ReturnType<typeof protectedBranchLoader>>;
export type ProtectedScreenLoaderData = Awaited<ReturnType<typeof protectedScreenLoader>>;
export type RoleAccessLoaderData = Awaited<ReturnType<typeof roleAccessLoader>>;
export type SessionLifecycleLoaderData = Awaited<
  ReturnType<typeof sessionLifecycleLoader>
>;
export type SessionLifecycleActionData = Awaited<
  ReturnType<typeof sessionLifecycleAction>
>;
export type AuthUxLoaderData = Awaited<ReturnType<typeof authUxLoader>>;
