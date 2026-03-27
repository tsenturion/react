import clsx from 'clsx';
import { useState } from 'react';

import { stackBadges } from './lib/stack-meta';
import { BubblingPage } from './pages/BubblingPage';
import { DefaultActionPage } from './pages/DefaultActionPage';
import { EventToRenderPage } from './pages/EventToRenderPage';
import { HandlerPitfallsPage } from './pages/HandlerPitfallsPage';
import { ReactNativeBridgePage } from './pages/ReactNativeBridgePage';
import { SyntheticEventPage } from './pages/SyntheticEventPage';

const labs = [
  {
    id: 'synthetic',
    label: '1. Synthetic Events',
    blurb:
      'Как React передаёт нормализованный event object и какие паттерны назначения handlers использовать.',
    component: SyntheticEventPage,
  },
  {
    id: 'bubbling',
    label: '2. Bubbling и stopPropagation',
    blurb:
      'Как событие поднимается вверх по дереву обработчиков и где это всплытие можно остановить.',
    component: BubblingPage,
  },
  {
    id: 'bridge',
    label: '3. React vs DOM',
    blurb:
      'Как JSX-handlers соотносятся с native addEventListener и что именно они получают на вход.',
    component: ReactNativeBridgePage,
  },
  {
    id: 'default',
    label: '4. preventDefault',
    blurb:
      'Как отделять browser default behavior от самого события и не путать это со stopPropagation.',
    component: DefaultActionPage,
  },
  {
    id: 'flow',
    label: '5. Event → State → UI',
    blurb:
      'Как одно действие пользователя запускает обновление state, новый render и визуальный результат.',
    component: EventToRenderPage,
  },
  {
    id: 'pitfalls',
    label: '6. Паттерны и ошибки',
    blurb:
      'Какие ошибки с target, currentTarget и передачей handlers ломают логику интерфейса.',
    component: HandlerPitfallsPage,
  },
] as const;

export function App() {
  const [activeLabId, setActiveLabId] =
    useState<(typeof labs)[number]['id']>('synthetic');
  const activeLab = labs.find((item) => item.id === activeLabId) ?? labs[0];
  const ActiveComponent = activeLab.component;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 3 / Урок 19</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Система событий в React
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Эта учебная страница показывает, как React обрабатывает пользовательские
              события: что такое `SyntheticEvent`, как работают bubbling,
              `preventDefault()` и `stopPropagation()`, чем React-level handlers
              отличаются от native DOM listeners и как одно действие пользователя доходит
              до нового render интерфейса.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Synthetic Events, bubbling, `stopPropagation`, `preventDefault`, bridge
                между React и DOM, связь события с ререндером и типичные ошибки в передаче
                обработчиков.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как читать лаборатории
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Сначала сравните паттерны handlers и сам объект события, затем проверьте
                bubbling и default actions, а в конце свяжите событие с обновлением state
                и с типичными bugs в реальных компонентах.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В проекте есть отдельные sandboxes для bubbling, native listeners, default
                actions и event-driven state updates, а рядом лежат pure models и тесты,
                которые формулируют правила без UI-шума.
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
                    Открывайте `src/components/react-events`, `src/pages` и `src/lib`,
                    чтобы видеть отдельно живые React-сценарии, страницы урока и чистые
                    модели для event semantics.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Здесь намеренно собраны и хорошие, и плохие варианты: корректный
                    wrapper для аргументов, остановка bubbling в нужной точке, сравнение
                    React/native listeners и ошибки с `target` или вызовом handler во
                    время render.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят в местах, где чаще всего путают реальную механику:
                    почему для dataset нужен `currentTarget`, зачем cleanup обязателен у
                    native listeners и как `event → state → UI` выражается в React-коде.
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
