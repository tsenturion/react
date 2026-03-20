import clsx from 'clsx';
import { useState } from 'react';

import { stackBadges } from './lib/stack-meta';
import { DialogBridgePage } from './pages/DialogBridgePage';
import { EscapeBoundaryPage } from './pages/EscapeBoundaryPage';
import { FlushSyncPage } from './pages/FlushSyncPage';
import { LayerEscapePage } from './pages/LayerEscapePage';
import { PortalEventsPage } from './pages/PortalEventsPage';
import { PortalModalPage } from './pages/PortalModalPage';

const labs = [
  {
    id: 'modal',
    label: '1. Portal modal',
    blurb: 'createPortal для modal layer и отдельного DOM-host.',
    component: PortalModalPage,
  },
  {
    id: 'bubbling',
    label: '2. Portal events',
    blurb: 'Как события из portal продолжают идти по React-дереву.',
    component: PortalEventsPage,
  },
  {
    id: 'layering',
    label: '3. Layer escape',
    blurb: 'Выход overlay из clipping и stacking traps через portal.',
    component: LayerEscapePage,
  },
  {
    id: 'flush',
    label: '4. flushSync',
    blurb: 'Редкие синхронные обновления перед immediate DOM read.',
    component: FlushSyncPage,
  },
  {
    id: 'bridge',
    label: '5. Imperative bridge',
    blurb: 'Согласование React state с browser imperative API.',
    component: DialogBridgePage,
  },
  {
    id: 'boundary',
    label: '6. Boundaries',
    blurb: 'Где escape hatch нужен, а где уже становится лишним.',
    component: EscapeBoundaryPage,
  },
] as const;

export function App() {
  const [activeLabId, setActiveLabId] = useState<(typeof labs)[number]['id']>('modal');
  const activeLab = labs.find((item) => item.id === activeLabId) ?? labs[0];
  const ActiveComponent = activeLab.component;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 3 / Урок 24</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Escape hatches React
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Эта учебная страница показывает, как React точечно выходит за пределы
              обычной декларативной модели: через portals, flushSync и мосты к imperative
              browser API. Здесь собраны сценарии, в которых такие приёмы помогают
              архитектуре, и ситуации, где они уже становятся лишним усложнением.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Как создавать modal и overlay layer через portal, почему flushSync нужен
                только для редких synchronous DOM-read сценариев и как согласовывать React
                со сторонними imperative API без второй версии истины.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как читать лаборатории
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Сначала разберите portal как отдельный host и bubbling, затем посмотрите
                layer escape, после этого переходите к flushSync, bridge к dialog API и
                завершайте урок architectural playbook-ом по границам escape hatches.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В проекте есть реальные createPortal, flushSync, отдельный portal-host в
                HTML, native dialog bridge, overflow-clipping сравнение и boundary-логика
                по выбору минимально нужного escape hatch.
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
                    Открывайте `src/components/escape-hatches`, `src/pages` и `src/lib`,
                    чтобы видеть отдельно живые portal/flushSync сценарии, учебные
                    страницы и pure-model слой с архитектурными выводами.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    В проекте intentionally показаны и полезные, и опасные пути:
                    portal-modal как отдельный слой, bubbling через portal, forced dialog
                    drift и flushSync как редкий, а не базовый инструмент.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят в местах, где обычно путают границы: почему portal
                    не ломает React ownership, почему flushSync не должен становиться
                    нормой и как bridge к imperative API убирает state drift.
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
