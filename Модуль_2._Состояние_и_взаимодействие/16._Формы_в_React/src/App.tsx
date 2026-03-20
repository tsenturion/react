import clsx from 'clsx';
import { useState } from 'react';

import { stackBadges } from './lib/stack-meta';
import { ControlledFieldsPage } from './pages/ControlledFieldsPage';
import { ControlledVsUncontrolledPage } from './pages/ControlledVsUncontrolledPage';
import { FormPitfallsPage } from './pages/FormPitfallsPage';
import { NativeVsReactPage } from './pages/NativeVsReactPage';
import { SubmitFlowPage } from './pages/SubmitFlowPage';
import { ValidationPage } from './pages/ValidationPage';

const labs = [
  {
    id: 'controlled',
    label: '1. Controlled поля',
    blurb: 'input, textarea, select, checkbox и radio в потоке `ввод → state → UI`.',
    component: ControlledFieldsPage,
  },
  {
    id: 'uncontrolled',
    label: '2. Controlled vs uncontrolled',
    blurb:
      'Когда React знает значение сразу, а когда DOM читается только через FormData.',
    component: ControlledVsUncontrolledPage,
  },
  {
    id: 'submit',
    label: '3. Submit flow',
    blurb: 'preventDefault, стадии отправки, payload, результат и reset формы.',
    component: SubmitFlowPage,
  },
  {
    id: 'validation',
    label: '4. Validation UX',
    blurb: 'Ошибки, touched-поля, блокировка submit и понятная обратная связь.',
    component: ValidationPage,
  },
  {
    id: 'native',
    label: '5. Native vs React',
    blurb: 'Где работает платформа, а где React добавляет controlled UX и custom logic.',
    component: NativeVsReactPage,
  },
  {
    id: 'pitfalls',
    label: '6. Типичные ошибки',
    blurb: 'checked vs value, submit без preventDefault и reset DOM без reset state.',
    component: FormPitfallsPage,
  },
] as const;

export function App() {
  const [activeLabId, setActiveLabId] =
    useState<(typeof labs)[number]['id']>('controlled');
  const activeLab = labs.find((item) => item.id === activeLabId) ?? labs[0];
  const ActiveComponent = activeLab.component;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="mx-auto max-w-4xl space-y-4">
            <span className="soft-label">Модуль 2 / Урок 16</span>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Формы в React
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Эта учебная страница разбирает формы не как набор полей, а как поток данных:
              controlled и uncontrolled inputs, submit flow, validation UX, различие между
              нативной формой и React-управлением и типичные ошибки, которые ломают
              синхронность между вводом и интерфейсом.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что раскрывает проект
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Controlled и uncontrolled inputs, submit flow, validation, ошибки
                пользователя, UX форм, native form behavior и устойчивый поток данных
                внутри React-компонента.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Как читать лаборатории
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Вводите данные, меняйте режимы формы, отправляйте, сбрасывайте, ломайте
                handlers и сравнивайте нативное поведение браузера с React-управлением.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Что видно в коде
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                В проекте есть реальные формы с `input`, `textarea`, `select`, `checkbox`,
                `radio`, `FormData`, `reportValidity()`, controlled state и отдельные pure
                models для submit, validation и pitfalls.
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
                    Открывайте `src/components/forms`, `src/pages` и `src/lib`, чтобы
                    видеть отдельно реальные React-формы и чистые модели для submit,
                    validation, native behavior и pitfalls.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-6">
                    Здесь намеренно есть и хорошие, и плохие сценарии: controlled sync,
                    uncontrolled чтение через DOM, submit stages, field-errors,
                    `reportValidity()` и anti-pattern с `checked`/`value`.
                  </p>
                </div>
                <div className="flex items-start gap-3 text-slate-600">
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <p className="text-sm leading-6">
                    Комментарии стоят в местах, где теряется логика формы: почему checkbox
                    должен читать `checked`, зачем нужен `preventDefault()` и почему
                    controlled reset требует синхронного reset state.
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
