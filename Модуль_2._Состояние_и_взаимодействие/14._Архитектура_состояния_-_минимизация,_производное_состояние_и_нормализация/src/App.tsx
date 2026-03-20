import clsx from 'clsx';
import { useState } from 'react';

import { stackBadges } from './lib/stack-meta';
import { ColocatedStatePage } from './pages/ColocatedStatePage';
import { DerivedStatePage } from './pages/DerivedStatePage';
import { DuplicateStatePage } from './pages/DuplicateStatePage';
import { MinimalStatePage } from './pages/MinimalStatePage';
import { NormalizationArchitecturePage } from './pages/NormalizationArchitecturePage';
import { PlacementPage } from './pages/PlacementPage';

const labs = [
  {
    id: 'minimal',
    label: '1. Минимальный state',
    blurb:
      'Что действительно нужно хранить, а что лучше каждый рендер производить из raw данных.',
    component: MinimalStatePage,
  },
  {
    id: 'derived',
    label: '2. Derived state',
    blurb:
      'Почему totals, counts и filtered data часто становятся источником drift, если хранить их отдельно.',
    component: DerivedStatePage,
  },
  {
    id: 'duplicate',
    label: '3. Дублирование state',
    blurb: 'Как duplicated selectedTitle и selectedId делают архитектуру хрупкой.',
    component: DuplicateStatePage,
  },
  {
    id: 'colocated',
    label: '4. Colocated state',
    blurb:
      'Когда состояние живёт рядом с leaf-компонентом, а когда его действительно нужно поднимать.',
    component: ColocatedStatePage,
  },
  {
    id: 'placement',
    label: '5. Где хранить state',
    blurb:
      'Архитектурное решение через признаки данных: derive, local, shared parent, normalized или server-owned.',
    component: PlacementPage,
  },
  {
    id: 'normalize',
    label: '6. Нормализация',
    blurb: 'Как нормализация убирает дублирование сущностей и делает UI устойчивее.',
    component: NormalizationArchitecturePage,
  },
] as const;

export function App() {
  const [activeLabId, setActiveLabId] = useState<(typeof labs)[number]['id']>('minimal');
  const activeLab = labs.find((item) => item.id === activeLabId) ?? labs[0];
  const ActiveComponent = activeLab.component;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 2 / Урок 14</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Архитектура состояния: минимизация, производное состояние и нормализация
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Эта учебная страница разбирает архитектуру state как причину простоты или
              сложности интерфейса. Здесь можно проверить минимальный state, derived
              values, duplicated copies, colocated state, выбор владельца состояния и
              normalization на живых сценариях.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Минимальное состояние, производные значения, colocated state, выбор места
                хранения, normalization и причинно-следственную связь между формой state и
                сложностью компонента.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как читать лаборатории
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Переключайте режимы, ломайте синхронность duplicated state, меняйте место
                хранения open-флагов и сравнивайте nested copies с normalized entities.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В проекте есть реальные React-компоненты с разными state-архитектурами и
                чистые JS-модели, которые объясняют, почему одни решения уменьшают drift,
                а другие делают UI хрупким.
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
                    Открывайте `src/components/state-architecture`, `src/pages` и
                    `src/lib`, чтобы видеть архитектурные решения сразу в двух формах: в
                    React-дереве и в чистых вычисляющих моделях.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Здесь есть и удачные, и неудачные структуры: duplicated totals,
                    duplicated selection, unnecessary hoisting и normalized entity
                    storage.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят в местах, где именно архитектура влияет на
                    поведение: почему derived values не должны жить отдельной копией и
                    когда parent действительно становится владельцем общего знания.
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
