import clsx from 'clsx';
import { useState } from 'react';

import { stackBadges } from './lib/stack-meta';
import { ArchitectureMiniDemoPage } from './pages/ArchitectureMiniDemoPage';
import { BlueprintPage } from './pages/BlueprintPage';
import { DataDerivedEventsPage } from './pages/DataDerivedEventsPage';
import { InteractionFlowPage } from './pages/InteractionFlowPage';
import { ScreenDecompositionPage } from './pages/ScreenDecompositionPage';
import { SourceOfTruthPage } from './pages/SourceOfTruthPage';

const labs = [
  {
    id: 'decomposition',
    label: '1. Декомпозиция экрана',
    blurb:
      'Как разложить один экран на компоненты и boundaries без преждевременной детализации.',
    component: ScreenDecompositionPage,
  },
  {
    id: 'truth',
    label: '2. Источник истины',
    blurb: 'Как найти owner state и не получить drift между list, details и summary.',
    component: SourceOfTruthPage,
  },
  {
    id: 'classification',
    label: '3. Данные и вычисления',
    blurb: 'Как отличать data, state, derived values и events в одном и том же экране.',
    component: DataDerivedEventsPage,
  },
  {
    id: 'blueprint',
    label: '4. Бриф в архитектуру',
    blurb: 'Как превратить текстовый макет в components, state, derived values и events.',
    component: BlueprintPage,
  },
  {
    id: 'flow',
    label: '5. Цикл действия',
    blurb:
      'Как действие пользователя превращается в state change, rerender и визуальный результат.',
    component: InteractionFlowPage,
  },
  {
    id: 'demo',
    label: '6. Итоговый mini-demo',
    blurb:
      'Цельный экран, где одновременно видны компоненты, state, derived values и связи между ними.',
    component: ArchitectureMiniDemoPage,
  },
] as const;

export function App() {
  const [activeLabId, setActiveLabId] =
    useState<(typeof labs)[number]['id']>('decomposition');
  const activeLab = labs.find((item) => item.id === activeLabId) ?? labs[0];
  const ActiveComponent = activeLab.component;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 2 / Урок 18</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Практика проектирования интерфейса через компоненты и состояние
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Эта учебная страница показывает, как один реальный экран превращается в
              реактовскую архитектуру: как выделить компоненты, найти источник истины,
              отделить state от derived values, разложить текстовый бриф на связи между
              событиями, ререндером и визуальным результатом.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Декомпозицию экрана, source of truth, data vs derived values, события,
                переход от текстового макета к архитектуре и причинно-следственные связи
                между действием пользователя и результатом в UI.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как читать лаборатории
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Сначала меняйте уровень декомпозиции, затем архитектурные решения про
                owner state, потом способ хранения derived values и в конце проверяйте это
                на одном цельном экране с живым render-трейсом.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В проекте есть реальный `CourseWorkbench`, вокруг которого построены pure
                models для декомпозиции, source of truth, data classification, blueprint
                planning и live trace цикла `action → state → render → UI`.
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
                    Открывайте `src/components/interface-practice`, `src/pages` и
                    `src/lib`, чтобы видеть отдельно реальный экран, sandboxes вокруг него
                    и pure models для архитектурных решений.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Здесь намеренно собраны и хорошие, и плохие архитектуры: единый owner
                    state, duplicated selection, local draft с потерей данных, хранение
                    derived values в state и цельный экран с корректной композицией.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят в местах, где обычно путают архитектуру экрана:
                    зачем state поднимается наверх, почему derived values не нужно
                    дублировать и как фильтры влияют на допустимый selected item.
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
