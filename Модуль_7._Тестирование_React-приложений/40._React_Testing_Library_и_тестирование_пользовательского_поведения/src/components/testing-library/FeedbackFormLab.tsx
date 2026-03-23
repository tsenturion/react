import { useMemo, useState } from 'react';

type FeedbackFields = {
  name: string;
  email: string;
  note: string;
  consent: boolean;
};

type FieldErrorMap = Partial<Record<keyof FeedbackFields, string>>;

function validate(fields: FeedbackFields): FieldErrorMap {
  const errors: FieldErrorMap = {};

  if (fields.name.trim().length < 2) {
    errors.name = 'Укажите имя длиной не меньше двух символов.';
  }

  if (!fields.email.includes('@')) {
    errors.email = 'Укажите корректный email.';
  }

  if (fields.note.trim().length < 10) {
    errors.note = 'Опишите сценарий подробнее, минимум десять символов.';
  }

  if (!fields.consent) {
    errors.consent = 'Нужно подтвердить, что сценарий можно включить в review.';
  }

  return errors;
}

export function FeedbackFormLab() {
  const [fields, setFields] = useState<FeedbackFields>({
    name: '',
    email: '',
    note: '',
    consent: false,
  });
  const [errors, setErrors] = useState<FieldErrorMap>({});
  const [status, setStatus] = useState('');

  const errorList = useMemo(() => Object.values(errors), [errors]);

  const updateField = <Key extends keyof FeedbackFields>(
    key: Key,
    value: FeedbackFields[Key],
  ) => {
    setFields((current) => ({ ...current, [key]: value }));
    setStatus('');
  };

  return (
    <section className="space-y-5 rounded-[28px] border border-slate-200 bg-white p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Form behavior
        </p>
        <h3 className="mt-2 text-xl font-semibold text-slate-900">
          В форме тест проверяет не validator calls, а доступные ошибки и итоговый
          результат
        </h3>
      </div>

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          const nextErrors = validate(fields);

          setErrors(nextErrors);

          if (Object.keys(nextErrors).length > 0) {
            setStatus('');
            return;
          }

          setStatus(`Черновик для ${fields.name.trim()} отправлен на review.`);
          setFields({
            name: '',
            email: '',
            note: '',
            consent: false,
          });
        }}
      >
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Имя</span>
          <input
            aria-invalid={Boolean(errors.name)}
            type="text"
            value={fields.name}
            onChange={(event) => updateField('name', event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            aria-invalid={Boolean(errors.email)}
            type="email"
            value={fields.email}
            onChange={(event) => updateField('email', event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Описание сценария</span>
          <textarea
            aria-invalid={Boolean(errors.note)}
            value={fields.note}
            onChange={(event) => updateField('note', event.target.value)}
            className="min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none"
          />
        </label>

        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
          <input
            type="checkbox"
            checked={fields.consent}
            onChange={(event) => updateField('consent', event.target.checked)}
            className="mt-1"
          />
          <span className="text-sm leading-6 text-slate-700">
            Разрешить включение сценария в regression review
          </span>
        </label>

        <button
          type="submit"
          className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
        >
          Отправить сценарий
        </button>
      </form>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Ошибки формы
          </p>
          <div className="mt-3 space-y-2">
            {errorList.length === 0 ? (
              <p className="text-sm leading-6 text-slate-600">
                Ошибки появятся после submit, если сценарий заполнен не полностью.
              </p>
            ) : null}
            {errorList.map((item) => (
              <p
                key={item}
                role="alert"
                className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-900"
              >
                {item}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Результат submit
          </p>
          {status ? (
            <p
              role="status"
              className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900"
            >
              {status}
            </p>
          ) : (
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Успешный status появится только после валидного submit.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
