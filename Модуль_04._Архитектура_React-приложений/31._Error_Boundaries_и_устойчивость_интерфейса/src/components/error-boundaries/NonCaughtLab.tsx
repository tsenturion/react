import { useState } from 'react';

import { boundaryCatchCases } from '../../lib/error-domain';
import { LessonErrorBoundary } from './LessonErrorBoundary';

function PromotedAsyncSurface({ error }: { error: Error | null }) {
  if (error) {
    throw error;
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Async bridge
      </p>
      <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
        Boundary пока не задействован
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Запустите event handler, timer или promoted async error и сравните поведение.
      </p>
    </div>
  );
}

export function NonCaughtLab() {
  const [outsideLogs, setOutsideLogs] = useState<string[]>([]);
  const [boundaryLogs, setBoundaryLogs] = useState<string[]>([]);
  const [promotedError, setPromotedError] = useState<Error | null>(null);

  const logOutside = (message: string) => {
    setOutsideLogs((current) => [message, ...current].slice(0, 5));
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              // Ошибку event handler здесь перехватывает обычный try/catch только для того,
              // чтобы демонстрация не роняла весь dev-сеанс. Boundary в любом случае её
              // не увидит, потому что сбой живёт вне render-фазы.
              try {
                throw new Error('Сбой внутри click handler.');
              } catch (error) {
                logOutside((error as Error).message + ' Boundary не вмешалась.');
              }
            }}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Ошибка в event handler
          </button>
          <button
            type="button"
            onClick={() => {
              logOutside('Таймер запущен. Ошибка придёт через 300 мс вне boundary.');
              window.setTimeout(() => {
                try {
                  throw new Error('Timer callback упал вне render-пути.');
                } catch (error) {
                  logOutside((error as Error).message);
                }
              }, 300);
            }}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Ошибка в таймере
          </button>
          <button
            type="button"
            onClick={() => {
              window.setTimeout(() => {
                setPromotedError(
                  new Error(
                    'Async failure переведён в render и теперь доступен boundary.',
                  ),
                );
              }, 300);
            }}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Перевести async в render
          </button>
        </div>

        <LessonErrorBoundary
          label="Async bridge"
          resetKeys={[Boolean(promotedError)]}
          onError={(error) => {
            setBoundaryLogs((current) => [error.message, ...current].slice(0, 4));
          }}
          fallbackRender={({ error, reset }) => (
            <div className="space-y-4 rounded-[28px] border border-rose-300 bg-rose-50 p-6">
              <h3 className="text-xl font-semibold text-rose-950">
                Boundary поймала promoted async error
              </h3>
              <p className="text-sm leading-6 text-rose-900">
                Сама async-ошибка не попала бы в boundary напрямую. Вы перевели её в
                render через state, и только после этого boundary смог локализовать UI.
              </p>
              <div className="rounded-2xl border border-rose-300 bg-white px-4 py-4 text-sm leading-6 text-rose-900">
                {error.message}
              </div>
              <button
                type="button"
                onClick={() => {
                  setPromotedError(null);
                  reset();
                }}
                className="rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-800"
              >
                Очистить async error
              </button>
            </div>
          )}
        >
          <PromotedAsyncSurface error={promotedError} />
        </LessonErrorBoundary>
      </div>

      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Не попадает в boundary
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            {boundaryCatchCases
              .filter((item) => !item.caught)
              .map((item) => (
                <li
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <strong className="font-semibold text-slate-900">{item.label}</strong>
                  <p className="mt-1 text-slate-600">{item.note}</p>
                </li>
              ))}
          </ul>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Outside / boundary logs
          </p>
          <div className="mt-4 space-y-3">
            <div>
              <p className="text-sm font-semibold text-slate-700">Outside</p>
              <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                {outsideLogs.length > 0 ? (
                  outsideLogs.map((item) => (
                    <li
                      key={item}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    Пока outside errors не запускались.
                  </li>
                )}
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700">Boundary</p>
              <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                {boundaryLogs.length > 0 ? (
                  boundaryLogs.map((item) => (
                    <li
                      key={item}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    Boundary ещё не ловила promoted async error.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
