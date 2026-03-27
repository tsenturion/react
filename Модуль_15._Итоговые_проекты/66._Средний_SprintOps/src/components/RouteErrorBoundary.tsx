import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

export function RouteErrorBoundary({ backTo = '/app/dashboard' }: { backTo?: string }) {
  const error = useRouteError();

  let title = 'Маршрут недоступен';
  let message = 'Попробуйте вернуться к рабочему экрану и повторить действие.';

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    message =
      typeof error.data === 'string'
        ? error.data
        : 'Router поймал ошибку на уровне маршрута и изолировал её от остального приложения.';
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="route-error-shell">
      <div className="route-error-card">
        <p className="eyebrow">Route boundary</p>
        <h1>{title}</h1>
        <p>{message}</p>
        <Link className="button" to={backTo}>
          Вернуться в приложение
        </Link>
      </div>
    </div>
  );
}
