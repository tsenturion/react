import clsx from 'clsx';

import { usePersistentPreference } from './hooks/usePersistentPreference';
import { lessonLabs, type LabId } from './lib/learning-model';
import { stackBadges } from './lib/stack-meta';
import { BoundaryPage } from './pages/BoundaryPage';
import { CompositionPage } from './pages/CompositionPage';
import { ContractPage } from './pages/ContractPage';
import { HookApiPage } from './pages/HookApiPage';
import { RefactorPage } from './pages/RefactorPage';
import { ReusePage } from './pages/ReusePage';

const labComponents = {
  contract: ContractPage,
  composition: CompositionPage,
  reuse: ReusePage,
  api: HookApiPage,
  boundary: BoundaryPage,
  refactor: RefactorPage,
} as const;

export function App() {
  const [storedLabId, setStoredLabId] = usePersistentPreference<LabId>(
    'custom-hooks:active-lab',
    'contract',
  );
  const activeLab = lessonLabs.find((item) => item.id === storedLabId) ?? lessonLabs[0];
  const ActiveComponent = labComponents[activeLab.id];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 3 / Урок 25</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Пользовательские хуки
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Эта учебная страница показывает, как custom hook превращает повторяющуюся
              логику из набора `state`, `effects` и обработчиков в читаемый контракт.
              Здесь собраны и удачные архитектурные паттерны, и ситуации, где вынос в hook
              только маскирует лишнюю сложность.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Как задавать hook-контракт, как композиция smaller hooks собирает рабочую
                модель экрана, где проходит граница абстракции и почему custom hook не
                должен быть просто складом всей бизнес-логики компонента.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как читать лаборатории
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Сначала разберите контракт и композицию, затем посмотрите
                переиспользование и API hook-а, после этого переходите к границам
                абстракции и завершайте урок практикой, где hook убирает шум из формы и
                делает поведение читаемым.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В проекте есть реальные `src/hooks`: фильтры каталога, persistent
                preference, disclosure-поведение, checklist API, feedback draft и composed
                workspace hook. Даже переключение лабораторий хранится через reusable
                hook.
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
                onClick={() => setStoredLabId(item.id)}
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
                    Открывайте `src/hooks`, `src/components/custom-hooks`, `src/pages` и
                    `src/lib`, чтобы видеть отдельно reusable hooks, живые экраны и
                    pure-model слой с правилами выбора правильной абстракции.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    В проекте намеренно показаны и сильные, и слабые границы: composition
                    из нескольких hooks, explicit command API и отдельная лаборатория про
                    случаи, где hook выносить вообще не стоит.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят там, где обычно теряется смысл: вокруг localStorage
                    sync, composed workspace hook, command-oriented API и решений по
                    границам абстракции.
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
