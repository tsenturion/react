import clsx from 'clsx';
import { useState } from 'react';

import { stackBadges } from './lib/stack-meta';
import { FocusPage } from './pages/FocusPage';
import { ImperativeConflictPage } from './pages/ImperativeConflictPage';
import { MeasurePage } from './pages/MeasurePage';
import { MutableRefPage } from './pages/MutableRefPage';
import { ScrollPage } from './pages/ScrollPage';
import { TimersObjectsPage } from './pages/TimersObjectsPage';

const labs = [
  {
    id: 'mutable',
    label: '1. Mutable ref',
    blurb: 'Ref как значение между render-ами без автоматического перерендера.',
    component: MutableRefPage,
  },
  {
    id: 'focus',
    label: '2. Focus и DOM refs',
    blurb: 'focus(), jump to invalid и восстановление последнего DOM-узла.',
    component: FocusPage,
  },
  {
    id: 'scroll',
    label: '3. Scroll',
    blurb: 'scrollIntoView и map из id в DOM-узлы текущего списка.',
    component: ScrollPage,
  },
  {
    id: 'measure',
    label: '4. Measure DOM',
    blurb: 'getBoundingClientRect, ResizeObserver и реальные размеры layout-а.',
    component: MeasurePage,
  },
  {
    id: 'timers',
    label: '5. Таймеры и объекты',
    blurb: 'Timer handles и внешние mutable instances в refs.',
    component: TimersObjectsPage,
  },
  {
    id: 'imperative',
    label: '6. Imperative boundary',
    blurb: 'Где прямой DOM доступ помогает, а где начинает конфликтовать с JSX.',
    component: ImperativeConflictPage,
  },
] as const;

export function App() {
  const [activeLabId, setActiveLabId] = useState<(typeof labs)[number]['id']>('mutable');
  const activeLab = labs.find((item) => item.id === activeLabId) ?? labs[0];
  const ActiveComponent = activeLab.component;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 3 / Урок 22</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              useRef и работа с DOM
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Эта учебная страница показывает, как useRef соединяет React с mutable
              значениями и с реальным DOM. Здесь собраны сценарии про focus, scroll,
              measurement, таймеры, внешние объекты и границу между допустимым imperative
              доступом и конфликтом с декларативной моделью React.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Чем ref отличается от state, как работать с DOM-элементами, где измерять
                layout, как хранить handles и почему ручная DOM-мутация не должна
                становиться вторым источником истины.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как читать лаборатории
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Сначала разберите mutable ref против state, затем пройдите focus и scroll,
                после этого измерьте DOM, проверьте timer/object refs и завершите урок
                разбором imperative границы.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В проекте есть реальные `focus()`, `scrollIntoView()`,
                `getBoundingClientRect()`, `ResizeObserver`, timer handles и намеренно
                конфликтные ручные DOM-мутации рядом с declarative JSX.
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
                    Открывайте `src/components/dom-refs`, `src/pages` и `src/lib`, чтобы
                    видеть отдельно живые DOM-сценарии, учебные страницы и чистые модели
                    для focus, scroll, measurement и imperative boundary.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Здесь intentionally собраны и хорошие, и плохие варианты: mutable
                    value в ref, timer/object handles, валидный focus/scroll и ручная
                    DOM-мутация, которая конфликтует с React-owned UI.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят в местах, где обычно путают границы: почему timer id
                    не нужен в state, почему measurement читается из DOM и где manual DOM
                    changes перестают быть безопасным escape hatch.
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
