import { useLoaderData, useMatches } from 'react-router-dom';

import { ListBlock, StatusPill } from '../components/ui';
import type {
  ProtectedBranchLoaderData,
  ProtectedScreenLoaderData,
} from '../lib/auth-runtime';

export function ProtectedScreenPage() {
  const data = useLoaderData() as ProtectedScreenLoaderData;
  const branchMatch = useMatches().find((item) => item.id === 'protected-branch');
  const branchData = branchMatch?.data as ProtectedBranchLoaderData | null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <StatusPill tone="success">{data.screen.requiredRole}</StatusPill>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            {data.screen.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{data.screen.summary}</p>
        </div>

        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
          leaf loader: <strong>{data.loadedAt}</strong>
          <br />
          parent loader: <strong>{branchData?.loadedAt ?? 'n/a'}</strong>
        </div>
      </div>

      <ListBlock title="Почему экран защищён" items={[data.screen.whyProtected]} />
      <ListBlock title="Allowed roles" items={data.screen.allowedRoles} />
      <ListBlock title="Типичные ошибки" items={data.screen.pitfalls} />
    </div>
  );
}
