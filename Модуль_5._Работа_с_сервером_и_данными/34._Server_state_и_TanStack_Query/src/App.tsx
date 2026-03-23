import clsx from 'clsx';
import { useState, type ComponentType } from 'react';

import { lessonLabs, type LabId } from './lib/learning-model';
import { stackBadges } from './lib/stack-meta';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { CachePage } from './pages/CachePage';
import { ConsistencyPage } from './pages/ConsistencyPage';
import { LayerPage } from './pages/LayerPage';
import { MutationPage } from './pages/MutationPage';
import { StalePage } from './pages/StalePage';

const labComponents: Record<LabId, ComponentType> = {
  layer: LayerPage,
  cache: CachePage,
  stale: StalePage,
  mutations: MutationPage,
  consistency: ConsistencyPage,
  architecture: ArchitecturePage,
};

export function App() {
  const [activeLabId, setActiveLabId] = useState<LabId>('layer');
  const [freshnessLens, setFreshnessLens] = useState<'freshness' | 'economy'>(
    'freshness',
  );
  const [ownershipLens, setOwnershipLens] = useState<'server' | 'client'>('server');
  const ActiveComponent = labComponents[activeLabId];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 5 / Урок 34</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Server state и TanStack Query
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Здесь вы разбираете server state как отдельный архитектурный слой: caching,
              stale data strategy, retries, invalidation, server mutations и причину, по
              которой ручное хранение серверных данных в `useState` и `useEffect` быстро
              становится хрупким.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Не только `useQuery` и `useMutation`, но и то, как cache, staleTime,
                retries и invalidation меняют архитектуру интерфейса и потока данных.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В проекте есть `QueryClient`, query keys, fake server, reusable hooks,
                `useMutation` с invalidation и отдельные pure-модели для stale strategy и
                архитектурных trade-offs.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Главная граница темы
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Server state живёт не по правилам обычного client state: он асинхронный,
                устаревающий, разделяемый и подтверждаемый сервером, а не компонентом.
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
                    Идите по порядку: сначала граница между client и server state, затем
                    cache sharing, stale strategy, mutations, consistency и только потом
                    архитектурный advisor.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Смотрите `src/query`, `src/hooks` и `src/lib/fake-server.ts` вместе:
                    так видно, где заканчивается transport layer, где начинается server
                    state слой и как UI подключается к query cache.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят рядом с `QueryClient`, abort-aware query functions,
                    invalidation scope и разделением local filter state от server data,
                    потому что именно там тема чаще всего смешивается в одну кучу.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Глобальные настройки урока
                </p>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Freshness lens</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(['freshness', 'economy'] as const).map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setFreshnessLens(value)}
                          className={
                            freshnessLens === value
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
                    <p className="text-sm font-medium text-slate-700">Ownership lens</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(['server', 'client'] as const).map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setOwnershipLens(value)}
                          className={
                            ownershipLens === value
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
                  Эта панель фиксирует две оптики темы: насколько агрессивно вы хотите
                  держать данные свежими и кому вообще принадлежит источник истины.
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
                в `package.json`, `QueryClient`-слое и текущем коде урока.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
