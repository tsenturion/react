import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';

import { dataPlaybooks } from '../lib/data-router-domain';

export function LoaderLessonErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="space-y-5 rounded-[24px] border border-rose-200 bg-rose-50 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
          Child route error boundary
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-rose-950">
          Leaf loader упал, но parent branch остался живым
        </h2>
      </div>

      <p className="text-sm leading-6 text-rose-950">
        {isRouteErrorResponse(error)
          ? `${error.status} ${error.statusText}: ${error.data}`
          : error instanceof Error
            ? error.message
            : 'Неизвестная ошибка nested loader branch.'}
      </p>

      <div className="flex flex-wrap gap-2">
        {dataPlaybooks.slice(0, 4).map((item) => (
          <Link
            key={item.id}
            to={`/loader-tree/${item.id}`}
            className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-rose-700"
          >
            {item.id}
          </Link>
        ))}
      </div>
    </div>
  );
}
