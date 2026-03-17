import clsx from 'clsx';
import { useState } from 'react';

import { stackBadges } from './lib/stack-meta';
import { BootFlowPage } from './pages/BootFlowPage';
import { DiagnosticsPage } from './pages/DiagnosticsPage';
import { ModesPage } from './pages/ModesPage';
import { PackageScriptsPage } from './pages/PackageScriptsPage';
import { QualityPage } from './pages/QualityPage';
import { StructurePage } from './pages/StructurePage';

// Вводная архитектура нарочно остаётся плоской: тема разбирает устройство проекта,
// поэтому переключение лабораторий выражено обычным React-состоянием без роутера.
const labs = [
  {
    id: 'boot',
    label: '1. Старт проекта',
    blurb: 'От терминала до браузера через entry, ES-модули и Vite.',
    component: BootFlowPage,
  },
  {
    id: 'manifest',
    label: '2. package.json и scripts',
    blurb: 'Зависимости, scripts, type: module, entry и поведение команд.',
    component: PackageScriptsPage,
  },
  {
    id: 'structure',
    label: '3. Структура проекта',
    blurb: 'index.html, main.tsx, App.tsx, страницы, lib и конфиги.',
    component: StructurePage,
  },
  {
    id: 'modes',
    label: '4. Dev и production',
    blurb: 'Dev server, hot reload/HMR, build, preview и Docker-поставка.',
    component: ModesPage,
  },
  {
    id: 'diagnostics',
    label: '5. Типовые поломки',
    blurb: 'Scripts, imports, env, root element и deployment-сбои.',
    component: DiagnosticsPage,
  },
  {
    id: 'quality',
    label: '6. Качество кода',
    blurb: 'TypeScript, ESLint, Prettier, Vitest и StrictMode.',
    component: QualityPage,
  },
] as const;

export function App() {
  const [activeLabId, setActiveLabId] = useState<(typeof labs)[number]['id']>('boot');
  const activeLab = labs.find((item) => item.id === activeLabId) ?? labs[0];
  const ActiveComponent = activeLab.component;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Module 0 / Topic 2</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              React Project Anatomy Lab
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Одна учебная страница для темы про окружение разработки и устройство
              React-проекта: вы переключаете лаборатории сверху, меняете конфигурацию,
              сравниваете режимы запуска и сразу видите, как связаны `package.json`,
              `type="module"`, entry points, dev server, bundler, build, lint и реальный
              код приложения.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Путь от `npm install` и `main.tsx` до первого рендера, структура
                каталогов, роль `ES-модулей`, смысл scripts, разницу между dev и
                production и типовые ошибки, которые ломают запуск.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как работать с лабораториями
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Выбирайте сценарий или режим, меняйте переключатели, читайте вывод команд,
                сравнивайте последствия и затем открывайте блок с файлами текущего проекта
                на этой же странице.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Здесь есть реальные конфиги `eslint`, `prettier`, `vitest`, Docker-обвязка
                и код, который намеренно отражает тему устройства frontend-проекта,
                включая entry-chain и работу Vite как dev server и bundler.
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
                    Начинайте с интерфейсной модели лаборатории, а затем переходите к
                    `package.json`, `src/main.tsx`, `src/App.tsx`, файлам страниц и
                    конфигам tooling, на которые страница ссылается ниже.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Сверяйте мысль страницы с самим кодом проекта: если лаборатория
                    говорит про scripts, их нужно видеть в `package.json`; если речь про
                    entry points, они должны быть выражены в `index.html` и
                    `src/main.tsx`.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии оставлены только в тех местах, где без них сложно понять
                    инженерный выбор: почему логика вынесена в pure functions, почему
                    shell сделан без роутера и как связаны конфиги качества с поведением
                    приложения.
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
                Внизу остаются только реальные версии инструментов из текущего проекта.
                Для Docker и Compose по-прежнему показываются только те части, которые
                действительно зафиксированы в файлах репозитория.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
