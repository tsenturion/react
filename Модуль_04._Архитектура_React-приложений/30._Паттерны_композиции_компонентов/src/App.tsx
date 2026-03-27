import { useState, type ComponentType } from 'react';

import { PatternTabs } from './components/composition-patterns/PatternTabs';
import { stackBadges } from './lib/stack-meta';
import { lessonLabs, type LabId } from './lib/learning-model';
import { AlternativesPage } from './pages/AlternativesPage';
import { ChildrenPage } from './pages/ChildrenPage';
import { CompoundPage } from './pages/CompoundPage';
import { HocPage } from './pages/HocPage';
import { RenderPropsPage } from './pages/RenderPropsPage';
import { TradeoffsPage } from './pages/TradeoffsPage';

const labComponents: Record<LabId, ComponentType> = {
  compound: CompoundPage,
  'render-props': RenderPropsPage,
  hoc: HocPage,
  children: ChildrenPage,
  alternatives: AlternativesPage,
  tradeoffs: TradeoffsPage,
};

export function App() {
  const [activeLabId, setActiveLabId] = useState<LabId>('compound');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [lens, setLens] = useState<'api' | 'boundaries'>('api');

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 4 / Урок 30</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Паттерны композиции компонентов
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Эта учебная страница показывает, как строить гибкие API-компонентов через
              compound components, render props, HOC, cloneElement и Children API, и где
              эти подходы действительно помогают, а где начинают создавать скрытые
              контракты и архитектурный шум.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Не только синтаксис паттернов, но и их стоимость: hidden contracts,
                wrapper nesting, typing pressure и современные альтернативы.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как читать лаборатории
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Сначала пройдите compound и render props, затем HOC и Children API, а
                после этого переходите к выбору современных альтернатив и разбору границ.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Сам shell урока уже использует compound components для навигации, а
                отдельные лаборатории построены на реальных render props, HOC и
                cloneElement-поверхностях.
              </p>
            </div>
          </div>
        </header>

        {/* Весь shell урока собран через compound tabs, чтобы паттерн был
            реальным рабочим кодом приложения, а не только содержимым одной страницы. */}
        <PatternTabs.Root
          value={activeLabId}
          onValueChange={(value) => setActiveLabId(value as LabId)}
        >
          <nav className="panel mb-8 p-2">
            <PatternTabs.List className="flex flex-wrap gap-2">
              {lessonLabs.map((item) => (
                <PatternTabs.Trigger
                  key={item.id}
                  value={item.id}
                  description={item.blurb}
                >
                  {item.label}
                </PatternTabs.Trigger>
              ))}
            </PatternTabs.List>
          </nav>

          <main className="panel p-6 sm:p-8">
            {lessonLabs.map((item) => {
              const ActiveComponent = labComponents[item.id];

              return (
                <PatternTabs.Panel key={item.id} value={item.id}>
                  <ActiveComponent />
                </PatternTabs.Panel>
              );
            })}
          </main>
        </PatternTabs.Root>

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
                    Открывайте `src/components/composition-patterns` и `src/lib`, чтобы
                    отдельно видеть сами pattern-primitives, живые лаборатории и pure
                    models для выбора и оценки паттернов.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Смотрите на shell урока как на часть материала: навигация построена
                    через compound components, а значит паттерн уже используется в
                    реальном коде текущего приложения.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят рядом с context-контрактами, HOC wrappers и
                    cloneElement boundary, потому что именно там чаще всего теряется
                    прозрачность API-компонента.
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
                          onClick={() => setDensity(value)}
                          className={
                            density === value
                              ? 'rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white'
                              : 'rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100'
                          }
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700">Lens</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(['api', 'boundaries'] as const).map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setLens(value)}
                          className={
                            lens === value
                              ? 'rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white'
                              : 'rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100'
                          }
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
