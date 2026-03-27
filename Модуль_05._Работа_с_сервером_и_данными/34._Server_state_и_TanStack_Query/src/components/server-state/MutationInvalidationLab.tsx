import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';

import { useCatalogQuery, useSummaryQuery } from '../../hooks/useCatalogQueries';
import { createDraftLessonOnServer, publishLessonOnServer } from '../../lib/fake-server';
import type { LessonTrack } from '../../lib/server-state-domain';
import { serverStateKeys } from '../../query/query-keys';
import { LessonCatalogView } from './LessonCatalogView';

export function MutationInvalidationLab() {
  const queryClient = useQueryClient();
  const catalogQuery = useCatalogQuery('mutation-board', 'all', 15_000);
  const summaryQuery = useSummaryQuery('mutation-board', 15_000);
  const [title, setTitle] = useState('Server state checklist');
  const [track, setTrack] = useState<LessonTrack>('state');

  const createDraftMutation = useMutation({
    mutationFn: () =>
      createDraftLessonOnServer({
        resource: 'mutation-board',
        title,
        track,
      }),
    onSuccess: async () => {
      // После server mutation меняется не только список, но и summary.
      // InvalidateQueries здесь честнее, чем вручную переписывать все связанные кэши.
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: serverStateKeys.catalogRoot('mutation-board'),
        }),
        queryClient.invalidateQueries({
          queryKey: serverStateKeys.summary('mutation-board'),
        }),
      ]);
      setTitle('Server state checklist');
    },
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) =>
      publishLessonOnServer({
        resource: 'mutation-board',
        id,
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: serverStateKeys.catalogRoot('mutation-board'),
        }),
        queryClient.invalidateQueries({
          queryKey: serverStateKeys.summary('mutation-board'),
        }),
      ]);
    },
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || createDraftMutation.isPending || publishMutation.isPending) {
      return;
    }

    createDraftMutation.mutate();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-slate-200 bg-slate-50 p-5"
        >
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Новый lesson draft
              </span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Track</span>
              <select
                value={track}
                onChange={(event) => setTrack(event.target.value as LessonTrack)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400"
              >
                <option value="foundations">foundations</option>
                <option value="state">state</option>
                <option value="effects">effects</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={createDraftMutation.isPending || publishMutation.isPending}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            Create draft via mutation
          </button>
        </form>

        {catalogQuery.data ? (
          <LessonCatalogView
            items={catalogQuery.data.items}
            onPublish={(id) => publishMutation.mutate(id)}
            disabled={createDraftMutation.isPending || publishMutation.isPending}
          />
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Summary query
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              Drafts: <strong>{summaryQuery.data?.draftCount ?? '—'}</strong>
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              Published: <strong>{summaryQuery.data?.publishedCount ?? '—'}</strong>
            </li>
            <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              Seats: <strong>{summaryQuery.data?.totalSeats ?? '—'}</strong>
            </li>
          </ul>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600">
          `useMutation` сам не знает, какие query keys устарели после server change.
          Поэтому архитектура мутаций всегда включает решение об invalidation.
        </div>
      </div>
    </div>
  );
}
