import clsx from 'clsx';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

import { routingModules } from '../../lib/routing-domain';
import {
  getWorkspaceRows,
  patchSearchParams,
  resolveWorkspaceUrlState,
} from '../../lib/url-state-model';

const presets = [
  {
    label: 'outline / all / progress',
    href: '/url-state?tab=outline&status=all&sort=progress',
  },
  {
    label: 'activity / in-progress / title',
    href: '/url-state?tab=activity&status=in-progress&sort=title',
  },
  {
    label: 'notes / done / progress',
    href: '/url-state?tab=notes&status=done&sort=progress',
  },
] as const;

export function UrlStateWorkbench() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const state = resolveWorkspaceUrlState(searchParams);
  const rows = getWorkspaceRows(routingModules, state);

  const updateQuery = (patch: Record<string, string>) => {
    setSearchParams(patchSearchParams(searchParams, patch));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <div className="grid gap-4 lg:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-slate-700">Tab</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(['outline', 'activity', 'notes'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => updateQuery({ tab })}
                    className={clsx(
                      'rounded-full px-4 py-2 text-sm font-semibold transition',
                      state.tab === tab
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-100',
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700">Status</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(['all', 'todo', 'in-progress', 'done'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => updateQuery({ status })}
                    className={clsx(
                      'rounded-full px-4 py-2 text-sm font-semibold transition',
                      state.status === status
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-100',
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Sort</span>
              <select
                value={state.sort}
                onChange={(event) => updateQuery({ sort: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400"
              >
                <option value="progress">progress</option>
                <option value="title">title</option>
              </select>
            </label>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Deep link presets
          </p>
          <div className="mt-4 space-y-2">
            {presets.map((preset) => (
              <Link
                key={preset.href}
                to={preset.href}
                className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                {preset.label}
              </Link>
            ))}
          </div>
          <code className="mt-4 block rounded-2xl bg-slate-950 px-4 py-3 text-xs leading-6 text-slate-100 break-all">
            {location.pathname}
            {location.search || '?tab=outline&status=all&sort=progress'}
          </code>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {rows.map((row) => (
          <article
            key={row.id}
            className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{row.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{row.tone}</p>
              </div>
              <Link
                to={`/entities/${row.id}?tab=overview&panel=summary`}
                className="rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700"
              >
                Открыть entity route
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
