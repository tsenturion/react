import clsx from 'clsx';

import { useQueryParamState } from './hooks/useQueryParamState';
import { lessonLabs, type LabId } from './lib/learning-model';
import { stackBadges } from './lib/stack-meta';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { GlobalStatePage } from './pages/GlobalStatePage';
import { LocalStatePage } from './pages/LocalStatePage';
import { PlacementAdvisorPage } from './pages/PlacementAdvisorPage';
import { ServerStatePage } from './pages/ServerStatePage';
import { UrlStatePage } from './pages/UrlStatePage';
import { useArchitecturePreferences } from './state/useArchitecturePreferences';

const labIds = lessonLabs.map((item) => item.id) as readonly LabId[];

const labComponents = {
  local: LocalStatePage,
  global: GlobalStatePage,
  url: UrlStatePage,
  server: ServerStatePage,
  advisor: PlacementAdvisorPage,
  architecture: ArchitecturePage,
} as const;

export function App() {
  // Shell урока сам использует URL state, чтобы тема жила не только внутри лабораторий.
  const [activeLabId, setActiveLabId] = useQueryParamState<LabId>('lab', 'local', labIds);
  const { density, lens, setDensity, setLens } = useArchitecturePreferences();
  const activeLab = lessonLabs.find((item) => item.id === activeLabId) ?? lessonLabs[0];
  const ActiveComponent = labComponents[activeLab.id];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 4 / Урок 27</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Локальное, глобальное, URL- и серверное состояние
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Эта учебная страница показывает, как разные виды состояния делят между собой
              ответственность: что должно жить рядом с компонентом, что имеет смысл
              вынести в общий store, что должно переживать reload через URL, а что вообще
              принадлежит серверному слою и не должно маскироваться под обычный
              `useState`.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Где проходит граница между local, global, URL и server state, почему
                одинаково опасно и поднимать всё слишком высоко, и прятать shareable или
                серверные данные слишком низко.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как читать лаборатории
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Сначала откройте local и global state, затем URL и server state, после
                этого переходите к advisor и завершайте урок интегрированным экраном, где
                все четыре слоя работают одновременно.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В проекте есть настоящий context-store для global preferences, URL hook на
                `history.pushState`, отдельный слой server-state cache и живой экран,
                который собирает их вместе без смешивания обязанностей.
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
                  'rounded-xl px-4 py-3 text-left transition-all duration-200',
                  activeLab.id === item.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100',
                )}
              >
                <span className="block text-sm font-semibold">{item.label}</span>
                <span
                  className={clsx(
                    'mt-1 block text-xs leading-5',
                    activeLab.id === item.id ? 'text-blue-100' : 'text-slate-500',
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
                    Открывайте `src/components/state-architecture`, `src/hooks`,
                    `src/state` и `src/lib`, чтобы отдельно видеть UI-лаборатории, URL
                    hooks, global store и pure model слой для архитектурных решений.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Этот shell сам использует URL state для переключения лабораторий и
                    global preferences для плотности интерфейса, поэтому урок не
                    заканчивается внутри отдельных демо-компонентов.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят в местах, где обычно теряется смысл: вокруг
                    `pushState`, server-cache вне компонента и общей границы между
                    временным UI-состоянием и внешними данными.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Глобальные настройки проекта
                </p>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Density</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(['compact', 'comfortable'] as const).map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setDensity(value)}
                          className={clsx(
                            'rounded-xl px-3 py-2 text-sm font-medium transition',
                            density === value
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-slate-700 hover:bg-slate-100',
                          )}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700">Lens</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(['tradeoffs', 'debug'] as const).map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setLens(value)}
                          className={clsx(
                            'rounded-xl px-3 py-2 text-sm font-medium transition',
                            lens === value
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-slate-700 hover:bg-slate-100',
                          )}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
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
                в `package.json`, Docker-конфигах и текущих настройках урока.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
