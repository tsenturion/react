import clsx from 'clsx';
import { useState } from 'react';

import { lessonLabs, type LabId } from './lib/learning-model';
import { stackBadges } from './lib/stack-meta';
import { DebugValuePage } from './pages/DebugValuePage';
import { LintPage } from './pages/LintPage';
import { PurityPage } from './pages/PurityPage';
import { RulesPage } from './pages/RulesPage';
import { SyncStorePage } from './pages/SyncStorePage';
import { UseIdPage } from './pages/UseIdPage';

const labComponents = {
  useid: UseIdPage,
  debug: DebugValuePage,
  'sync-store': SyncStorePage,
  rules: RulesPage,
  purity: PurityPage,
  lint: LintPage,
} as const;

export function App() {
  const [activeLabId, setActiveLabId] = useState<LabId>('useid');
  const activeLab = lessonLabs.find((item) => item.id === activeLabId) ?? lessonLabs[0];
  const ActiveComponent = labComponents[activeLab.id];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 3 / Урок 26</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Продвинутые хуки и правила React
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Эта учебная страница показывает, как `useId`, `useDebugValue` и
              `useSyncExternalStore` работают в реальных сценариях, и почему rules of
              hooks, purity, refs и lint discipline нужны не ради формальной проверки, а
              ради предсказуемого выполнения компонента.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Где уместен `useId`, как `useDebugValue` помогает читать custom hooks,
                почему внешние store нужны именно через `useSyncExternalStore` и как
                lint-правила страхуют order, deps, purity и refs.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как читать лаборатории
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Сначала пройдите `useId`, затем `useDebugValue` и `useSyncExternalStore`.
                После этого переходите к симулятору rules of hooks, purity/ref pitfalls и
                завершайте урок lint-first сценарием с реальным ESLint-конфигом проекта.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В проекте есть реальные advanced hooks, внешний store на
                `useSyncExternalStore`, custom hook с `useDebugValue`, stable DOM ids
                через `useId` и `eslint-plugin-react-hooks` в `recommended-latest` preset.
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
                onClick={() => setActiveLabId(item.id)}
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
                    Открывайте `src/hooks`, `src/components/advanced-hooks`, `src/lib` и
                    `eslint.config.js`, чтобы видеть отдельно advanced hooks,
                    live-сценарии, pure model слой и реальный lint guardrail.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    В проекте deliberately показаны и рабочие решения, и запахи: `useId`
                    против id из рендера, `useSyncExternalStore` против ручного
                    store-bridge и симулятор нарушений order/purity без поломки самого
                    урока.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят там, где обычно теряется смысл: вокруг
                    `useDebugValue`, внешнего store, границ `useId` и выбора
                    `recommended-latest` для `eslint-plugin-react-hooks`.
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
