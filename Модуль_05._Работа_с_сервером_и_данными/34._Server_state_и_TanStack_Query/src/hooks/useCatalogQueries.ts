import { useQuery } from '@tanstack/react-query';

import { fetchCatalogSummary, fetchLessonCatalog } from '../lib/fake-server';
import type { CatalogResource, CatalogScope } from '../lib/server-state-domain';
import { serverStateKeys } from '../query/query-keys';

export function useCatalogQuery(
  resource: CatalogResource,
  scope: CatalogScope = 'all',
  staleTime = 8_000,
) {
  return useQuery({
    queryKey: serverStateKeys.catalog(resource, scope),
    queryFn: ({ signal }) => fetchLessonCatalog({ resource, scope, signal }),
    staleTime,
  });
}

export function useSummaryQuery(resource: CatalogResource, staleTime = 8_000) {
  return useQuery({
    queryKey: serverStateKeys.summary(resource),
    queryFn: ({ signal }) => fetchCatalogSummary({ resource, signal }),
    staleTime,
  });
}
