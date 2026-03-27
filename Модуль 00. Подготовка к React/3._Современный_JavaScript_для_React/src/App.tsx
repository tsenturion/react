import clsx from 'clsx';
import { useState } from 'react';

import { stackBadges } from './lib/stack-meta';
import { AsyncPage } from './pages/AsyncPage';
import { ClosuresPage } from './pages/ClosuresPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ImmutabilityPage } from './pages/ImmutabilityPage';
import { ModulesPage } from './pages/ModulesPage';
import { SyntaxPage } from './pages/SyntaxPage';

// Навигация остаётся плоской и прозрачной: тема посвящена самому JavaScript,
// поэтому лаборатории переключаются обычным state без дополнительного слоя абстракции.
const labs = [
  {
    id: 'syntax',
    label: '1. Синтаксис и выражения',
    blurb: 'let/const, стрелки, шаблонные строки, destructuring, spread/rest, ?., ??.',
    component: SyntaxPage,
  },
  {
    id: 'modules',
    label: '2. import/export',
    blurb: 'ES-модули как реальный способ собирать данные и функции по проекту.',
    component: ModulesPage,
  },
  {
    id: 'collections',
    label: '3. Коллекции данных',
    blurb: 'map, filter, reduce, объекты и массивы как источник интерфейса.',
    component: CollectionsPage,
  },
  {
    id: 'closures',
    label: '4. Closures',
    blurb: 'Как функции запоминают окружение и почему это влияет на обработчики.',
    component: ClosuresPage,
  },
  {
    id: 'async',
    label: '5. Promise, async/await, fetch',
    blurb: 'Асинхронные запросы, загрузка, ошибка и фильтрация результата.',
    component: AsyncPage,
  },
  {
    id: 'immutability',
    label: '6. Иммутабельность',
    blurb: 'Мутация против копирования и влияние ссылок на предсказуемость UI.',
    component: ImmutabilityPage,
  },
] as const;

export function App() {
  const [activeLabId, setActiveLabId] = useState<(typeof labs)[number]['id']>('syntax');
  const activeLab = labs.find((item) => item.id === activeLabId) ?? labs[0];
  const ActiveComponent = activeLab.component;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Module 0 / Topic 3</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Modern JavaScript for React Lab
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Одна учебная страница для темы про современный JavaScript в React. Вы
              переключаете лаборатории сверху, меняете данные, запускаете асинхронные
              сценарии и сразу видите, как ES6+ синтаксис, коллекции, closures, promises и
              иммутабельность отражаются в реальном интерфейсе.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Только тот JavaScript, который реально входит в повседневный React-код:
                переменные, выражения, import/export, работа с массивами и объектами,
                async-потоки, fetch и обновление данных без мутаций.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как читать лаборатории
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Меняйте параметры, сравнивайте результаты выражений, смотрите, как
                меняется интерфейс, а затем открывайте блоки с файлами и листингами ниже,
                чтобы увидеть ту же идею в коде текущего проекта.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Проект сам построен как набор ES-модулей с pure functions, массивными
                преобразованиями, реальным `fetch`, комментариями в неочевидных местах и
                демонстрацией того, как ссылки на объекты влияют на React-состояние.
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
                    Сначала наблюдайте поведение интерфейса, а затем переходите к
                    `src/lib`, `src/pages` и `public/data`, на которые ссылается каждая
                    лаборатория.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Смотрите не только на UI, но и на сам код проекта: если тема про
                    import/export, это выражено отдельными модулями; если тема про
                    иммутабельность, в проекте есть и правильный, и намеренно сломанный
                    сценарий обновления ссылок.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии оставлены там, где инженерное решение неочевидно: почему
                    обработчики closures закрепляются в state, почему fetch запускается
                    вручную и как мутация может спрятаться до постороннего rerender.
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
