import clsx from 'clsx';
import { useState } from 'react';

import { stackBadges } from './lib/stack-meta';
import { AsyncEffectPage } from './pages/AsyncEffectPage';
import { EffectEventPage } from './pages/EffectEventPage';
import { EventSeparationPage } from './pages/EventSeparationPage';
import { RaceConditionPage } from './pages/RaceConditionPage';
import { RemoveEffectPage } from './pages/RemoveEffectPage';
import { StaleClosurePage } from './pages/StaleClosurePage';

const labs = [
  {
    id: 'async',
    label: '1. Async внутри effect',
    blurb: 'Effect-local async, cleanup и правильная форма синхронизации.',
    component: AsyncEffectPage,
  },
  {
    id: 'race',
    label: '2. Race conditions',
    blurb: 'Stale responses, ignore stale work и AbortController.',
    component: RaceConditionPage,
  },
  {
    id: 'closures',
    label: '3. Stale closures',
    blurb: 'Почему interval и listeners могут читать старый snapshot render-а.',
    component: StaleClosurePage,
  },
  {
    id: 'events',
    label: '4. Events vs effects',
    blurb: 'Как отделять пользовательские действия от фоновой синхронизации.',
    component: EventSeparationPage,
  },
  {
    id: 'effect-event',
    label: '5. useEffectEvent',
    blurb: 'Свежие props без лишнего reconnect внешнего effect-а.',
    component: EffectEventPage,
  },
  {
    id: 'remove',
    label: '6. Удаление лишних эффектов',
    blurb: 'Derived values, drift и выведение данных прямо в render.',
    component: RemoveEffectPage,
  },
] as const;

export function App() {
  const [activeLabId, setActiveLabId] = useState<(typeof labs)[number]['id']>('async');
  const activeLab = labs.find((item) => item.id === activeLabId) ?? labs[0];
  const ActiveComponent = activeLab.component;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 3 / Урок 21</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Продвинутая работа с эффектами и удаление лишних эффектов
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Эта учебная страница показывает useEffect не как место «для любого кода
              после render», а как точный механизм синхронизации с внешним миром. Здесь
              разбираются async внутри effect, race conditions, stale closures,
              useEffectEvent и архитектурные способы убирать лишние эффекты.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Когда effect нужен, как защищаться от гонок и stale closures, как отделять
                события от синхронизации, и как убирать mirrored state, который делает
                интерфейс хрупким.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как читать лаборатории
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Сначала разберите форму async-эффекта и гонки запросов, затем проверьте
                stale closures, после этого сравните события с effect-ами и завершите урок
                useEffectEvent и удалением лишней синхронизации.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В проекте есть реальные async effects, AbortController, stale closure
                sandboxes, useEffectEvent и сравнение mirrored vs derived state на одном и
                том же наборе данных.
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
                    Открывайте `src/components/advanced-effects`, `src/pages` и `src/lib`,
                    чтобы видеть отдельно живые sandboxes, учебные страницы и чистые
                    модели причинно-следственных связей.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Здесь intentionally сохранены и удачные, и неудачные варианты: async
                    callback smell, stale closures, reconnect storm и mirrored state с
                    drift, чтобы различия были видны в действии.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят в местах, где чаще всего путают архитектуру: зачем
                    cleanup владеет abort, почему useEffectEvent не равен обычной
                    dependency и почему derived data не стоит хранить отдельным state.
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
