import clsx from 'clsx';
import { useState } from 'react';

import { stackBadges } from './lib/stack-meta';
import { DriftPage } from './pages/DriftPage';
import { LiftingStatePage } from './pages/LiftingStatePage';
import { OwnerPage } from './pages/OwnerPage';
import { PropDrillingPage } from './pages/PropDrillingPage';
import { SharedStateDashboardPage } from './pages/SharedStateDashboardPage';
import { UpwardFlowPage } from './pages/UpwardFlowPage';

const labs = [
  {
    id: 'lifting',
    label: '1. Lifting state up',
    blurb:
      'Общий parent держит одно состояние для нескольких синхронизированных child-компонентов.',
    component: LiftingStatePage,
  },
  {
    id: 'shared',
    label: '2. Shared state',
    blurb:
      'Один источник истины управляет несколькими визуально независимыми частями экрана.',
    component: SharedStateDashboardPage,
  },
  {
    id: 'drift',
    label: '3. Рассинхронизация',
    blurb:
      'Дублирование выбора у siblings ломает синхронность; lifted state её возвращает.',
    component: DriftPage,
  },
  {
    id: 'flow',
    label: '4. Данные вверх и вниз',
    blurb:
      'Child поднимают изменения вверх через callbacks, parent раздаёт новый state вниз по props.',
    component: UpwardFlowPage,
  },
  {
    id: 'drilling',
    label: '5. Prop drilling',
    blurb:
      'Глубокая цепочка показывает, как value и callbacks проходят через промежуточные уровни.',
    component: PropDrillingPage,
  },
  {
    id: 'owner',
    label: '6. Владелец состояния',
    blurb:
      'Как определить owner по реальным потребителям состояния, а не по привычке поднимать всё наверх.',
    component: OwnerPage,
  },
] as const;

export function App() {
  const [activeLabId, setActiveLabId] = useState<(typeof labs)[number]['id']>('lifting');
  const activeLab = labs.find((item) => item.id === activeLabId) ?? labs[0];
  const ActiveComponent = activeLab.component;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 2 / Урок 15</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Поднятие и совместное использование состояния
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Эта учебная страница разбирает shared state как архитектурное решение: когда
              состояние поднимают вверх, как один источник истины синхронизирует несколько
              компонентов, почему siblings расходятся при дублировании и откуда в дереве
              появляется prop drilling.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                lifting state up, shared state, единый источник истины, child → parent
                callbacks, синхронизация siblings, prop drilling и выбор правильного
                владельца состояния.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как читать лаборатории
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Изменяйте поля и выборы, сравнивайте плохие и хорошие архитектуры, а затем
                смотрите, где в текущем проекте shared value хранится у owner и как
                callbacks поднимают изменения вверх.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В проекте есть реальные parent-owned состояния, controlled
                child-компоненты, siblings с одной и разными копиями selectedId, а также
                deep chain с prop drilling через промежуточные уровни.
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
                    Открывайте `src/components/shared-state`, `src/pages` и `src/lib`,
                    чтобы видеть отдельно React-компоненты с lifted/shared state и чистые
                    модели, которые формулируют архитектурные правила урока.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Тема раскрывается буквально: siblings действительно расходятся при
                    локальных копиях selectedId, child-компоненты реально поднимают
                    изменения наверх, а parent раздаёт новый state вниз по дереву.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят в местах, где без них теряется идея урока: почему
                    state поднимается к owner, зачем children не мутируют соседей напрямую
                    и как deep tree порождает prop drilling.
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
