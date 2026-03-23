import { useLoaderData, useMatches } from 'react-router-dom';

import { ListBlock, StatusPill } from '../components/ui';
import type {
  LoaderBranchLoaderData,
  LoaderLessonLoaderData,
} from '../lib/data-router-runtime';

export function LoaderLessonPage() {
  const data = useLoaderData() as LoaderLessonLoaderData;
  const branchMatch = useMatches().find((item) => item.id === 'loader-branch');
  const branchData = branchMatch?.data as LoaderBranchLoaderData | null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <StatusPill tone="success">{data.lesson.id}</StatusPill>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            {data.lesson.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{data.lesson.summary}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
          child loader: <strong>{data.loadedAt}</strong>
          <br />
          parent loader: <strong>{branchData?.loadedAt ?? 'n/a'}</strong>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ListBlock title="Route data role" items={[data.lesson.routeDataRole]} />
        <ListBlock title="Mutation role" items={[data.lesson.mutationRole]} />
        <ListBlock title="Error role" items={[data.lesson.errorRole]} />
      </div>

      <ListBlock title="Границы и anti-patterns" items={data.lesson.pitfalls} />
    </div>
  );
}
