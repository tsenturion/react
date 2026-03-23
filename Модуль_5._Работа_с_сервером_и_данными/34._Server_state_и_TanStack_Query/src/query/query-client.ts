import { QueryClient } from '@tanstack/react-query';

// Один QueryClient на всё приложение даёт единый cache layer.
// Именно он превращает "просто fetch" в отдельный архитектурный слой
// с политикой staleTime, retry и invalidation.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 4_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
