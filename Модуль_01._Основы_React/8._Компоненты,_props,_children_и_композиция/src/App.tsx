import clsx from 'clsx';
import { useState } from 'react';

import { stackBadges } from './lib/stack-meta';
import { AntiPatternsPage } from './pages/AntiPatternsPage';
import { ApiDesignPage } from './pages/ApiDesignPage';
import { ChildrenCompositionPage } from './pages/ChildrenCompositionPage';
import { CompositionReusePage } from './pages/CompositionReusePage';
import { FunctionalComponentsPage } from './pages/FunctionalComponentsPage';
import { PropsFlowPage } from './pages/PropsFlowPage';

const labs = [
  {
    id: 'functional',
    label: '1. Функциональные компоненты и props',
    blurb:
      'Как компонент получает входные данные и остаётся независимой единицей интерфейса.',
    component: FunctionalComponentsPage,
  },
  {
    id: 'children',
    label: '2. Children и вложенность',
    blurb: 'Как компоненты принимают не только данные, но и другие элементы интерфейса.',
    component: ChildrenCompositionPage,
  },
  {
    id: 'props-flow',
    label: '3. Поток данных по дереву',
    blurb:
      'Как props проходят через дерево компонентов и какие поддеревья зависят от их изменения.',
    component: PropsFlowPage,
  },
  {
    id: 'composition',
    label: '4. Композиция и переиспользование',
    blurb:
      'Как из небольших компонентов собрать более крупный экран без copy-paste логики.',
    component: CompositionReusePage,
  },
  {
    id: 'api-design',
    label: '5. Проектирование API компонента',
    blurb:
      'Как сделать props понятными, а не превратить компонент в набор конфликтующих флагов.',
    component: ApiDesignPage,
  },
  {
    id: 'anti-patterns',
    label: '6. Ошибки и анти-паттерны',
    blurb:
      'Мутация props, зеркалирование props в state и попытки переписать компонент изнутри.',
    component: AntiPatternsPage,
  },
] as const;

export function App() {
  const [activeLabId, setActiveLabId] =
    useState<(typeof labs)[number]['id']>('functional');
  const activeLab = labs.find((item) => item.id === activeLabId) ?? labs[0];
  const ActiveComponent = activeLab.component;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Module 1 / Topic 8</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Компоненты, props, children и композиция
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Эта учебная страница разбирает компонентную модель React на реальных
              примерах. Вы меняете props, перестраиваете вложенность, собираете экран из
              переиспользуемых частей, отслеживаете поток данных по дереву и видите,
              почему хорошие компоненты управляются входными данными, а не внутренними
              обходными путями.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Функциональные компоненты, `props`, `children`, вложенность,
                переиспользование, компонентный API, поток данных по дереву и частые
                ошибки при проектировании компонентов.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как работать с лабораториями
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Меняйте props и layout-параметры, передавайте разные `children`,
                переключайте API-компонентов и смотрите, как одно и то же дерево
                интерфейса собирается из независимых частей.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В проекте есть реальные функциональные компоненты, slot-based обёртки на
                `children`, вложенные композиции, отдельные примеры хорошего и плохого API
                и sandboxes с анти-паттернами мутации props и рассинхрона данных.
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
                    Сначала меняйте props и `children` в лаборатории, затем открывайте
                    `src/components/composition`, `src/pages` и `src/lib`, чтобы видеть,
                    как компонентная модель выражена в коде буквально.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Тема читается через реальные компоненты: одни получают данные через
                    props, другие принимают `children`, третьи собирают экран из уже
                    существующих блоков без копирования разметки.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят там, где особенно легко ошибиться: почему props
                    нельзя мутировать, зачем не дублировать их в локальный state без
                    причины и как отделять API компонента от его внутренней реализации.
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
