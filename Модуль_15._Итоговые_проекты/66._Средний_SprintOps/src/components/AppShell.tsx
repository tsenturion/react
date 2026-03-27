import clsx from 'clsx';
import { useQueryClient } from '@tanstack/react-query';
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useNavigation,
} from 'react-router-dom';

import { roleLabels } from '../lib/incidents-domain';
import { authStore, useSession } from '../lib/auth-store';

const navItems = [
  {
    to: '/app/dashboard',
    label: 'Dashboard',
    blurb: 'KPI, activity, team load',
  },
  {
    to: '/app/incidents',
    label: 'Incidents',
    blurb: 'CRUD, optimistic updates, filters',
  },
];

export function AppShell() {
  const session = useSession();
  const location = useLocation();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const routeStamp = navigation.location?.pathname ?? location.pathname;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-card">
          <span className="brand-mark">SO</span>
          <div>
            <p className="eyebrow">Protected workspace</p>
            <h1>SprintOps</h1>
          </div>
        </div>

        <p className="sidebar-copy">
          Панель операционной команды с auth flow, router guards, server state и
          устойчивыми виджетами.
        </p>

        <nav className="sidebar-nav" aria-label="Основная навигация">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx('nav-card', isActive && 'nav-card--active')
              }
            >
              <strong>{item.label}</strong>
              <span>{item.blurb}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-panel">
          <p className="panel-kicker">Session</p>
          <h2>{session?.name ?? 'Unknown user'}</h2>
          <p>
            {session ? `${session.email} · ${roleLabels[session.role]}` : 'Нет данных'}
          </p>
        </div>

        <div className="sidebar-panel">
          <p className="panel-kicker">Router state</p>
          <h2>{navigation.state === 'idle' ? 'Idle' : 'Navigating'}</h2>
          <p>{routeStamp}</p>
        </div>

        <button
          type="button"
          className="button button--secondary button--full"
          onClick={() => {
            authStore.logout();
            queryClient.clear();
            void navigate('/login', { replace: true });
          }}
        >
          Выйти
        </button>
      </aside>

      <div className="workspace">
        <header className="workspace-header">
          <div>
            <p className="eyebrow">Server-driven operations desk</p>
            <h2>Auth, data and UI resilience работают как одна система</h2>
          </div>
          <div className="workspace-status">
            <span
              className={clsx(
                'pulse-dot',
                navigation.state !== 'idle' && 'pulse-dot--busy',
              )}
            />
            {navigation.state === 'idle'
              ? 'Все маршруты стабильны'
              : 'Роутер меняет экран'}
          </div>
        </header>

        {navigation.state !== 'idle' ? <div className="route-progress" /> : null}

        <main className="workspace-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
