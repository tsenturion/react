import clsx from 'clsx';
import { useState, type ComponentType } from 'react';

import { LessonErrorBoundary } from './components/error-boundaries/LessonErrorBoundary';
import { lessonLabs, type LabId } from './lib/learning-model';
import { stackBadges } from './lib/stack-meta';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { BoundaryPage } from './pages/BoundaryPage';
import { FallbackPage } from './pages/FallbackPage';
import { IsolationPage } from './pages/IsolationPage';
import { NonCaughtPage } from './pages/NonCaughtPage';
import { ResetPage } from './pages/ResetPage';

const labComponents: Record<LabId, ComponentType> = {
  boundaries: BoundaryPage,
  isolation: IsolationPage,
  reset: ResetPage,
  'non-caught': NonCaughtPage,
  fallback: FallbackPage,
  architecture: ArchitecturePage,
};

export function App() {
  const [activeLabId, setActiveLabId] = useState<LabId>('boundaries');
  const [shellEvents, setShellEvents] = useState<string[]>([]);
  const ActiveComponent = labComponents[activeLabId];
  const activeLab = lessonLabs.find((item) => item.id === activeLabId);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 4 / Урок 31</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Error Boundaries и устойчивость интерфейса
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Здесь вы разбираете, как React локализует сбои через `Error Boundary`, где
              boundary реально спасает интерфейс, что остаётся вне его зоны и как
              проектировать fallback UI так, чтобы проблема не уносила с собой весь экран.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Не только `Error Boundary` как API, но и blast radius, reset strategies,
                safe degradation и качество fallback UX.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что boundary не ловит
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Ошибки в event handlers, таймерах и произвольном async-коде не попадают в
                boundary автоматически. Для них нужны отдельные решения.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Shell урока сам обёрнут в boundary, а лаборатории используют реальный
                class-based fallback, `resetKeys`, remount через `key` и архитектурные
                рекомендации из pure models.
              </p>
            </div>
          </div>
        </header>

        <nav className="panel mb-8 p-2">
          <div className="flex flex-wrap gap-2">
            {lessonLabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveLabId(item.id)}
                className={clsx(
                  'rounded-2xl px-4 py-3 text-left transition',
                  activeLabId === item.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-slate-50',
                )}
              >
                <span className="block text-sm font-semibold">{item.label}</span>
                <span
                  className={clsx(
                    'mt-1 block text-xs leading-5',
                    activeLabId === item.id ? 'text-blue-100' : 'text-slate-500',
                  )}
                >
                  {item.blurb}
                </span>
              </button>
            ))}
          </div>
        </nav>

        <main className="panel p-6 sm:p-8">
          {/* Shell урока тоже обёрнут boundary, чтобы safe degradation была частью
              реального приложения, а не только содержимым одной лаборатории. */}
          <LessonErrorBoundary
            label="Основная область урока"
            resetKeys={[activeLabId]}
            onError={(error) => {
              const prefix = activeLab ? activeLab.label : 'Shell';
              setShellEvents((current) =>
                [`${prefix}: ${error.message}`, ...current].slice(0, 4),
              );
            }}
            fallbackRender={({ error, reset }) => (
              <div className="space-y-4 rounded-[28px] border border-rose-300 bg-rose-50 p-6">
                <span className="inline-flex rounded-full border border-rose-300 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-700">
                  Shell fallback
                </span>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight text-rose-950">
                    Текущая лаборатория упала выше локальных boundaries
                  </h2>
                  <p className="text-sm leading-6 text-rose-900">
                    Навигация и нижняя часть страницы остались живы, потому что shell
                    урока обёрнут отдельным boundary. Переключите лабораторию или
                    попробуйте перерисовать текущую область.
                  </p>
                </div>
                <div className="rounded-2xl border border-rose-300 bg-white px-4 py-4 text-sm leading-6 text-rose-900">
                  <strong className="font-semibold">Последняя ошибка:</strong>{' '}
                  {error.message}
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={reset}
                    className="rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-800"
                  >
                    Повторить render
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLabId('boundaries')}
                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                  >
                    Открыть первую лабораторию
                  </button>
                </div>
              </div>
            )}
          >
            <ActiveComponent />
          </LessonErrorBoundary>
        </main>

        <footer className="mt-12 border-t border-slate-200 pt-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                Как читать этот проект
              </h2>
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <p className="text-sm leading-6">
                    Начните с `Boundary basics`, затем сравните `Isolation` и `Reset`, а
                    после этого переходите к `What boundaries miss`, `Fallback UX` и
                    архитектурной лаборатории.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Открывайте `src/components/error-boundaries` и `src/lib`: в первом
                    лежат настоящие React boundary-сценарии, во втором pure models для
                    оценки зоны поражения, reset logic и placement decisions.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят там, где boundary легко понять неправильно:
                    resetKeys, исключения вне render и интеграция с shell-level fallback.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Shell safety log
                </p>
                {shellEvents.length > 0 ? (
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700">
                    {shellEvents.map((item) => (
                      <li
                        key={item}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    Пока shell boundary не перехватывал ошибок. Это ожидаемо: сначала
                    должны сработать локальные boundaries внутри лабораторий.
                  </p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800">Стек проекта</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {stackBadges.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-slate-100 p-4 text-sm leading-6 text-slate-600">
                Здесь остаются только реальные версии инструментов, которые зафиксированы
                в `package.json`, Docker-конфигах и текущем коде урока.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
