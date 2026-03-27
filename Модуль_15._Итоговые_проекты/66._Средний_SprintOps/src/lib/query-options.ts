import { queryOptions, type QueryClient } from '@tanstack/react-query';

import {
  fetchActivityFeed,
  fetchDashboardSnapshot,
  fetchIncidentById,
  fetchIncidents,
  fetchTeamLoad,
} from './mock-api';

export const queryKeys = {
  dashboard: ['dashboard', 'snapshot'] as const,
  activity: ['dashboard', 'activity'] as const,
  team: ['dashboard', 'team'] as const,
  incidents: ['incidents', 'list'] as const,
  incidentDetail: (incidentId: string) => ['incidents', 'detail', incidentId] as const,
};

export function dashboardQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.dashboard,
    queryFn: ({ signal }) => fetchDashboardSnapshot({ signal }),
  });
}

export function activityQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.activity,
    queryFn: ({ signal }) => fetchActivityFeed({ signal }),
  });
}

export function teamQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.team,
    queryFn: ({ signal }) => fetchTeamLoad({ signal }),
  });
}

export function incidentsQueryOptions() {
  return queryOptions({
    queryKey: queryKeys.incidents,
    queryFn: ({ signal }) => fetchIncidents({ signal }),
  });
}

export function incidentDetailQueryOptions(incidentId: string) {
  return queryOptions({
    queryKey: queryKeys.incidentDetail(incidentId),
    queryFn: ({ signal }) => fetchIncidentById(incidentId, { signal }),
  });
}

export async function prefetchDashboard(queryClient: QueryClient) {
  await Promise.all([
    queryClient.ensureQueryData(dashboardQueryOptions()),
    queryClient.ensureQueryData(activityQueryOptions()),
    queryClient.ensureQueryData(teamQueryOptions()),
  ]);
}

export async function prefetchIncidentDetail(
  queryClient: QueryClient,
  incidentId: string,
) {
  await queryClient.ensureQueryData(incidentDetailQueryOptions(incidentId));
}
