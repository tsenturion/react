import { Link } from 'react-router-dom';

import { useSession } from '../lib/auth-store';

export function NotFoundPage() {
  const session = useSession();

  return (
    <div className="route-error-shell">
      <div className="route-error-card">
        <p className="eyebrow">404</p>
        <h1>Маршрут не найден</h1>
        <p>Такой страницы нет. Вернитесь в защищённую рабочую зону или на экран входа.</p>
        <Link className="button" to={session ? '/app/dashboard' : '/login'}>
          Открыть рабочий экран
        </Link>
      </div>
    </div>
  );
}
