import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  buildDashboardSummary,
  buildTeamLoad,
  makeTemporaryIncident,
  sortIncidents,
} from '../../lib/incidents-domain';
import {
  createIncident,
  deleteIncident,
  updateIncident,
  type ApiError,
} from '../../lib/mock-api';
import { queryKeys } from '../../lib/query-options';
import type {
  CreateIncidentPayload,
  DashboardSnapshot,
  Incident,
  TeamLoadItem,
  UpdateIncidentPayload,
} from '../../lib/types';

interface CacheContext {
  previousIncidents?: Incident[];
  previousDashboard?: DashboardSnapshot;
  previousTeam?: TeamLoadItem[];
  previousDetail?: Incident;
  temporaryId?: string;
}

function applyIncidentCollection(
  queryClient: ReturnType<typeof useQueryClient>,
  incidents: Incident[],
) {
  const sorted = sortIncidents(incidents);
  queryClient.setQueryData(queryKeys.incidents, sorted);
  queryClient.setQueryData(queryKeys.dashboard, {
    summary: buildDashboardSummary(sorted),
    syncedAt: new Date().toISOString(),
  });
  queryClient.setQueryData(queryKeys.team, buildTeamLoad(sorted));
}

function rollbackCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  context?: CacheContext,
  incidentId?: string,
) {
  if (!context) {
    return;
  }

  if (context.previousIncidents) {
    queryClient.setQueryData(queryKeys.incidents, context.previousIncidents);
  }

  if (context.previousDashboard) {
    queryClient.setQueryData(queryKeys.dashboard, context.previousDashboard);
  }

  if (context.previousTeam) {
    queryClient.setQueryData(queryKeys.team, context.previousTeam);
  }

  if (incidentId && context.previousDetail) {
    queryClient.setQueryData(
      queryKeys.incidentDetail(incidentId),
      context.previousDetail,
    );
  }
}

async function cancelRelevantQueries(queryClient: ReturnType<typeof useQueryClient>) {
  await Promise.all([
    queryClient.cancelQueries({ queryKey: queryKeys.incidents }),
    queryClient.cancelQueries({ queryKey: queryKeys.dashboard }),
    queryClient.cancelQueries({ queryKey: queryKeys.team }),
  ]);
}

export function useCreateIncidentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIncident,
    onMutate: async (payload: CreateIncidentPayload) => {
      await cancelRelevantQueries(queryClient);

      const previousIncidents =
        queryClient.getQueryData<Incident[]>(queryKeys.incidents) ?? [];
      const previousDashboard = queryClient.getQueryData<DashboardSnapshot>(
        queryKeys.dashboard,
      );
      const previousTeam = queryClient.getQueryData<TeamLoadItem[]>(queryKeys.team);
      const temporaryId = `temp-${Date.now()}`;

      const optimisticIncident = makeTemporaryIncident({
        id: temporaryId,
        title: payload.title,
        service: payload.service,
        owner: payload.owner,
        priority: payload.priority,
        description: payload.description,
      });

      applyIncidentCollection(queryClient, [optimisticIncident, ...previousIncidents]);

      return {
        previousIncidents,
        previousDashboard,
        previousTeam,
        temporaryId,
      } satisfies CacheContext;
    },
    onError: (_error: ApiError, _payload, context) => {
      rollbackCaches(queryClient, context);
    },
    onSuccess: (createdIncident, _payload, context) => {
      const current = queryClient.getQueryData<Incident[]>(queryKeys.incidents) ?? [];
      const next = current.filter((item) => item.id !== context?.temporaryId);
      applyIncidentCollection(queryClient, [createdIncident, ...next]);
      queryClient.setQueryData(
        queryKeys.incidentDetail(createdIncident.id),
        createdIncident,
      );
    },
    onSettled: () => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.incidents }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard }),
        queryClient.invalidateQueries({ queryKey: queryKeys.team }),
        queryClient.invalidateQueries({ queryKey: queryKeys.activity }),
      ]);
    },
  });
}

