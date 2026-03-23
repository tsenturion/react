import { useSyncExternalStore } from 'react';
import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { authSessionStore } from '../lib/auth-store';

export function RoleAccessBoundary() {
  const error = useRouteError();
  const snapshot = useSyncExternalStore(
    authSessionStore.subscribe,
    authSessionStore.getSnapshot,
    authSessionStore.getSnapshot,
  );

  return (
    <div className="space-y-5 rounded-[28px] border border-amber-300 bg-amber-50 p-6 text-amber-950">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
          Role boundary
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Маршрут отклонил доступ на уровне роли
        </h2>
      </div>

      <p className="text-sm leading-6">
        {isRouteErrorResponse(error)
          ? `${error.status} ${error.statusText}: ${error.data}`
          : error instanceof Error
            ? error.message
            : 'Неизвестная ошибка role gate.'}
      </p>

      <p className="text-sm leading-6">
        Текущая сессия:{' '}
        <strong>
          {snapshot.session
            ? `${snapshot.session.displayName} (${snapshot.session.role})`
            : 'нет'}
        </strong>
      </p>

      <div className="flex flex-wrap gap-2">
        <Link
          to="/session-lifecycle"
          className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-amber-700"
        >
          Открыть session lifecycle
        </Link>
        <Link
          to="/auth-ux?next=/role-access/admin-panel"
          className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-amber-700"
        >
          Сменить сессию через login
        </Link>
      </div>
    </div>
  );
}
