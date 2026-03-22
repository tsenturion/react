import clsx from 'clsx';

import { stackBadges } from './lib/stack-meta';
import { lessonLabs } from './lib/learning-model';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { ComparePage } from './pages/ComparePage';
import { FlowPage } from './pages/FlowPage';
import { FluxPage } from './pages/FluxPage';
import { StorePage } from './pages/StorePage';
import { TradeoffsPage } from './pages/TradeoffsPage';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { densitySet, labSelected, lensSet } from './store/lessonViewSlice';
import { selectLessonView } from './store/selectors';

const labComponents = {
  flux: FluxPage,
  store: StorePage,
  flow: FlowPage,
  compare: ComparePage,
  tradeoffs: TradeoffsPage,
  architecture: ArchitecturePage,
} as const;

export function App() {
  const lessonView = useAppSelector(selectLessonView);
  const dispatch = useAppDispatch();
  const activeLab =
    lessonLabs.find((item) => item.id === lessonView.activeLabId) ?? lessonLabs[0];
  const ActiveComponent = labComponents[activeLab.id];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 4 / Урок 29</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Flux, Redux и архитектура управляемого состояния
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Эта учебная страница показывает, зачем вообще появляется app-level
              однонаправленный поток данных, как actions, reducers и selectors меняют
              структуру кода, и в каких случаях Redux действительно помогает, а в каких
              превращается в лишний слой поверх локального или scoped state.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Почему Flux и Redux вообще существуют, как они собирают shared state в
                отдельный слой, и где проходит граница между полезной централизацией и
                архитектурным overkill.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как читать лаборатории
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Сначала пройдите цикл Flux и живой store, затем сравните однонаправленный
                поток с локальной моделью, после этого переходите к trade-offs и к тому,
                как меняется архитектурное мышление.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Сам shell урока уже работает через Redux: активная лаборатория и режимы
                просмотра лежат в store, а feature-лаборатории используют реальные slices,
                selectors и typed hooks вместо декоративной имитации.
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
                onClick={() => dispatch(labSelected(item.id))}
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
                    Открывайте `src/store`, `src/lib` и
                    `src/components/redux-architecture`, чтобы отдельно видеть slices,
                    selectors, pure-model слой и лаборатории, которые используют этот код
                    как реальную архитектуру.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Смотрите не только на UI. Здесь Redux встроен и в общую оболочку
                    урока, поэтому store уже управляет навигацией по лабораториям и
                    режимами просмотра всей страницы.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят рядом с root store, slice reducers и boundary между
                    view и selector layer, потому что именно там обычно теряется смысл
                    централизованной модели.
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
                          onClick={() => dispatch(densitySet(value))}
                          className={clsx(
                            'rounded-xl px-3 py-2 text-sm font-medium transition',
                            lessonView.density === value
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
                      {(['flow', 'structure'] as const).map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => dispatch(lensSet(value))}
                          className={clsx(
                            'rounded-xl px-3 py-2 text-sm font-medium transition',
                            lessonView.lens === value
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
                в `package.json`, Docker-конфигах и текущем коде урока.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
