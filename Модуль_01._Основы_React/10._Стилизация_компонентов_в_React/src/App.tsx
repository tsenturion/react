import clsx from 'clsx';
import { useState } from 'react';

import { stackBadges } from './lib/stack-meta';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { ClassNamePage } from './pages/ClassNamePage';
import { ConditionalStylingPage } from './pages/ConditionalStylingPage';
import { CssModulesPage } from './pages/CssModulesPage';
import { InlineStylesPage } from './pages/InlineStylesPage';
import { ThemesPage } from './pages/ThemesPage';

const labs = [
  {
    id: 'class-name',
    label: '1. className и CSS',
    blurb: 'Обычные CSS-файлы, модификаторы и связь `className` с отдельным stylesheet.',
    component: ClassNamePage,
  },
  {
    id: 'modules',
    label: '2. CSS Modules',
    blurb: 'Локальные классы, изоляция и сравнение с глобальным CSS.',
    component: CssModulesPage,
  },
  {
    id: 'inline',
    label: '3. Inline styles',
    blurb: 'Runtime-значения, `style={{...}}` и границы такого подхода.',
    component: InlineStylesPage,
  },
  {
    id: 'conditional',
    label: '4. Conditional styling',
    blurb: 'Как состояние компонента влияет на внешний вид через variant maps.',
    component: ConditionalStylingPage,
  },
  {
    id: 'themes',
    label: '5. Темы и токены',
    blurb: 'Переключение тем, CSS variables и контейнерный `data-theme`.',
    component: ThemesPage,
  },
  {
    id: 'architecture',
    label: '6. Архитектура',
    blurb: 'Сравнение подходов и выбор схемы стилизации под ограничения задачи.',
    component: ArchitecturePage,
  },
] as const;

export function App() {
  const [activeLabId, setActiveLabId] =
    useState<(typeof labs)[number]['id']>('class-name');
  const activeLab = labs.find((item) => item.id === activeLabId) ?? labs[0];
  const ActiveComponent = activeLab.component;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 1 / Урок 10</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Стилизация компонентов в React
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Эта учебная страница разбирает стилизацию компонентов как архитектурную
              часть React-приложения. Вы переключаете подходы, меняете темы, включаете
              состояния, сравниваете CSS Modules с глобальным CSS, смотрите границы inline
              styles и связываете UI с реальными файлами текущего проекта.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                `className`, CSS-файлы, CSS Modules, `style={'{...}'}`, dynamic styles,
                conditional styling, темы, изоляцию стилей и архитектуру масштабируемой
                стилизации.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как читать лаборатории
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Сначала меняйте параметры в live-превью, затем смотрите, какой подход
                породил этот внешний вид: обычный CSS, module-файл, inline object, theme
                tokens или recipe-функция.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В проекте есть реальные CSS-файлы, `.module.css`, `data-theme`, компоненты
                с inline style objects, variant maps и чистые модели, которые сравнивают
                подходы по ограничениям задачи.
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
                    Открывайте `src/components/styling`, `src/styles`, `src/pages` и
                    `src/lib`, чтобы видеть, где заканчивается логика компонента и где
                    начинается конкретный способ стилизации.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Тема раскрывается буквально: обычный CSS действительно импортируется в
                    компонент, module-классы реально изолированы, а theme tokens живут в
                    CSS variables, а не только в описании на странице.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят в важных местах: почему inline styles здесь уместны,
                    зачем variant maps выносить из JSX и как container theme меняет весь
                    компонентный набор без переписывания разметки.
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
