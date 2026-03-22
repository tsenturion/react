import clsx from 'clsx';

import { stackBadges } from './lib/stack-meta';
import { lessonLabs } from './lib/learning-model';
import { BoundariesPage } from './pages/BoundariesPage';
import { ContextDeliveryPage } from './pages/ContextDeliveryPage';
import { GlobalContainerPage } from './pages/GlobalContainerPage';
import { ReducerLogicPage } from './pages/ReducerLogicPage';
import { StrategyPage } from './pages/StrategyPage';
import { WorkspaceArchitecturePage } from './pages/WorkspaceArchitecturePage';
import { useLessonViewDispatch } from './state/useLessonViewDispatch';
import { useLessonViewState } from './state/useLessonViewState';

const labComponents = {
  context: ContextDeliveryPage,
  reducer: ReducerLogicPage,
  architecture: WorkspaceArchitecturePage,
  boundaries: BoundariesPage,
  strategy: StrategyPage,
  container: GlobalContainerPage,
} as const;

export function App() {
  const state = useLessonViewState();
  const dispatch = useLessonViewDispatch();
  const activeLab =
    lessonLabs.find((item) => item.id === state.activeLabId) ?? lessonLabs[0];
  const ActiveComponent = labComponents[activeLab.id];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 4 / Урок 28</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Context API и useReducer
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Эта учебная страница показывает, как `createContext`, `useContext` и
              `useReducer` работают вместе: где context действительно убирает prop
              drilling, когда reducer помогает собрать сложные переходы состояния, и как
              провести границы provider так, чтобы приложение не превратилось в один
              глобальный контейнер для всего подряд.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Как различаются delivery и update logic, где context нужен для дерева, а
                где достаточно обычного lifting state up, и почему reducer не должен
                автоматически означать глобальный store.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как читать лаборатории
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Сначала пройдите delivery через context, затем reducer как модель
                переходов, после этого переходите к Context + Reducer архитектуре,
                границам providers и завершайте урок выбором стратегии и разбором
                глобального контейнера.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Сам shell урока уже использует Context + Reducer для активной лаборатории
                и режимов просмотра, а рабочие sandboxes построены на отдельных scoped
                providers и reducer-моделях.
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
                onClick={() => dispatch({ type: 'lab/select', labId: item.id })}
                className={clsx(
                  'rounded-xl px-4 py-3 text-left transition-all duration-200',
                  activeLab.id === item.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100',
                )}
              >
                <span className="block text-sm font-semibold">{item.label}</span>
                <span
                  className={clsx(
                    'mt-1 block text-xs leading-5',
                    activeLab.id === item.id ? 'text-blue-100' : 'text-slate-500',
                  )}
                >
                  {item.blurb}
                </span>
              </button>
            ))}
          </div>
        </nav>

        <main className="panel p-6 sm:p-8">
          <ActiveComponent />
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
                    Открывайте `src/state`, `src/lib` и `src/components/context-reducer`,
                    чтобы отдельно видеть delivery contexts, reducer-модели и живые
                    архитектурные sandboxes.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Здесь важен не только UI. Сам shell урока уже использует отдельный
                    state context и dispatch context, так что `Context + Reducer` работает
                    и как предмет темы, и как реальная архитектура проекта.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят рядом с provider boundaries, reducer transitions и
                    разделением state/dispatch contexts, потому что именно там чаще всего
                    теряется смысл этих инструментов.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Глобальные настройки урока
                </p>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Density</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(['comfortable', 'compact'] as const).map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() =>
                            dispatch({ type: 'density/set', density: value })
                          }
                          className={clsx(
                            'rounded-xl px-3 py-2 text-sm font-medium transition',
                            state.density === value
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-slate-700 hover:bg-slate-100',
                          )}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700">Lens</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(['tree', 'logic'] as const).map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => dispatch({ type: 'lens/set', lens: value })}
                          className={clsx(
                            'rounded-xl px-3 py-2 text-sm font-medium transition',
                            state.lens === value
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-slate-700 hover:bg-slate-100',
                          )}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
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
                в `package.json`, Docker-конфигах и текущих настройках урока.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
