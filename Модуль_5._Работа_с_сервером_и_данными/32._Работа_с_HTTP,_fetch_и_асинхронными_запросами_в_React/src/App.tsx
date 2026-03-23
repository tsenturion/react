import clsx from 'clsx';
import { useState, type ComponentType } from 'react';

import { lessonLabs, type LabId } from './lib/learning-model';
import { stackBadges } from './lib/stack-meta';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { HttpPage } from './pages/HttpPage';
import { LifecyclePage } from './pages/LifecyclePage';
import { RacePage } from './pages/RacePage';
import { RetryPage } from './pages/RetryPage';
import { StatesPage } from './pages/StatesPage';

const labComponents: Record<LabId, ComponentType> = {
  http: HttpPage,
  states: StatesPage,
  lifecycle: LifecyclePage,
  retry: RetryPage,
  race: RacePage,
  architecture: ArchitecturePage,
};

export function App() {
  const [activeLabId, setActiveLabId] = useState<LabId>('http');
  const [networkLens, setNetworkLens] = useState<'ui' | 'transport'>('ui');
  const [requestStyle, setRequestStyle] = useState<'manual' | 'hook'>('hook');
  const ActiveComponent = labComponents[activeLabId];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 5 / Урок 32</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Работа с HTTP, fetch и асинхронными запросами в React
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Здесь вы связываете сетевой запрос, ожидания пользователя и интерфейс: от
              HTTP-основ и `fetch` до loading/error/empty states, `AbortController`,
              retries и защиты от логических гонок в клиентских компонентах.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Не только `fetch` как API, но и запрос как процесс: lifecycle, transport
                state, пользовательские ожидания и устойчивое обновление UI.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В проекте есть реальный `fetch` к локальному JSON, `AbortController`,
                retry-план, stale-response guard и хук, который собирает сетевое состояние
                в читаемую модель вместо набора разрозненных флагов.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Главная граница темы
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Один и тот же запрос можно сделать технически рабочим и архитектурно
                хрупким. Ключевой фокус урока — избежать useEffect-хаоса и гонок данных.
              </p>
            </div>
          </div>
        </header>

        <nav className="panel mb-8 p-2">
          <div className="flex flex-wrap gap-2">
            {lessonLabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveLabId(item.id)}
                className={clsx(
                  'rounded-2xl px-4 py-3 text-left transition',
                  activeLabId === item.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:bg-slate-50',
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
                    Идите по порядку: сначала HTTP и UI states, затем lifecycle, abort и
                    retries, после этого переходите к race conditions и архитектурной
                    части.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Открывайте `src/lib/http-client.ts`, `src/hooks/usePlaybookQuery.ts` и
                    `src/components/http-fetch`: там видны transport layer, orchestration
                    hook и UI-слой поверх одних и тех же сетевых сценариев.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят рядом с `AbortController`, stale-response guard и
                    reducer-like request transitions, потому что именно там чаще всего
                    появляются скрытые гонки и несогласованность состояния.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Глобальные настройки урока
                </p>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Network lens</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(['ui', 'transport'] as const).map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setNetworkLens(value)}
                          className={
                            networkLens === value
                              ? 'rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white'
                              : 'rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100'
                          }
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700">Request style</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(['manual', 'hook'] as const).map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRequestStyle(value)}
                          className={
                            requestStyle === value
                              ? 'rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white'
                              : 'rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100'
                          }
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
                  Эта панель не меняет логику лабораторий напрямую. Она фиксирует два угла
                  зрения на тему: transport-семантику запроса и UI-последствия этого
                  запроса внутри компонента.
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
                Здесь остаются только реальные версии инструментов, которые зафиксированы
                в `package.json`, Docker-конфигах и текущем коде урока.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
