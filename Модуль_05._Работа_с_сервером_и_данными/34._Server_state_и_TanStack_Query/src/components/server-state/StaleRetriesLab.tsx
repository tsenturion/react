import clsx from 'clsx';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { useHealthSnapshotQuery } from '../../hooks/useHealthSnapshotQuery';
import { advanceHealthVersion, peekServerDiagnostics } from '../../lib/fake-server';
import { getFreshnessProfile } from '../../lib/freshness-profile-model';
import type { FreshnessProfileId } from '../../lib/server-state-domain';
import { serverStateKeys } from '../../query/query-keys';

export function StaleRetriesLab() {
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState<FreshnessProfileId>('balanced');
  const [failBeforeSuccess, setFailBeforeSuccess] = useState(1);
  const [serverTick, setServerTick] = useState(0);
  const query = useHealthSnapshotQuery(profile, failBeforeSuccess);
  const profileConfig = getFreshnessProfile(profile);
  const backendVersion = peekServerDiagnostics().healthVersion;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(['aggressive', 'balanced', 'resilient'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setProfile(value)}
                  className={clsx(
                    'rounded-xl px-4 py-2 text-sm font-medium transition',
                    profile === value
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-100',
                  )}
                >
                  {value}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {[0, 1, 2].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFailBeforeSuccess(value)}
                  className={clsx(
                    'rounded-xl px-4 py-2 text-sm font-medium transition',
                    failBeforeSuccess === value
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-100',
                  )}
                >
                  failBeforeSuccess = {value}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  advanceHealthVersion();
                  setServerTick((current) => current + 1);
                }}
                className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Сервер меняет snapshot
              </button>
              <button
                type="button"
                onClick={() =>
                  void queryClient.invalidateQueries({
                    queryKey: serverStateKeys.health(profile, failBeforeSuccess),
                  })
                }
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Invalidate query
              </button>
              <button
                type="button"
                onClick={() => void query.refetch()}
                className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Refetch now
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Profile
          </p>
          <p className="mt-3 text-lg font-semibold tracking-tight text-slate-950">
            {profileConfig.label}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{profileConfig.hint}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
              staleTime: <strong>{profileConfig.staleTimeMs}ms</strong>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
              retry: <strong>{profileConfig.retryCount}</strong>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
              failureCount: <strong>{query.failureCount}</strong>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700">
          <p>
            Cached version: <strong>{query.data?.meta.serverVersion ?? '—'}</strong>
          </p>
          <p>
            Backend version: <strong>{backendVersion}</strong>
          </p>
          <p>
            Request no: <strong>{query.data?.meta.requestNo ?? '—'}</strong>
          </p>
          <p>
            Attempt: <strong>{query.data?.meta.attempt ?? '—'}</strong>
          </p>
          <p className="mt-3 text-slate-600">
            {query.data?.note ??
              (query.error instanceof Error
                ? query.error.message
                : 'Запустите запрос или измените strategy.')}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Query state
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              status: <strong>{query.status}</strong>
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              isFetching: <strong>{String(query.isFetching)}</strong>
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              serverTick: <strong>{serverTick}</strong>
            </li>
          </ul>
        </div>

        <div className="rounded-[24px] border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          Server state может быть одновременно успешным и stale. Именно поэтому query
          layer держит не только `data`, но и meta about freshness, fetching и retries.
        </div>
      </div>
    </div>
  );
}
