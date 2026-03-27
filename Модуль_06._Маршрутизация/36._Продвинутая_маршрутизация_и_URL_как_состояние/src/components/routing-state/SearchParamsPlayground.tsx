import clsx from 'clsx';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

import { routingModules } from '../../lib/routing-domain';
import {
  getCatalogItems,
  patchSearchParams,
  resolveCatalogSearchState,
} from '../../lib/url-state-model';

const presets = [
  {
    label: 'Все / popular / cards',
    href: '/search-params?level=all&sort=popular&view=cards',
  },
  {
    label: 'Base / progress / table',
    href: '/search-params?level=base&sort=progress&view=table',
  },
  {
    label: 'Advanced / title / cards',
    href: '/search-params?level=advanced&sort=title&view=cards',
  },
] as const;

export function SearchParamsPlayground() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const state = resolveCatalogSearchState(searchParams);
  const items = getCatalogItems(routingModules, state);

  const updateQuery = (patch: Record<string, string>) => {
    setSearchParams(patchSearchParams(searchParams, patch));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Query controls
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Level</span>
              <select
                value={state.level}
                onChange={(event) => updateQuery({ level: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400"
              >
                <option value="all">all</option>
                <option value="base">base</option>
                <option value="advanced">advanced</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Sort</span>
              <select
                value={state.sort}
                onChange={(event) => updateQuery({ sort: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400"
              >
                <option value="popular">popular</option>
                <option value="progress">progress</option>
                <option value="title">title</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">View</span>
              <div className="grid grid-cols-2 gap-2">
                {(['cards', 'table'] as const).map((view) => (
                  <button
                    key={view}
                    type="button"
                    onClick={() => updateQuery({ view })}
                    className={clsx(
                      'rounded-2xl px-4 py-3 text-sm font-semibold transition',
                      state.view === view
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-100',
                    )}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </label>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Текущий URL
          </p>
          <code className="mt-4 block rounded-2xl bg-slate-950 px-4 py-3 text-xs leading-6 text-slate-100 break-all">
            {location.pathname}
            {location.search || '?level=all&sort=popular&view=cards'}
          </code>
          <div className="mt-4 flex flex-wrap gap-2">
            {presets.map((preset) => (
              <Link
                key={preset.href}
                to={preset.href}
                className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                {preset.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {state.view === 'cards' ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.focus}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                  {item.level}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  popularity: <strong>{item.popularity}</strong>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  progress: <strong>{item.progress}%</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Lesson</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Popularity</th>
                <th className="px-4 py-3">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">{item.title}</td>
                  <td className="px-4 py-3">{item.level}</td>
                  <td className="px-4 py-3">{item.popularity}</td>
                  <td className="px-4 py-3">{item.progress}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
