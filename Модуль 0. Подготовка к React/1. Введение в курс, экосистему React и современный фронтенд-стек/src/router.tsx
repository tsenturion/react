import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AppLayout, labs } from './App';

// Маршруты вынесены отдельно от layout, чтобы в коде было явно видно:
// React Router управляет URL и подставляет нужную лабораторию через общий shell.
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={labs[0].path} replace />,
      },
      ...labs.map((lab) => {
        const Component = lab.component;

        return {
          path: lab.path.slice(1),
          element: <Component />,
        };
      }),
      {
        path: '*',
        element: <Navigate to={labs[0].path} replace />,
      },
    ],
  },
]);
