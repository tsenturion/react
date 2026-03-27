import clsx from 'clsx';
import { Link, useParams, useSearchParams } from 'react-router-dom';

import { findRoutingModule, routingModules } from '../../lib/routing-domain';
import { patchSearchParams, resolveEntityUrlState } from '../../lib/url-state-model';

export function EntityUrlWorkbench() {
  const { entityId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const entity = findRoutingModule(entityId ?? '');
  const state = resolveEntityUrlState(searchParams);
  const preservedQuery = searchParams.toString();

  if (!entity) {
    return (
      <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-6">
        <p className="text-sm font-semibold text-rose-900">
          Сущность по адресу не найдена.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {routingModules.map((item) => (
            <Link
              key={item.id}
              to={`/entities/${item.id}?tab=overview&panel=summary`}
              className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-rose-700"
            >
              {item.id}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const panelCopy =
    state.panel === 'summary'
      ? 'Показывает короткую выжимку того, зачем экрану нужен устойчивый адрес.'
      : state.panel === 'history'
        ? 'Подчёркивает, что пользователь ожидает back/forward и повторяемый путь.'
        : 'Фиксирует, что ссылкой можно поделиться без дополнительного объяснения контекста.';

  const tabItems =
    state.tab === 'overview'
      ? entity.screens
      : state.tab === 'routing'
        ? entity.routingNotes
        : entity.pitfallNotes;

  return (
    <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
      <div className="space-y-4 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Сущности в path
        </p>
        {routingModules.map((item) => (
          <Link
            key={item.id}
            to={`/entities/${item.id}${preservedQuery ? `?${preservedQuery}` : ''}`}
            className={clsx(
              'block rounded-2xl border px-4 py-3 text-sm transition',
              item.id === entity.id
                ? 'border-blue-300 bg-blue-50 text-blue-950'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100',
            )}
          >
            <strong>{item.title}</strong>
            <span className="mt-1 block text-xs text-slate-500">{item.id}</span>
          </Link>
        ))}
      </div>

      <div className="space-y-5 rounded-[28px] border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Path + query
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {entity.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{entity.focus}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-700">
            <strong>id:</strong> {entity.id}
            <br />
            <strong>tab:</strong> {state.tab}
            <br />
            <strong>panel:</strong> {state.panel}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['overview', 'routing', 'pitfalls'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSearchParams(patchSearchParams(searchParams, { tab }))}
              className={clsx(
                'rounded-full px-4 py-2 text-sm font-semibold transition',
                state.tab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <ul className="space-y-2 text-sm leading-6 text-slate-700">
            {tabItems.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                {item}
              </li>
            ))}
          </ul>

          <div className="space-y-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Panel mode
            </p>
            <div className="flex flex-wrap gap-2">
              {(['summary', 'history', 'links'] as const).map((panel) => (
                <button
                  key={panel}
                  type="button"
                  onClick={() =>
                    setSearchParams(patchSearchParams(searchParams, { panel }))
                  }
                  className={clsx(
                    'rounded-full px-3 py-2 text-xs font-semibold transition',
                    state.panel === panel
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-100',
                  )}
                >
                  {panel}
                </button>
              ))}
            </div>
            <p className="text-sm leading-6 text-slate-600">{panelCopy}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
