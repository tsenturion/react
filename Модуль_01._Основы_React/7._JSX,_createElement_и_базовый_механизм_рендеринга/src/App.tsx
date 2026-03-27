import clsx from 'clsx';
import { useState } from 'react';

import { stackBadges } from './lib/stack-meta';
import { CreateElementPage } from './pages/CreateElementPage';
import { ExpressionsPage } from './pages/ExpressionsPage';
import { FragmentsPage } from './pages/FragmentsPage';
import { HtmlVsJsxPage } from './pages/HtmlVsJsxPage';
import { JsxOverviewPage } from './pages/JsxOverviewPage';
import { RenderDescriptionPage } from './pages/RenderDescriptionPage';

// Для этой темы полезнее держать все лаборатории в одном shell:
// так проще сравнивать одно и то же представление UI в разных формах
// без отдельного слоя навигационной логики.
const labs = [
  {
    id: 'overview',
    label: '1. JSX как описание UI',
    blurb:
      'Как JSX описывает интерфейс через данные и почему он читается лучше ручных DOM-операций.',
    component: JsxOverviewPage,
  },
  {
    id: 'create-element',
    label: '2. JSX и createElement',
    blurb:
      'Одна и та же карточка через JSX и через `React.createElement(...)` с разбором итоговой структуры.',
    component: CreateElementPage,
  },
  {
    id: 'expressions',
    label: '3. Выражения и ограничения',
    blurb:
      'Что допустимо прямо внутри JSX, а что нужно вынести в переменные или функции.',
    component: ExpressionsPage,
  },
  {
    id: 'html-vs-jsx',
    label: '4. HTML vs JSX',
    blurb:
      'Где привычки из HTML конфликтуют с JSX: `className`, `htmlFor`, style object и не только.',
    component: HtmlVsJsxPage,
  },
  {
    id: 'fragments',
    label: '5. Fragments и читаемость',
    blurb:
      'Когда лишняя обёртка портит структуру и как `Fragment` помогает сохранить семантику.',
    component: FragmentsPage,
  },
  {
    id: 'render-description',
    label: '6. Данные → описание → UI',
    blurb:
      'Как изменение входных данных меняет React element tree ещё до того, как обновится DOM.',
    component: RenderDescriptionPage,
  },
] as const;

export function App() {
  const [activeLabId, setActiveLabId] = useState<(typeof labs)[number]['id']>('overview');
  const activeLab = labs.find((item) => item.id === activeLabId) ?? labs[0];
  const ActiveComponent = activeLab.component;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Module 1 / Topic 7</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              JSX, createElement и базовый механизм рендеринга
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Эта учебная страница показывает JSX как рабочий механизм построения React
              UI. Вы сравниваете JSX с `React.createElement(...)`, следите за
              формированием element tree, проверяете ограничения JSX и смотрите, как
              данные меняют результирующую структуру интерфейса.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Что такое JSX, как он связан с `createElement`, где заканчивается
                синтаксис и начинается описание интерфейса, чем JSX отличается от HTML,
                зачем нужны `Fragment` и как данные отражаются в element tree.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как работать с лабораториями
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Меняйте параметры карточек и каталогов, переключайте режимы `JSX /
                createElement`, проверяйте проблемные конструкции и сразу сопоставляйте
                UI-результат с листингами и файлами текущего проекта.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В проекте есть реальные JSX-компоненты, отдельная ветка на
                `React.createElement(...)`, собственный инспектор React element tree,
                `Fragment`-сценарии и модели данных, которые объясняют интерфейс без
                ручных DOM-изменений.
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
                    Сначала меняйте данные и режимы на странице, затем открывайте
                    `src/pages`, `src/components/rendering` и `src/lib`, чтобы видеть, как
                    JSX-поведение выражено в коде текущего проекта.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Тема читается буквально: JSX реально используется в одних компонентах,
                    `React.createElement(...)` в других, а element tree действительно
                    инспектируется как структура данных до обновления DOM.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят там, где чаще всего путают понятия: React element не
                    равен DOM-узлу, `Fragment` не добавляет лишнюю разметку, а выражения
                    внутри JSX должны оставаться чистыми и читаемыми.
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
