import clsx from 'clsx';
import { useState } from 'react';

import { stackBadges } from './lib/stack-meta';
import { ArrayStatePage } from './pages/ArrayStatePage';
import { MutationBugsPage } from './pages/MutationBugsPage';
import { NestedStatePage } from './pages/NestedStatePage';
import { NormalizationPage } from './pages/NormalizationPage';
import { ObjectStatePage } from './pages/ObjectStatePage';
import { StructuralSharingPage } from './pages/StructuralSharingPage';

const labs = [
  {
    id: 'objects',
    label: '1. Объекты в state',
    blurb:
      'Копирование объекта против мутации и одна и та же ссылка как источник скрытого бага.',
    component: ObjectStatePage,
  },
  {
    id: 'arrays',
    label: '2. Массивы в state',
    blurb: 'Добавление, удаление, toggle и reorder через map, filter, spread и slice.',
    component: ArrayStatePage,
  },
  {
    id: 'nested',
    label: '3. Вложенные структуры',
    blurb: 'Как менять leaf-узел глубоко внутри дерева без потери сигнала для React.',
    component: NestedStatePage,
  },
  {
    id: 'bugs',
    label: '4. Невидимые баги',
    blurb:
      'Как мутация ломает историю, синхронность интерфейса и ожидаемую модель данных.',
    component: MutationBugsPage,
  },
  {
    id: 'normalize',
    label: '5. Нормализация',
    blurb:
      'Когда полезно разделить entities и order, а не хранить всё в одном nested-дереве.',
    component: NormalizationPage,
  },
  {
    id: 'sharing',
    label: '6. Structural sharing',
    blurb:
      'Почему точечное копирование важно не только для корректности, но и для производительности.',
    component: StructuralSharingPage,
  },
] as const;

export function App() {
  const [activeLabId, setActiveLabId] = useState<(typeof labs)[number]['id']>('objects');
  const activeLab = labs.find((item) => item.id === activeLabId) ?? labs[0];
  const ActiveComponent = activeLab.component;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 2 / Урок 13</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Работа со сложным состоянием и иммутабельность
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Эта учебная страница разбирает сложный state не как абстрактную “внутреннюю
              структуру”, а как реальный источник качества UI. Здесь можно руками
              проверить объекты, массивы, nested updates, историю snapshot-ов,
              нормализацию данных и structural sharing ссылок.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Обновление объектов и массивов, вложенные структуры, иммутабельность,
                нормализация данных, скрытые баги от мутаций и влияние стратегии update на
                reference reuse.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как читать лаборатории
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Нажимайте плохие и хорошие обновления, проверяйте историю, перемещайте
                сущности и сравнивайте количество новых ссылок. Затем открывайте
                соответствующие функции и компоненты проекта.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В проекте есть реальные object, array и nested updates через чистые
                JavaScript-функции, живые React-компоненты с `useState` и отдельные модели
                для сравнения nested и normalized state.
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
                    Открывайте `src/components/complex-state`, `src/pages` и `src/lib`,
                    чтобы видеть отдельно React-компоненты урока и чистые функции, через
                    которые они реально обновляют сложное состояние.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Здесь намеренно есть и хорошие, и плохие сценарии: object mutation,
                    nested mutation, broken history, normalized entities и strategies для
                    structural sharing.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят в местах, где без них теряется сама идея урока:
                    почему React важна новая ссылка, как ломается история snapshot-ов и
                    почему точечное копирование уменьшает шум в diffing.
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
