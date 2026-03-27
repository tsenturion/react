import clsx from 'clsx';
import { useState } from 'react';

import { boundaryCatchCases } from '../../lib/error-domain';
import { CrashSurface } from './CrashSurface';
import { LessonErrorBoundary } from './LessonErrorBoundary';

const crashModes = [
  {
    id: 'safe',
    label: 'Без сбоя',
    note: 'Subtree рендерится штатно.',
  },
  {
    id: 'render',
    label: 'Ошибка в render',
    note: 'Boundary заменяет subtree на fallback.',
  },
  {
    id: 'descendant',
    label: 'Ошибка в потомке',
    note: 'Boundary ловит её так же, потому что сбой идёт по render-пути.',
  },
] as const;

export function BoundaryBasicsLab() {
  const [mode, setMode] = useState<(typeof crashModes)[number]['id']>('safe');
  const [events, setEvents] = useState<string[]>([]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {crashModes.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id)}
              className={clsx(
                'rounded-xl px-4 py-2 text-sm font-medium transition',
                mode === item.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <p className="text-sm leading-6 text-slate-600">
          Переключите сценарий и посмотрите, как boundary перехватывает render-сбой, пишет
          его в журнал и заменяет только проблемный subtree.
        </p>

        <LessonErrorBoundary
          label="Карточка аналитики"
          resetKeys={[mode]}
          onError={(error) => {
            setEvents((current) => [error.message, ...current].slice(0, 4));
          }}
          fallbackRender={({ error, reset }) => (
            <div className="space-y-4 rounded-[28px] border border-rose-300 bg-rose-50 p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                  Boundary fallback
                </p>
                <h3 className="mt-2 text-xl font-semibold text-rose-950">
                  Карточка аналитики временно отключена
                </h3>
                <p className="mt-2 text-sm leading-6 text-rose-900">
                  Вы видите локальный fallback вместо падения всей страницы. Если
                  переключить сценарий или повторить render после исправления причины,
                  subtree вернётся в рабочий режим.
                </p>
              </div>
              <div className="rounded-2xl border border-rose-300 bg-white px-4 py-4 text-sm leading-6 text-rose-900">
                {error.message}
              </div>
              <button
                type="button"
                onClick={reset}
                className="rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-800"
              >
                Повторить render
              </button>
            </div>
          )}
        >
          <CrashSurface
            label="Карточка аналитики"
            summary="Эта карточка имитирует реальный widget внутри приложения. Boundary стоит рядом с ним и изолирует локальный сбой."
            mode={mode}
          />
        </LessonErrorBoundary>
      </div>

      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Boundary ловит
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
            {boundaryCatchCases
              .filter((item) => item.caught)
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
            Журнал boundary
          </p>
          {events.length > 0 ? (
            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
              {events.map((event) => (
                <li
                  key={event}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  {event}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Пока boundary не срабатывал. Выберите режим с ошибкой, чтобы увидеть переход
              в fallback и запись в журнал.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
