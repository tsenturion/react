import clsx from 'clsx';
import { useState } from 'react';

import { stackBadges } from './lib/stack-meta';
import { ConditionalRenderingPage } from './pages/ConditionalRenderingPage';
import { DynamicUiPage } from './pages/DynamicUiPage';
import { FragmentPage } from './pages/FragmentPage';
import { KeyIdentityPage } from './pages/KeyIdentityPage';
import { ListRenderingPage } from './pages/ListRenderingPage';
import { ReconciliationPage } from './pages/ReconciliationPage';

const labs = [
  {
    id: 'conditions',
    label: '1. Условия в JSX',
    blurb: 'Сравнение `if`, ternary и `&&` на реальных блоках интерфейса.',
    component: ConditionalRenderingPage,
  },
  {
    id: 'lists',
    label: '2. Списки из данных',
    blurb: 'Как `map(...)`, фильтрация и условия собирают динамический список.',
    component: ListRenderingPage,
  },
  {
    id: 'keys',
    label: '3. key и идентичность',
    blurb: 'Как стабильный `key` сохраняет локальное состояние элементов списка.',
    component: KeyIdentityPage,
  },
  {
    id: 'reconciliation',
    label: '4. Reconciliation и diffing',
    blurb:
      'Как React определяет, что изменилось в списке, и где `key` влияет на сравнение.',
    component: ReconciliationPage,
  },
  {
    id: 'fragments',
    label: '5. Фрагменты в списках',
    blurb: 'Как вернуть несколько siblings без лишней разметки и не сломать структуру.',
    component: FragmentPage,
  },
  {
    id: 'dynamic-ui',
    label: '6. Скрытые баги с key',
    blurb:
      'Живые сценарии, где неправильные ключи вызывают визуальные артефакты и рассинхрон.',
    component: DynamicUiPage,
  },
] as const;

export function App() {
  const [activeLabId, setActiveLabId] =
    useState<(typeof labs)[number]['id']>('conditions');
  const activeLab = labs.find((item) => item.id === activeLabId) ?? labs[0];
  const ActiveComponent = activeLab.component;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 1 / Урок 9</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Условный рендеринг, списки, key и фрагменты
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Эта учебная страница разбирает, как React строит динамический интерфейс из
              данных. Вы переключаете условия, меняете порядок элементов, сравниваете
              разные стратегии `key`, наблюдаете скрытые баги состояния и видите, как
              фрагменты помогают держать структуру корректной без лишней разметки.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Условия через `if`, ternary и `&&`, рендер списков, роль `key`, diffing,
                reconciliation, фрагменты и типичные баги при нестабильных ключах.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как работать с лабораториями
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Меняйте фильтры, переставляйте элементы, переключайте стратегию `key`,
                открывайте и скрывайте блоки интерфейса и сразу сравнивайте итоговый UI с
                текущим деревом элементов и кодом проекта.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В проекте есть реальные списки через `map(...)`, sandboxes с разными
                `key`, локальное состояние элементов списка, модели сравнения diffing и
                примеры фрагментов в структурно чувствительной разметке.
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
                    Сначала меняйте данные и стратегию ключей в лаборатории, затем
                    открывайте `src/components/lists`, `src/components/identity`,
                    `src/pages` и `src/lib`, чтобы видеть механизм прямо в коде.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Тема раскрывается буквально: список действительно строится из данных,
                    `key` реально меняет поведение элементов с локальным состоянием, а
                    фрагменты используются там, где лишняя обёртка ломает структуру.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят в неочевидных местах: почему индекс нельзя считать
                    универсальным `key`, зачем локальное состояние в item-компоненте
                    помогает увидеть баг и как фрагменты участвуют в списках.
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
