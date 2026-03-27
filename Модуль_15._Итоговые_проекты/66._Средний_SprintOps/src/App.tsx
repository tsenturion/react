import { RouterProvider } from 'react-router-dom';

import { appProviders, appRouter } from './app/providers';

export function App() {
  return appProviders(<RouterProvider router={appRouter} />);
}
