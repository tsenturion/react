import type {
  CatalogResource,
  CatalogScope,
  FreshnessProfileId,
} from '../lib/server-state-domain';

export const serverStateKeys = {
  all: ['server-state'] as const,
  catalogRoot: (resource: CatalogResource) =>
    [...serverStateKeys.all, 'catalog', resource] as const,
  catalog: (resource: CatalogResource, scope: CatalogScope) =>
    [...serverStateKeys.catalogRoot(resource), scope] as const,
  summary: (resource: CatalogResource) =>
    [...serverStateKeys.all, 'summary', resource] as const,
  health: (profile: FreshnessProfileId, failBeforeSuccess: number) =>
    [...serverStateKeys.all, 'health', profile, failBeforeSuccess] as const,
};
