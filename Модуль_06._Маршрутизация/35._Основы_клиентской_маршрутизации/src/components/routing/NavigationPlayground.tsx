import { useEffect, useSyncExternalStore } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

import { navigationPlaygroundLogStore } from '../../lib/navigation-log-store';

export function NavigationPlayground() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentStamp = `${location.pathname}${location.search || ''}`;
  const historyLog = useSyncExternalStore(
    navigationPlaygroundLogStore.subscribe,
    navigationPlaygroundLogStore.getSnapshot,
    navigationPlaygroundLogStore.getSnapshot,
  );

  useEffect(() => {
    navigationPlaygroundLogStore.record(currentStamp);
  }, [currentStamp]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-wrap gap-2">
            <NavLink
              to="/client-routing"
              className={({ isActive }) =>
                isActive
                  ? 'rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white'
                  : 'rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100'
              }
            >
              NavLink to basics
            </NavLink>
            <Link
              to="/params/profile-editor"
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Link to param route
            </Link>
            <button
              type="button"
              onClick={() => navigate('/spa-mental-model')}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              useNavigate to SPA lab
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              navigate(-1)
            </button>
            <button
              type="button"
              onClick={() => navigate(1)}
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              navigate(1)
            </button>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600">
          Здесь собраны три способа перехода: декларативный `Link`, стилизованный
          `NavLink` и императивный `useNavigate`. Все они меняют экран без полной
          перезагрузки документа.
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Navigation log
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
          {historyLog.map((item) => (
            <li
              key={item}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
