import { type FormEvent, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { sanitizeIntentPath } from '../../lib/e2e-domain';
import { useJourneyState } from '../../state/JourneyStateContext';
import { Panel, StatusPill } from '../ui';

export function AuthFlowPanel({ mode = 'lab' }: { mode?: 'lab' | 'screen' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, login, logout } = useJourneyState();
  const [name, setName] = useState('Надежда QA');
  const [role, setRole] = useState<'qa' | 'release-manager'>('qa');
  const [error, setError] = useState<string | null>(null);

  const safeIntent = useMemo(() => {
    const url = new URLSearchParams(location.search);
    return sanitizeIntentPath(url.get('intent'));
  }, [location.search]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setError(
        'Сессии нужно имя: браузерный сценарий должен видеть тот же ввод, что и пользователь.',
      );
      return;
    }

    setError(null);
    login({ name: name.trim(), role });

    // Redirect intent хранится в URL, а не в приватной переменной компонента:
    // так его можно наблюдать и в реальном браузере, и в Playwright-сценарии.
    void navigate(safeIntent, { replace: true });
  }

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Auth journey
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Redirect и возврат на нужный экран после входа
            </h2>
          </div>
          <StatusPill tone={session ? 'success' : 'warn'}>
            {session ? 'session open' : 'session required'}
          </StatusPill>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm leading-6 text-slate-600">
              Целевой маршрут после входа:
            </p>
            <code className="mt-2 block break-all text-sm font-semibold text-slate-900">
              {safeIntent}
            </code>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              E2E подтверждает не сам вызов `navigate`, а то, что браузер реально дошёл до
              нужного защищённого экрана и сохранил пользовательское намерение.
            </p>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Системный сигнал
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Лучший итоговый assert здесь звучит так: после login browser оказался на
              ожидаемом маршруте и увидел доступный protected screen.
            </p>
          </div>
        </div>
      </Panel>

      {session ? (
        <Panel className="space-y-4">
          <div
            role="status"
            className="rounded-[24px] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-950"
          >
            Сессия открыта для <strong>{session.name}</strong> с ролью{' '}
            <strong>{session.role}</strong>.
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to={safeIntent}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Перейти к защищённому экрану
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                void navigate(mode === 'screen' ? '/auth-journeys' : '/auth-journeys');
              }}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Выйти
            </button>
          </div>
        </Panel>
      ) : (
        <Panel>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium">Имя в сессии</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
                />
              </label>

              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium">Роль в сессии</span>
                <select
                  value={role}
                  onChange={(event) =>
                    setRole(event.target.value as 'qa' | 'release-manager')
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
                >
                  <option value="qa">QA</option>
                  <option value="release-manager">Release manager</option>
                </select>
              </label>
            </div>

            {error ? (
              <div
                role="alert"
                className="rounded-[24px] border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-6 text-rose-950"
              >
                {error}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Войти и продолжить
              </button>
              <Link
                to="/auth-journeys"
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Остаться в лаборатории
              </Link>
            </div>
          </form>
        </Panel>
      )}
    </div>
  );
}
