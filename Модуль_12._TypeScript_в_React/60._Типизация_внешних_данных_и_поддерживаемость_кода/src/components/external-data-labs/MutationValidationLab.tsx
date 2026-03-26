import { useState, type FormEvent } from 'react';

import { CodeBlock, ListBlock, MetricCard, StatusPill } from '../ui';
import {
  formSchemaSnippet,
  initialFormValues,
  responseSchemaSnippet,
  submitValidatedMutation,
  type DraftFormValues,
  type MutationResult,
  type ServerVariant,
} from '../../lib/mutation-validation-model';

const serverVariants: readonly { id: ServerVariant; label: string }[] = [
  { id: 'valid-response', label: 'Valid response' },
  { id: 'invalid-response', label: 'Broken response' },
  { id: 'reject', label: 'Reject' },
] as const;

export function MutationValidationLab() {
  const [formValues, setFormValues] = useState<DraftFormValues>(initialFormValues);
  const [serverVariant, setServerVariant] = useState<ServerVariant>('valid-response');
  const [result, setResult] = useState<MutationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Один typed updater держит поля формы синхронными с моделью DraftFormValues
  // и не даёт случайно записать несовместимое значение в ключ.
  function updateField<Key extends keyof DraftFormValues>(
    key: Key,
    value: DraftFormValues[Key],
  ) {
    setFormValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    const next = await submitValidatedMutation(formValues, serverVariant);
    setResult(next);
    setIsSubmitting(false);
  }

  const resultLabel = isSubmitting ? 'pending' : (result?.status ?? 'idle');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {serverVariants.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setServerVariant(item.id)}
            className={`chip ${serverVariant === item.id ? 'chip-active' : ''}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-[24px] border border-slate-200 bg-white p-5 lg:grid-cols-2"
      >
        <label className="space-y-2 text-sm text-slate-700">
          <span className="font-semibold">Title</span>
          <input
            value={formValues.title}
            onChange={(event) => updateField('title', event.currentTarget.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-700">
          <span className="font-semibold">Owner</span>
          <input
            value={formValues.owner}
            onChange={(event) => updateField('owner', event.currentTarget.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-700">
          <span className="font-semibold">Stage</span>
          <select
            value={formValues.stage}
            onChange={(event) =>
              updateField('stage', event.currentTarget.value as DraftFormValues['stage'])
            }
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500"
          >
            <option value="draft">draft</option>
            <option value="review">review</option>
            <option value="approved">approved</option>
          </select>
        </label>

        <label className="space-y-2 text-sm text-slate-700">
          <span className="font-semibold">Score</span>
          <input
            value={formValues.score}
            onChange={(event) => updateField('score', event.currentTarget.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500"
          />
        </label>

        <div className="lg:col-span-2 flex items-center justify-between gap-4">
          <div className="text-sm leading-6 text-slate-600">
            Сначала schema проверяет форму, потом schema проверяет ответ сервера.
          </div>
          <button type="submit" className="button-primary" disabled={isSubmitting}>
            Submit mutation
          </button>
        </div>
      </form>

      <div className="grid gap-4 xl:grid-cols-3">
        <MetricCard
          label="Server variant"
          value={serverVariant}
          hint="Так моделируется разное поведение backend boundary."
          tone="accent"
        />
        <MetricCard
          label="Result"
          value={resultLabel}
          hint="Pending, validation error, schema error и success — это разные ветки mutation UX."
          tone="cool"
        />
        <MetricCard
          label="Current score"
          value={formValues.score}
          hint="Поле всё ещё строка, пока runtime schema не приведёт его к числу."
          tone="dark"
        />
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-900">Mutation result</p>
          <StatusPill
            tone={
              isSubmitting
                ? 'warn'
                : result?.status === 'success'
                  ? 'success'
                  : result
                    ? 'error'
                    : 'warn'
            }
          >
            {resultLabel}
          </StatusPill>
        </div>

        {result?.status === 'success' ? (
          <p className="mt-4 text-sm leading-6 text-emerald-950">
            Saved “{result.savedTitle}” at {result.receipt}
          </p>
        ) : null}

        {result?.status === 'server-error' ? (
          <p className="mt-4 text-sm leading-6 text-rose-950">{result.message}</p>
        ) : null}

        {result?.status === 'validation-error' || result?.status === 'schema-error' ? (
          <div className="mt-4">
            <ListBlock title="Validation issues" items={result.issues} />
          </div>
        ) : null}

        {!result && !isSubmitting ? (
          <p className="mt-4 text-sm leading-6 text-slate-700">
            Пока результата нет. Попробуйте изменить форму или переключить server variant.
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <CodeBlock label="Form schema" code={formSchemaSnippet} />
        <CodeBlock label="Response schema" code={responseSchemaSnippet} />
      </div>
    </div>
  );
}
