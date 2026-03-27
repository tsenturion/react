import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { createAppQueryClient } from './query-client';
import { createAppRouter } from '../router';

const queryClient = createAppQueryClient();

export const appRouter = createAppRouter(queryClient);

export function appProviders(children: ReactNode) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
