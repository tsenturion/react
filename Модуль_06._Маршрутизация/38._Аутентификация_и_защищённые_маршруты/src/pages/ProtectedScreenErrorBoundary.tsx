import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';

export function ProtectedScreenErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="space-y-5 rounded-[24px] border border-rose-200 bg-rose-50 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
          Protected leaf error
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-rose-950">
          Защищённая ветка жива, но конкретный leaf screen не найден
        </h2>
      </div>

      <p className="text-sm leading-6 text-rose-950">
        {isRouteErrorResponse(error)
          ? `${error.status} ${error.statusText}: ${error.data}`
          : error instanceof Error
            ? error.message
            : 'Неизвестная ошибка protected leaf.'}
      </p>

      <div className="flex flex-wrap gap-2">
        <Link
          to="/protected-workspace/dashboard"
          className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-rose-700"
        >
          dashboard
        </Link>
        <Link
          to="/protected-workspace/roadmap"
          className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-rose-700"
        >
          roadmap
        </Link>
      </div>
    </div>
  );
}
