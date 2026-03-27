import type { QueryClient } from '@tanstack/react-query';
import { createBrowserRouter, redirect, type LoaderFunctionArgs } from 'react-router-dom';

import { AppShell } from './components/AppShell';
import { RouteErrorBoundary } from './components/RouteErrorBoundary';
import { authStore, getCurrentSession } from './lib/auth-store';
import { dashboardQueryOptions, prefetchIncidentDetail } from './lib/query-options';
import { sanitizeRedirectPath } from './lib/utils';
import { DashboardPage } from './pages/DashboardPage';
import { IncidentDetailsPage } from './pages/IncidentDetailsPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function homeLoader() {
  throw redirect(getCurrentSession() ? '/app/dashboard' : '/login');
}

export function loginLoader({ request }: LoaderFunctionArgs) {
  const session = getCurrentSession();
  if (!session) {
    return null;
  }

  const url = new URL(request.url);
  throw redirect(sanitizeRedirectPath(url.searchParams.get('redirect')));
}

export function protectedLoader({ request }: LoaderFunctionArgs) {
  const session = authStore.getSnapshot().session;
  if (session) {
    return { session };
  }

  const url = new URL(request.url);
  const redirectTo = encodeURIComponent(`${url.pathname}${url.search}`);
  throw redirect(`/login?redirect=${redirectTo}`);
}

function dashboardLoader(queryClient: QueryClient) {
  return async () => {
    await queryClient.ensureQueryData(dashboardQueryOptions());
    return null;
  };
}

function incidentDetailLoader(queryClient: QueryClient) {
  return async ({ params }: LoaderFunctionArgs) => {
    const incidentId = params.incidentId;

    if (!incidentId) {
      throw new Response('Router не получил id карточки.', { status: 404 });
    }

    await prefetchIncidentDetail(queryClient, incidentId);
    return { incidentId };
  };
}

export function createAppRouter(queryClient: QueryClient) {
  return createBrowserRouter([
    {
      path: '/',
      loader: homeLoader,
    },
    {
      path: '/login',
      loader: loginLoader,
      element: <LoginPage />,
      errorElement: <RouteErrorBoundary backTo="/login" />,
    },
    {
      path: '/app',
      loader: protectedLoader,
      element: <AppShell />,
      errorElement: <RouteErrorBoundary backTo="/app/dashboard" />,
      children: [
        {
          index: true,
          loader: () => redirect('/app/dashboard'),
        },
        {
          path: 'dashboard',
          loader: dashboardLoader(queryClient),
          element: <DashboardPage />,
        },
        {
          path: 'incidents',
          element: <IncidentsPage />,
        },
        {
          path: 'incidents/:incidentId',
          loader: incidentDetailLoader(queryClient),
          element: <IncidentDetailsPage />,
          errorElement: <RouteErrorBoundary backTo="/app/incidents" />,
        },
        {
          path: '*',
          element: <NotFoundPage />,
        },
      ],
    },
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ]);
}
