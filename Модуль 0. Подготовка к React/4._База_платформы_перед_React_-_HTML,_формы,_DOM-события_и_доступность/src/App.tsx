import clsx from 'clsx';
import { useState } from 'react';

import { stackBadges } from './lib/stack-meta';
import { AccessibilityPage } from './pages/AccessibilityPage';
import { EventsPage } from './pages/EventsPage';
import { FocusPage } from './pages/FocusPage';
import { FormsPage } from './pages/FormsPage';
import { PlatformBridgePage } from './pages/PlatformBridgePage';
import { SemanticsPage } from './pages/SemanticsPage';

// Навигация остаётся плоской и прозрачной: тема посвящена платформенной основе,
// поэтому лаборатории переключаются обычным state без дополнительного framework-слоя.
const labs = [
  {
    id: 'semantics',
    label: '1. Семантический HTML',
    blurb: 'Landmarks, headings и выбор правильных HTML-элементов под структуру экрана.',
    component: SemanticsPage,
  },
  {
    id: 'forms',
    label: '2. Формы платформы',
    blurb: 'FormData, browser validation, `name`, `label`, `disabled` и `readonly`.',
    component: FormsPage,
  },
  {
    id: 'events',
    label: '3. DOM-события',
    blurb: 'Bubbling, capture, preventDefault, stopPropagation и реальный путь события.',
    component: EventsPage,
  },
  {
    id: 'focus',
    label: '4. Фокус и клавиатура',
    blurb: 'Tab order, keyboard activation, programmatic focus и связь с refs.',
    component: FocusPage,
  },
  {
    id: 'accessibility',
    label: '5. Доступность и ARIA',
    blurb: 'Accessible names, labels, native semantics и ARIA only when needed.',
    component: AccessibilityPage,
  },
  {
    id: 'bridge',
    label: '6. Платформа под React',
    blurb: 'Почему HTML, events и a11y важны для роутинга, refs и тестирования.',
    component: PlatformBridgePage,
  },
] as const;

export function App() {
  const [activeLabId, setActiveLabId] =
    useState<(typeof labs)[number]['id']>('semantics');
  const activeLab = labs.find((item) => item.id === activeLabId) ?? labs[0];
  const ActiveComponent = activeLab.component;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Module 0 / Topic 4</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Platform Foundations Before React Lab
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Одна учебная страница для темы про платформу браузера до React-абстракций.
              Вы переключаете лаборатории сверху, меняете разметку, отправляете формы,
              наблюдаете путь DOM-событий, проверяете фокус и клавиатуру и сразу видите,
              как нативное поведение браузера становится основой для React-кода.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Семантический HTML, устройство форм, DOM events, фокус, клавиатурную
                навигацию, accessible names и принцип `ARIA only when needed`, а также
                связь этих вещей с React-уровнем.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как читать лаборатории
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Меняйте структуру страницы, отправляйте реальные формы, кликайте по
                вложенным элементам, проверяйте таб-навигацию и затем открывайте блоки с
                файлами и листингами ниже.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Проект сам построен на семантических контейнерах, настоящих
                <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-[0.9em]">
                  {'<form>'}
                </code>
                , `FormData`, native event listeners, управлении фокусом через refs и
                доступных ролях/именах, а не только рассказывает про это в тексте.
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
                    Сначала наблюдайте поведение браузерной модели в интерфейсе, а затем
                    переходите к `src/lib` и `src/pages`, на которые ссылается каждая
                    лаборатория.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Смотрите не только на UI, но и на сам код проекта: если лаборатория
                    говорит про
                    <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-[0.9em]">
                      {'<form>'}
                    </code>
                    , это должна быть реальная форма; если речь про DOM events, путь
                    события должен собираться нативными listeners.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии оставлены там, где инженерное решение неочевидно: почему
                    форма здесь uncontrolled, зачем listeners вешаются через
                    `addEventListener`, и как native semantics переходят в refs и
                    тестирование.
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
                Внизу остаются только реальные версии инструментов, которые зафиксированы
                в текущем `package.json`, `Dockerfile` и связанных конфигурациях проекта.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
