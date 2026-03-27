import clsx from 'clsx';
import { useState } from 'react';

import { stackBadges } from './lib/stack-meta';
import { BoundaryPage } from './pages/BoundaryPage';
import { ImperativeHandlePage } from './pages/ImperativeHandlePage';
import { InsertionEffectPage } from './pages/InsertionEffectPage';
import { LayoutTimingPage } from './pages/LayoutTimingPage';
import { PositioningPage } from './pages/PositioningPage';
import { WidgetIntegrationPage } from './pages/WidgetIntegrationPage';

const labs = [
  {
    id: 'timing',
    label: '1. Timing',
    blurb: 'useLayoutEffect и разница между синхронизацией до и после paint.',
    component: LayoutTimingPage,
  },
  {
    id: 'positioning',
    label: '2. Positioning',
    blurb: 'Критичные измерения, underline, overlay и ResizeObserver.',
    component: PositioningPage,
  },
  {
    id: 'insertion',
    label: '3. Insertion',
    blurb: 'useInsertionEffect и runtime-инъекция CSS до layout effects.',
    component: InsertionEffectPage,
  },
  {
    id: 'handle',
    label: '4. Imperative handle',
    blurb: 'Как вынести наружу только ограниченный API child-компонента.',
    component: ImperativeHandlePage,
  },
  {
    id: 'widget',
    label: '5. Widget bridge',
    blurb: 'Интеграция со сторонним imperative widget и его lifecycle.',
    component: WidgetIntegrationPage,
  },
  {
    id: 'boundary',
    label: '6. Boundaries',
    blurb: 'Когда advanced DOM hooks нужны, а когда только усложняют компонент.',
    component: BoundaryPage,
  },
] as const;

export function App() {
  const [activeLabId, setActiveLabId] = useState<(typeof labs)[number]['id']>('timing');
  const activeLab = labs.find((item) => item.id === activeLabId) ?? labs[0];
  const ActiveComponent = activeLab.component;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 3 / Урок 23</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Расширенные DOM-хуки и imperative integration
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Эта учебная страница показывает, где React действительно выходит к DOM и
              внешним системам через расширенные escape hatches. Здесь собраны сценарии
              про timing до и после paint, critical measurement, style injection,
              imperative API child-компонента и bridge к сторонним виджетам.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Когда нужен sync before paint, почему style injection выделяется в
                отдельный hook, как проектировать узкий imperative API и как изолировать
                внешний widget внутри React-приложения.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как читать лаборатории
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Сначала пройдите timing и positioning, затем разберите useInsertionEffect,
                после этого проверьте useImperativeHandle и bridge к widget, а в конце
                сверьте границы применения advanced DOM hooks.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В проекте есть реальные useLayoutEffect, useInsertionEffect,
                useImperativeHandle, ResizeObserver, runtime style tags и imperative
                widget instance, который живёт в отдельном host node.
              </p>
            </div>
          </div>
        </header>

        <nav className="panel mb-8 p-2">
          <div className="flex flex-wrap gap-2">
            {labs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveLabId(item.id)}
                className={clsx(
                  'rounded-xl px-4 py-3 text-left transition-all duration-200',
                  activeLabId === item.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100',
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
                    Открывайте `src/components/dom-hooks`, `src/pages` и `src/lib`, чтобы
                    видеть отдельно живые sandboxes, учебные страницы и pure-model слой
                    для timing, positioning, style injection и integration boundary.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Внутри собраны и инструменты, и их границы: layout sync, insertion
                    timing, imperative child commands и отдельный host для внешнего widget
                    без конкуренции с React-owned DOM.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят в местах, где обычно путают причину выбора hook-а:
                    где нужен measurement before paint, где нужен только style injection,
                    а где вместо нового hook достаточно обычного render-вычисления.
                  </p>
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
                Здесь остаются только реальные версии инструментов, зафиксированные в
                `package.json`, Docker-конфигах и настройках проекта.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
