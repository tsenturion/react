import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';

export function ErrorRouteBoundary() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}: ${error.data}`
    : error instanceof Error
      ? error.message
      : 'Неизвестная route error.';

  return (
    <div className="space-y-5 rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-rose-950">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
          errorElement текущего маршрута
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Ошибка локализована внутри route branch
        </h2>
      </div>

      <p className="text-sm leading-6">{message}</p>

      <div className="flex flex-wrap gap-2">
        <Link
          to="/error-routes/stable"
          className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-rose-700"
        >
          Вернуться в stable mode
        </Link>
        <Link
          to="/data-router-overview?track=errors"
          className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-rose-700"
        >
          Открыть error playbooks
        </Link>
      </div>
    </div>
  );
}
