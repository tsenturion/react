import clsx from 'clsx';
import { useState } from 'react';

import { stackBadges } from './lib/stack-meta';
import { BranchIdentityPage } from './pages/BranchIdentityPage';
import { KeyResetPage } from './pages/KeyResetPage';
import { ListIdentityPage } from './pages/ListIdentityPage';
import { StatePositionPage } from './pages/StatePositionPage';
import { StateStrategyPage } from './pages/StateStrategyPage';
import { TreeMovePage } from './pages/TreeMovePage';

const labs = [
  {
    id: 'position',
    label: '1. Позиция в дереве',
    blurb:
      'Как React привязывает local state к component type и конкретному slot дерева.',
    component: StatePositionPage,
  },
  {
    id: 'branches',
    label: '2. Условные ветки',
    blurb:
      'Когда одна ветка сохраняет экземпляр, а когда смена type запускает новый lifecycle.',
    component: BranchIdentityPage,
  },
  {
    id: 'keys',
    label: '3. Key и reset',
    blurb: 'Как `key` осознанно сбрасывает state и создаёт новую identity boundary.',
    component: KeyResetPage,
  },
  {
    id: 'lists',
    label: '4. Списки и identity',
    blurb:
      'Почему local state строки должен быть связан с данными, а не с позицией массива.',
    component: ListIdentityPage,
  },
  {
    id: 'tree',
    label: '5. Перестройка дерева',
    blurb:
      'Как перенос subtree между слотами меняет mount, unmount, refs и внутреннее состояние.',
    component: TreeMovePage,
  },
  {
    id: 'strategy',
    label: '6. Практикум решений',
    blurb: 'Как осознанно выбирать между preserve и reset в реальных интерфейсах.',
    component: StateStrategyPage,
  },
] as const;

export function App() {
  const [activeLabId, setActiveLabId] = useState<(typeof labs)[number]['id']>('position');
  const activeLab = labs.find((item) => item.id === activeLabId) ?? labs[0];
  const ActiveComponent = activeLab.component;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 2 / Урок 17</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Сохранение, сброс и идентичность состояния
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Эта учебная страница разбирает, как React связывает state с позицией
              компонента в дереве, когда состояние сохраняется, когда сбрасывается и как
              осознанно управлять этим поведением через `key`, component type, структуру
              веток и перестройку дерева.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Связь state с деревом компонентов, preserving and resetting state, влияние
                `key`, идентичность списка, remount при смене type и поведение интерфейса
                при перестройке дерева.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как читать лаборатории
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Переключайте ветки и режимы identity, меняйте `key`, двигайте поддерево
                между слотами, переставляйте списки и наблюдайте, где local state живёт
                дальше, а где начинается заново.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В проекте есть реальные sandboxes с local state, mount/unmount журналами,
                `key`, списками, intentional remount и pure models, которые формулируют
                правила identity отдельно от UI.
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
                    Открывайте `src/components/state-identity`, `src/pages` и `src/lib`,
                    чтобы видеть отдельно живые React-сценарии и чистые модели для
                    preserve/reset, `key`, branch identity и tree rebuild.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Здесь намеренно собраны и хорошие, и плохие сценарии: reuse того же
                    экземпляра, reset через новый type, drift от index key и remount при
                    переносе subtree между слотами.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят в местах, где теряется логика identity: почему
                    initial state из props не пересчитывается, как `key` создаёт новый
                    экземпляр и чем CSS-перемещение отличается от реального tree move.
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
