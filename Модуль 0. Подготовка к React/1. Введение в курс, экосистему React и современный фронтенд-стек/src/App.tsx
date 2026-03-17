import clsx from "clsx";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import { stackBadges } from "./lib/stack-meta";
import { DeliveryModesPage } from "./pages/DeliveryModesPage";
import { EcosystemPage } from "./pages/EcosystemPage";
import { PipelinePage } from "./pages/PipelinePage";
import { ToolingPage } from "./pages/ToolingPage";
import { WhyReactPage } from "./pages/WhyReactPage";

// Тема 1 теперь использует реальный client-side React Router:
// общий layout остаётся единым, а лаборатории становятся отдельными URL-маршрутами.
export const labs = [
  {
    id: "ecosystem",
    path: "/ecosystem",
    label: "1. Карта экосистемы",
    blurb:
      "Браузер, DOM, Node.js, npm, Vite, React Router framework mode, Next.js.",
    component: EcosystemPage,
  },
  {
    id: "why-react",
    path: "/why-react",
    label: "2. Зачем React",
    blurb: "Императивный DOM-подход против компонентной модели.",
    component: WhyReactPage,
  },
  {
    id: "pipeline",
    path: "/pipeline",
    label: "3. Pipeline",
    blurb: "Путь от исходников и зависимостей до результата в браузере.",
    component: PipelinePage,
  },
  {
    id: "delivery",
    path: "/delivery",
    label: "4. Подходы доставки",
    blurb: "No-build, Vite SPA, React Router framework mode и Next.js.",
    component: DeliveryModesPage,
  },
  {
    id: "tooling",
    path: "/tooling",
    label: "5. Tooling",
    blurb: "Node.js, scripts, tests, Docker и типовые сбои среды.",
    component: ToolingPage,
  },
] as const;

export function AppLayout() {
  const location = useLocation();
  const activeLab =
    labs.find((item) => item.path === location.pathname) ?? labs[0];

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
              Одна учебная страница для асинхронного изучения темы: вы
              переключаете лаборатории сверху, сравниваете сценарии,
              провоцируете ошибки и сразу видите, как работает современный
              React-стек в реальной инженерной цепочке.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что вы проверяете
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Причинно-следственные связи между кодом, сборкой, зависимостями,
                архитектурным выбором и тем, что в итоге получает браузер.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как работать с проектом
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Переключайте лаборатории сверху, меняйте параметры внутри блока,
                сравнивайте состояния до/после и следите, как URL-маршрут
                отражает текущую лабораторию.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Текущий учебный проект намеренно остаётся Vite SPA с обычным
                клиентским React Router: так client-side pipeline,
                маршрутизация, layout и URL-структура видны прямо в коде
                текущего проекта, а framework mode и Next.js остаются отдельным
                следующим слоем.
              </p>
            </div>
          </div>
        </header>

        <nav className="panel mb-8 p-2">
          <div className="flex flex-wrap gap-2">
            {labs.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    "rounded-xl px-4 py-3 text-left transition-all duration-200",
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-100",
                  )
                }
              >
                <span className="block text-sm font-semibold">
                  {item.label}
                </span>
                <span
                  className={clsx(
                    "mt-1 block text-xs leading-5",
                    activeLab.path === item.path
                      ? "text-blue-100"
                      : "text-slate-500",
                  )}
                >
                  {item.blurb}
                </span>
              </NavLink>
            ))}
          </div>
        </nav>

        <main className="panel p-6 sm:p-8">
          {/* Layout остаётся общим, а контент лаборатории подставляется через Outlet. */}
          <Outlet />
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
                    Сначала выберите лабораторию сверху, затем разберите её
                    интерактивную логику в UI, а после этого откройте блок с
                    файлами проекта внутри самой лаборатории.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Смотрите не только на то, что показывает интерфейс, но и на
                    то, как эти выводы выражены в `src/router.tsx`,
                    `src/lib/learning-model.ts`, страницах лабораторий и
                    инфраструктурных файлах.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Если какая-то идея важна архитектурно, ищите её сразу в двух
                    местах: в демо-сценарии страницы и в самом коде проекта, на
                    который страница ссылается.
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
                В этом блоке показаны только те версии, которые реально
                зафиксированы в проекте: пакеты из `package.json` и образы из
                `Dockerfile`. Версия самого Docker/Compose зависит от вашей
                локальной среды, поэтому она здесь не захардкожена.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
