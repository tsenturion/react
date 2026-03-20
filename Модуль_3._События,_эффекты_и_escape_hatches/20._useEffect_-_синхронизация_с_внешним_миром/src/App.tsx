import clsx from 'clsx';
import { useState } from 'react';

import { stackBadges } from './lib/stack-meta';
import { LifecyclePage } from './pages/LifecyclePage';
import { NeedEffectPage } from './pages/NeedEffectPage';
import { PitfallPage } from './pages/PitfallPage';
import { RequestSyncPage } from './pages/RequestSyncPage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { TimerCleanupPage } from './pages/TimerCleanupPage';

const labs = [
  {
    id: 'need',
    label: '1. Когда effect нужен',
    blurb: 'Как отличать синхронизацию с внешним миром от обычного вычисления в render.',
    component: NeedEffectPage,
  },
  {
    id: 'lifecycle',
    label: '2. Dependencies и lifecycle',
    blurb:
      'Как effect запускается, очищается и почему неполные dependencies делают синхронизацию stale.',
    component: LifecyclePage,
  },
  {
    id: 'timers',
    label: '3. Таймеры и cleanup',
    blurb:
      'Как interval живёт вне React и почему без cleanup таймеры начинают течь и дублироваться.',
    component: TimerCleanupPage,
  },
  {
    id: 'subscriptions',
    label: '4. Подписки и внешние API',
    blurb: 'Как setup и cleanup управляют подписками на внешние источники событий.',
    component: SubscriptionPage,
  },
  {
    id: 'requests',
    label: '5. Сетевые запросы',
    blurb: 'Как useEffect синхронизирует query с fetch и защищает UI от stale responses.',
    component: RequestSyncPage,
  },
  {
    id: 'pitfalls',
    label: '6. Лишние эффекты и циклы',
    blurb:
      'Как неправильные dependencies, лишние effects и loop risk ломают устойчивость интерфейса.',
    component: PitfallPage,
  },
] as const;

export function App() {
  const [activeLabId, setActiveLabId] = useState<(typeof labs)[number]['id']>('need');
  const activeLab = labs.find((item) => item.id === activeLabId) ?? labs[0];
  const ActiveComponent = activeLab.component;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 3 / Урок 20</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              useEffect: синхронизация с внешним миром
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Эта учебная страница показывает, как useEffect работает именно как механизм
              синхронизации с внешними системами: таймерами, подписками, запросами,
              browser API и другими процессами, которые живут за пределами React render.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Когда effect действительно нужен, как работают dependencies и cleanup, как
                синхронизировать таймеры, подписки и fetch, и почему лишние effects
                создают loops, leaks и stale UI.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как читать лаборатории
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Сначала отделите обычное вычисление от внешней синхронизации, затем
                пройдите setup/cleanup, после этого проверьте таймеры, подписки и запросы,
                и завершите урок разбором анти-паттернов.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В проекте есть реальные useEffect-сценарии с таймерами, подписками, fetch,
                cleanup и abort, а рядом лежат чистые модели, которые отдельно фиксируют
                правильные и неправильные архитектурные решения.
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
                    Открывайте `src/components/effects`, `src/pages` и `src/lib`, чтобы
                    видеть отдельно живые useEffect-сценарии, учебные страницы и чистые
                    функции для объяснения зависимостей, cleanup и stale states.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Здесь intentionally показаны и хорошие, и плохие варианты: derived
                    values без effect, корректные cleanup для timer/subscription/fetch и
                    анти-паттерны с пропущенными deps, unstable objects и loop risk.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят в местах, где чаще всего путают useEffect: почему
                    вычисление лучше оставить в render, зачем cleanup обязателен и как
                    отличать нормальную синхронизацию от лишнего effect-а.
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