export function useUpdateIncidentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { incidentId: string; patch: UpdateIncidentPayload }) =>
      updateIncident(payload.incidentId, payload.patch),
    onMutate: async ({ incidentId, patch }) => {
      await cancelRelevantQueries(queryClient);

      const previousIncidents =
        queryClient.getQueryData<Incident[]>(queryKeys.incidents) ?? [];
      const previousDashboard = queryClient.getQueryData<DashboardSnapshot>(
        queryKeys.dashboard,
      );
      const previousTeam = queryClient.getQueryData<TeamLoadItem[]>(queryKeys.team);
      const previousDetail = queryClient.getQueryData<Incident>(
        queryKeys.incidentDetail(incidentId),
      );
      const baseIncident =
        previousDetail ?? previousIncidents.find((item) => item.id === incidentId);

      if (!baseIncident) {
        return {
          previousIncidents,
          previousDashboard,
          previousTeam,
          previousDetail,
        } satisfies CacheContext;
      }

      const optimisticIncident: Incident = {
        ...baseIncident,
        ...patch,
        updatedAt: new Date().toISOString(),
      };

      const nextIncidents = previousIncidents.some((item) => item.id === incidentId)
        ? previousIncidents.map((item) =>
            item.id === incidentId ? optimisticIncident : item,
          )
        : previousIncidents;

      applyIncidentCollection(queryClient, nextIncidents);
      queryClient.setQueryData(queryKeys.incidentDetail(incidentId), optimisticIncident);

      return {
        previousIncidents,
        previousDashboard,
        previousTeam,
        previousDetail,
      } satisfies CacheContext;
    },
    onError: (_error: ApiError, variables, context) => {
      rollbackCaches(queryClient, context, variables.incidentId);
    },
    onSuccess: (updatedIncident) => {
      const current = queryClient.getQueryData<Incident[]>(queryKeys.incidents) ?? [];
      const next = current.some((item) => item.id === updatedIncident.id)
        ? current.map((item) => (item.id === updatedIncident.id ? updatedIncident : item))
        : current;

      applyIncidentCollection(queryClient, next);
      queryClient.setQueryData(
        queryKeys.incidentDetail(updatedIncident.id),
        updatedIncident,
      );
    },
    onSettled: (_result, _error, variables) => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.incidents }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard }),
        queryClient.invalidateQueries({ queryKey: queryKeys.team }),
        queryClient.invalidateQueries({ queryKey: queryKeys.activity }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.incidentDetail(variables.incidentId),
        }),
      ]);
    },
  });
}

export function useDeleteIncidentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ incidentId }: { incidentId: string }) => deleteIncident(incidentId),
    onMutate: async ({ incidentId }) => {
      await cancelRelevantQueries(queryClient);

      const previousIncidents =
        queryClient.getQueryData<Incident[]>(queryKeys.incidents) ?? [];
      const previousDashboard = queryClient.getQueryData<DashboardSnapshot>(
        queryKeys.dashboard,
      );
      const previousTeam = queryClient.getQueryData<TeamLoadItem[]>(queryKeys.team);
      const previousDetail = queryClient.getQueryData<Incident>(
        queryKeys.incidentDetail(incidentId),
      );

      applyIncidentCollection(
        queryClient,
        previousIncidents.filter((item) => item.id !== incidentId),
      );
      queryClient.removeQueries({
        queryKey: queryKeys.incidentDetail(incidentId),
        exact: true,
      });

      return {
        previousIncidents,
        previousDashboard,
        previousTeam,
        previousDetail,
      } satisfies CacheContext;
    },
    onError: (_error: ApiError, variables, context) => {
      rollbackCaches(queryClient, context, variables.incidentId);
    },
    onSettled: (_result, _error, variables) => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.incidents }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard }),
        queryClient.invalidateQueries({ queryKey: queryKeys.team }),
        queryClient.invalidateQueries({ queryKey: queryKeys.activity }),
        queryClient.removeQueries({
          queryKey: queryKeys.incidentDetail(variables.incidentId),
          exact: true,
        }),
      ]);
    },
  });
}
