import clsx from 'clsx';
import { useState } from 'react';

import { stackBadges } from './lib/stack-meta';
import { ComponentTreePage } from './pages/ComponentTreePage';
import { DataCompositionPage } from './pages/DataCompositionPage';
import { DeclarativePage } from './pages/DeclarativePage';
import { ReactValuePage } from './pages/ReactValuePage';
import { ReactVsJsPage } from './pages/ReactVsJsPage';
import { ThinkingComponentsPage } from './pages/ThinkingComponentsPage';

// На этом уроке важно видеть именно компонентный подход, поэтому навигация остаётся
// простой: одна страница, один activeLabId и фокус на composition/state/tree, а не на router.
const labs = [
  {
    id: 'react-value',
    label: '1. Зачем React',
    blurb:
      'Где React начинает окупаться и почему UI удобнее мыслить как систему компонентов.',
    component: ReactValuePage,
  },
  {
    id: 'declarative',
    label: '2. Декларативный UI',
    blurb: 'Одна и та же задача через ручные DOM-команды и через данные + рендер.',
    component: DeclarativePage,
  },
  {
    id: 'thinking-components',
    label: '3. Thinking in Components',
    blurb:
      'Как провести границы компонентов и не скатиться ни в монолит, ни в атомизацию.',
    component: ThinkingComponentsPage,
  },
  {
    id: 'component-tree',
    label: '4. Component Tree',
    blurb: 'Где живёт state, как идут props и почему дерево UI важно читать явно.',
    component: ComponentTreePage,
  },
  {
    id: 'react-vs-js',
    label: '5. Обычный JS vs React',
    blurb: 'Реальный imperative DOM рядом с React-компонентом для той же задачи.',
    component: ReactVsJsPage,
  },
  {
    id: 'composition',
    label: '6. Данные, state и композиция',
    blurb:
      'Как экран собирается из независимых частей, а UI становится следствием данных.',
    component: DataCompositionPage,
  },
] as const;

export function App() {
  const [activeLabId, setActiveLabId] =
    useState<(typeof labs)[number]['id']>('react-value');
  const activeLab = labs.find((item) => item.id === activeLabId) ?? labs[0];
  const ActiveComponent = activeLab.component;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Module 1 / Topic 5</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              React Intro, Declarative Thinking and Component Architecture Lab
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Одна учебная страница для темы про введение в React. Вы переключаете
              лаборатории сверху, сравниваете императивный и декларативный подход,
              раскладываете экран на компоненты, изучаете дерево UI и видите, как один и
              тот же интерфейс начинает описываться через данные, состояние и композицию.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Что такое React, где он нужен, как работает декларативное мышление, почему
                UI удобно разбивать на компоненты, как читать component tree и как один и
                тот же экран выглядит в обычном JS и в React.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как работать с лабораториями
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Меняйте режимы экрана, фильтры, владельца состояния и способ деления на
                компоненты. Затем открывайте ссылки на файлы ниже и смотрите, как те же
                идеи выражены в текущем коде проекта.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Проект сам собран как дерево React-компонентов: есть отдельные
                presentational части, pure models, composition layout и даже imperative
                DOM-блок, сделанный вручную для честного сравнения с React-версией.
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
                    Сначала меняйте состояние лаборатории и наблюдайте итоговый UI, а уже
                    потом переходите к `src/pages`, `src/components` и `src/lib`, которые
                    показаны на каждой странице.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Смотрите на код как на продолжение темы: если лаборатория разбирает
                    компонентную архитектуру, проект сам должен быть собран из
                    компонентов, а не только говорить об этом в тексте.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии оставлены там, где решение может быть неочевидным: почему
                    imperative preview пишет в DOM вручную, зачем layout собирается через
                    slot-like props и где проходит owner граница для state.
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
                Внизу остаются только реальные версии инструментов, зафиксированные в
                текущем `package.json`, `Dockerfile` и конфигурациях проекта.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
