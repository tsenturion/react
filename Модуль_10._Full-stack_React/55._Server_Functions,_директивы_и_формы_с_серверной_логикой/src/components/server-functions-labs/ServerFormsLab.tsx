'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import {
  initialFormState,
  submitLessonMutation,
} from '../../lib/server-function-form-model';
import { MetricCard, Panel, StatusPill } from '../ui';

function IntentSubmitButtons() {
  const status = useFormStatus();
  const currentIntent = status.data?.get('intent')?.toString() ?? 'saveDraft';

  return (
    <div className="flex flex-wrap gap-3">
      <button type="submit" name="intent" value="saveDraft" className="chip chip-active">
        {status.pending && currentIntent === 'saveDraft'
          ? 'Сохраняем черновик...'
          : 'Сохранить черновик'}
      </button>
      <button type="submit" name="intent" value="publish" className="chip">
        {status.pending && currentIntent === 'publish' ? 'Публикуем...' : 'Опубликовать'}
      </button>
    </div>
  );
}

export function ServerFormsLab() {
  const [state, formAction, isPending] = useActionState(
    submitLessonMutation,
    initialFormState,
  );

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="soft-label">Form + server function</span>
          <p className="text-sm leading-6 text-slate-600">
            Эта форма показывает submit-driven server logic: один submit пересекает
            серверную границу, проходит валидацию и возвращает результат обратно в UI.
          </p>
        </div>

        {/* Форма остаётся client island, потому что здесь нужен набор текста,
            локальный pending UX и показ ошибок рядом с полями. Но сама мутация
            уходит в server runtime через submitLessonMutation. */}
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Заголовок</span>
              <input
                name="title"
                defaultValue="Server Functions in React"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
              />
              {state.fieldErrors.title ? (
                <span className="text-sm text-rose-700">{state.fieldErrors.title}</span>
              ) : null}
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-slate-700">Slug</span>
              <input
                name="slug"
                defaultValue="server-functions-react"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
              />
              {state.fieldErrors.slug ? (
                <span className="text-sm text-rose-700">{state.fieldErrors.slug}</span>
              ) : null}
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Краткое описание</span>
            <textarea
              name="summary"
              rows={4}
              defaultValue="Форма вызывает серверную функцию и получает обратно состояние без ручного REST-слоя."
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
            />
            {state.fieldErrors.summary ? (
              <span className="text-sm text-rose-700">{state.fieldErrors.summary}</span>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">Reviewer</span>
            <input
              name="reviewer"
              defaultValue="Ada"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"
            />
            {state.fieldErrors.reviewer ? (
              <span className="text-sm text-rose-700">{state.fieldErrors.reviewer}</span>
            ) : null}
          </label>

          <IntentSubmitButtons />
        </form>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="State"
          value={state.status}
          hint="Результат серверного действия, вернувшийся обратно в форму."
          tone="accent"
        />
        <MetricCard
          label="Last intent"
          value={state.lastIntent}
          hint="Последний submit показал, какой server action пересёк границу."
          tone="cool"
        />
        <div className="panel p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Pending / persisted
          </p>
          <div className="mt-3">
            <StatusPill
              tone={isPending ? 'warn' : state.status === 'error' ? 'error' : 'success'}
            >
              {isPending ? 'pending' : state.persistedStatus}
            </StatusPill>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">{state.message}</p>
        </div>
      </div>

      <Panel className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">{state.headline}</h3>
        <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Audit trail
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            {state.auditTrail.length > 0 ? (
              state.auditTrail.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                >
                  {item}
                </li>
              ))
            ) : (
              <li className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                Submit ещё не запускался.
              </li>
            )}
          </ul>
        </div>
      </Panel>
    </div>
  );
}
