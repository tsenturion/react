import clsx from 'clsx';
import { useState } from 'react';

import { stackBadges } from './lib/stack-meta';
import { DiagnosticsPage } from './pages/DiagnosticsPage';
import { EntryFlowPage } from './pages/EntryFlowPage';
import { RootLifecyclePage } from './pages/RootLifecyclePage';
import { RuntimeModesPage } from './pages/RuntimeModesPage';
import { StarterStructurePage } from './pages/StarterStructurePage';
import { StrictModePage } from './pages/StrictModePage';

// Для этой темы важна именно цепочка входа в DOM, а не маршрутизация,
// поэтому лаборатории переключаются простым локальным состоянием в одном App shell.
const labs = [
  {
    id: 'entry',
    label: '1. Вход в HTML и createRoot',
    blurb:
      'Как `index.html`, `main.tsx`, `createRoot(...)` и `root.render(...)` собираются в одну цепочку.',
    component: EntryFlowPage,
  },
  {
    id: 'lifecycle',
    label: '2. Root lifecycle',
    blurb: 'Живой sandbox для создания, обновления и очистки отдельного React Root.',
    component: RootLifecyclePage,
  },
  {
    id: 'strict-mode',
    label: '3. StrictMode',
    blurb: 'Dev-only checks, нечистые компоненты и отличие development от production.',
    component: StrictModePage,
  },
  {
    id: 'structure',
    label: '4. Структура первого приложения',
    blurb: 'Роли `index.html`, `main.tsx`, `App.tsx` и стартового дерева компонентов.',
    component: StarterStructurePage,
  },
  {
    id: 'runtime',
    label: '5. Development vs production',
    blurb:
      'HMR, optimized bundle, runtime expectations и почему режимы нельзя смешивать в голове.',
    component: RuntimeModesPage,
  },
  {
    id: 'diagnostics',
    label: '6. Типовые ошибки старта',
    blurb:
      'Null container, повторный createRoot, StrictMode-assumptions и другие частые сбои.',
    component: DiagnosticsPage,
  },
] as const;

export function App() {
  const [activeLabId, setActiveLabId] = useState<(typeof labs)[number]['id']>('entry');
  const activeLab = labs.find((item) => item.id === activeLabId) ?? labs[0];
  const ActiveComponent = activeLab.component;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Module 1 / Topic 6</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              CreateRoot, React Root and DOM Mounting Lab
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Одна учебная страница для темы про создание React-приложения и его
              подключение к DOM. Вы разбираете путь от `index.html` до `App`, создаёте
              отдельные root в sandbox, сравниваете StrictMode в development и production
              и видите, как устройство входной цепочки отражается в коде самого проекта.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                `createRoot`, lifecycle `React Root`, `StrictMode`, dev-only checks, вход
                приложения в HTML-страницу, стартовую структуру файлов и отличие
                development от production.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как работать с лабораториями
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Ломайте входную цепочку, создавайте и очищайте отдельный root,
                перемонтируйте StrictMode-sandbox и сравнивайте режимы запуска. Затем
                открывайте файлы и листинги из текущего проекта ниже.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В проекте есть реальный `src/main.tsx` с `createRoot(...)`, отдельные
                sub-root sandbox-компоненты, чистые модели для разбора сценариев и
                комментарии в тех местах, где lifecycle или dev-check поведение легко
                понять неправильно.
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
                    Сначала смотрите на саму входную цепочку и sandbox-поведение, а уже
                    потом переходите к `index.html`, `src/main.tsx`, `src/App.tsx` и
                    связанным компонентам ниже.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Тема должна читаться в коде буквально: `createRoot(...)` реально есть
                    в проекте, sub-root реально создаются в sandbox, а StrictMode
                    сравнивается через отдельный runtime-host.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят там, где легко ошибиться архитектурно: зачем нужен
                    отдельный root вне App tree, почему `main.tsx` лучше держать
                    прозрачным и почему нельзя зависеть от StrictMode-дублирования.
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
