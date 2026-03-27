import clsx from 'clsx';
import { useState } from 'react';

import { stackBadges } from './lib/stack-meta';
import { ActionFlowPage } from './pages/ActionFlowPage';
import { BatchingPage } from './pages/BatchingPage';
import { QueueUpdatesPage } from './pages/QueueUpdatesPage';
import { SnapshotPage } from './pages/SnapshotPage';
import { StaleStatePage } from './pages/StaleStatePage';
import { StateIntroPage } from './pages/StateIntroPage';

const labs = [
  {
    id: 'intro',
    label: '1. Введение в state',
    blurb: 'Базовая роль `useState`: локальная память компонента и прямое влияние на UI.',
    component: StateIntroPage,
  },
  {
    id: 'snapshot',
    label: '2. State as a snapshot',
    blurb: 'Почему `setState` не делает переменную “сразу новой” в том же обработчике.',
    component: SnapshotPage,
  },
  {
    id: 'batching',
    label: '3. Batching',
    blurb: 'Несколько обновлений в одном действии и итоговый UI следующего рендера.',
    component: BatchingPage,
  },
  {
    id: 'queue',
    label: '4. Queued updates',
    blurb: 'Разница между `count + 1` и `prev => prev + 1` в очереди обновлений.',
    component: QueueUpdatesPage,
  },
  {
    id: 'stale',
    label: '5. Stale state',
    blurb: 'Потерянные обновления в отложенных callback и functional update как решение.',
    component: StaleStatePage,
  },
  {
    id: 'flow',
    label: '6. Action → UI',
    blurb: 'Как пользовательское действие переводит экран в новый state и новый UI.',
    component: ActionFlowPage,
  },
] as const;

export function App() {
  const [activeLabId, setActiveLabId] = useState<(typeof labs)[number]['id']>('intro');
  const activeLab = labs.find((item) => item.id === activeLabId) ?? labs[0];
  const ActiveComponent = activeLab.component;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 2 / Урок 12</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Состояние компонента и useState
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Эта учебная страница разбирает `useState` не как “магическую переменную”, а
              как модель перехода интерфейса между рендерами. Здесь можно буквально
              увидеть snapshot, batching, queued updates, stale state и то, как действия
              пользователя переводят экран в следующий UI через state.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                `useState`, чтение и запись состояния, snapshot-модель, batching, queued
                updates, functional updates, stale state и связь между действием
                пользователя и новым UI.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как читать лаборатории
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Нажимайте кнопки, планируйте отложенные обновления, сравнивайте direct и
                functional update, а затем открывайте соответствующие компоненты и модели,
                чтобы видеть то же поведение в коде.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В проекте есть реальные компоненты с `useState`, отложенные callback,
                несколько update-очередей, несколько state-срезов на одном экране и чистые
                модели, которые объясняют, что именно делает React.
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
                    Открывайте `src/components/state`, `src/pages` и `src/lib`, чтобы
                    видеть отдельно реальные `useState`-сценарии и чистые объясняющие
                    модели для snapshot, очереди обновлений и stale state.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Тема раскрывается буквально: `useState` действительно живёт в текущих
                    компонентах проекта, кнопки реально создают очереди обновлений, а
                    delayed callback воспроизводит stale closure, а не имитирует его.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят в важных местах: где handler работает со snapshot,
                    почему batching скрывает промежуточные состояния и как functional
                    updates читают уже queued value, а не старую переменную.
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
