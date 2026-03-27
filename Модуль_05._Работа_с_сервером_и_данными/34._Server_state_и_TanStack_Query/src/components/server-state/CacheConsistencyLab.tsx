import clsx from 'clsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { useCatalogQuery, useSummaryQuery } from '../../hooks/useCatalogQueries';
import { evaluateConsistencyPlan } from '../../lib/consistency-model';
import { publishLessonOnServer } from '../../lib/fake-server';
import type { ConsistencyScope } from '../../lib/server-state-domain';
import { serverStateKeys } from '../../query/query-keys';
import { LessonCatalogView } from './LessonCatalogView';

export function CacheConsistencyLab() {
  const queryClient = useQueryClient();
  const [scope, setScope] = useState<ConsistencyScope>('catalog-only');
  const plan = evaluateConsistencyPlan(scope);
  const catalogQuery = useCatalogQuery('consistency-board', 'all', 60_000);
  const summaryQuery = useSummaryQuery('consistency-board', 60_000);

  const publishMutation = useMutation({
    mutationFn: (id: string) =>
      publishLessonOnServer({
        resource: 'consistency-board',
        id,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: serverStateKeys.catalogRoot('consistency-board'),
      });

      if (scope === 'catalog-and-summary') {
        await queryClient.invalidateQueries({
          queryKey: serverStateKeys.summary('consistency-board'),
        });
      }
    },
  });

  const actualPublished =
    catalogQuery.data?.items.filter((item) => item.status === 'published').length ?? 0;
  const cachedPublished = summaryQuery.data?.publishedCount ?? 0;
  const driftDetected =
    catalogQuery.data && summaryQuery.data ? actualPublished !== cachedPublished : false;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-wrap gap-2">
            {(['catalog-only', 'catalog-and-summary'] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setScope(value)}
                className={clsx(
                  'rounded-xl px-4 py-2 text-sm font-medium transition',
                  scope === value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100',
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        {catalogQuery.data ? (
          <LessonCatalogView
            items={catalogQuery.data.items}
            onPublish={(id) => publishMutation.mutate(id)}
            disabled={publishMutation.isPending}
          />
        ) : null}

        {driftDetected ? (
          <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-950">
            Summary cache уже расходится со списком: cached published count ={' '}
            <strong>{cachedPublished}</strong>, а фактический список показывает{' '}
            <strong>{actualPublished}</strong>.
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Consistency plan
          </p>
          <p className="mt-3 text-lg font-semibold tracking-tight text-slate-950">
            {plan.status}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">{plan.explanation}</p>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700">
          <p>
            Cached summary: <strong>{cachedPublished}</strong>
          </p>
          <p>
            Actual published in list: <strong>{actualPublished}</strong>
          </p>
          <p className="mt-3 text-slate-600">{plan.antiPattern}</p>
        </div>
      </div>
    </div>
  );
}
