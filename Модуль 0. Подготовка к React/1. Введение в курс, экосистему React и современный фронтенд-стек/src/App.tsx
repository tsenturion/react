import clsx from 'clsx';
import { useState } from 'react';

import { stackBadges, stackSummary } from './lib/stack-meta';
import { DeliveryModesPage } from './pages/DeliveryModesPage';
import { EcosystemPage } from './pages/EcosystemPage';
import { PipelinePage } from './pages/PipelinePage';
import { ToolingPage } from './pages/ToolingPage';
import { WhyReactPage } from './pages/WhyReactPage';

// Вводная тема держит shell максимально плоским: переключение лабораторий сделано
// локальным состоянием, а роутинг остаётся предметом изучения внутри самих страниц.
const labs = [
  {
    id: 'ecosystem',
    label: '1. Карта экосистемы',
    blurb: 'Браузер, DOM, Node.js, npm, Vite, Router, framework.',
    component: EcosystemPage,
  },
  {
    id: 'why-react',
    label: '2. Зачем React',
    blurb: 'Императивный DOM-подход против компонентной модели.',
    component: WhyReactPage,
  },
  {
    id: 'pipeline',
    label: '3. Pipeline',
    blurb: 'Путь от исходников и зависимостей до результата в браузере.',
    component: PipelinePage,
  },
  {
    id: 'delivery',
    label: '4. Подходы доставки',
    blurb: 'No-build, Vite SPA и framework-first в одном сравнении.',
    component: DeliveryModesPage,
  },
  {
    id: 'tooling',
    label: '5. Tooling',
    blurb: 'Node.js, scripts, tests, Docker и типовые сбои среды.',
    component: ToolingPage,
  },
];

export function App() {
  const [activeLabId, setActiveLabId] = useState<(typeof labs)[number]['id']>('ecosystem');
  // Конфиг labs -> выбранный id -> компонент. Это намеренно простой пример
  // декларативной композиции React без лишней инфраструктуры вокруг темы введения.
  const activeLab = labs.find((item) => item.id === activeLabId) ?? labs[0];
  const ActiveComponent = activeLab.component;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Module 0 / Topic 1</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              React Ecosystem Lab
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Одна учебная страница для асинхронного изучения темы: вы переключаете лаборатории сверху, сравниваете сценарии, провоцируете ошибки и сразу видите, как работает современный React-стек в реальной инженерной цепочке.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что вы проверяете
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Причинно-следственные связи между кодом, сборкой, зависимостями, архитектурным выбором и тем, что в итоге получает браузер.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как работать с проектом
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Переключайте лаборатории сверху, меняйте параметры внутри блока, сравнивайте состояния до/после и проверяйте типичные сбои прямо в интерфейсе.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Стек проекта
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {stackSummary} Код проекта тоже построен так, чтобы раскрывать тему через структуру приложения, а не только через UI-демо.
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
                    Сначала выберите лабораторию сверху, затем разберите её интерактивную логику в UI, а после этого откройте блок с файлами проекта внутри самой лаборатории.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Смотрите не только на то, что показывает интерфейс, но и на то, как эти выводы выражены в `src/lib/learning-model.ts`, страницах лабораторий и инфраструктурных файлах.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Если какая-то идея важна архитектурно, ищите её сразу в двух местах: в демо-сценарии страницы и в самом коде проекта, на который страница ссылается.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                Стек проекта
              </h2>
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
                В этом блоке показаны только те версии, которые реально зафиксированы в проекте: пакеты из `package.json` и образы из `Dockerfile`. Версия самого Docker/Compose зависит от вашей локальной среды, поэтому она здесь не захардкожена.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
