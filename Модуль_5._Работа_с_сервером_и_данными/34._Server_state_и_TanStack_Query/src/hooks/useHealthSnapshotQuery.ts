import { useQuery } from '@tanstack/react-query';

import { fetchHealthSnapshot } from '../lib/fake-server';
import { getFreshnessProfile } from '../lib/freshness-profile-model';
import type { FreshnessProfileId } from '../lib/server-state-domain';
import { serverStateKeys } from '../query/query-keys';

export function useHealthSnapshotQuery(
  profile: FreshnessProfileId,
  failBeforeSuccess: number,
) {
  const freshnessProfile = getFreshnessProfile(profile);

  return useQuery({
    queryKey: serverStateKeys.health(profile, failBeforeSuccess),
    queryFn: ({ signal }) => fetchHealthSnapshot({ profile, failBeforeSuccess, signal }),
    staleTime: freshnessProfile.staleTimeMs,
    retry: freshnessProfile.retryCount,
  });
}
