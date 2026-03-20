import { useState, type ChangeEvent, type FormEvent } from 'react';

import { createSignupForm, type SignupForm } from '../../lib/form-domain';
import { buildValidationReport, validateSignupForm } from '../../lib/validation-model';
import { StatusPill } from '../ui';

type TouchedMap = Partial<Record<keyof SignupForm, boolean>>;

export function ValidationLab() {
  const [form, setForm] = useState(createSignupForm);
  const [touched, setTouched] = useState<TouchedMap>({});
  const [submitted, setSubmitted] = useState(false);

  const errors = validateSignupForm(form);
  const report = buildValidationReport(errors);

  const visibleErrors = Object.fromEntries(
    Object.entries(errors).filter(
      ([field]) => submitted || touched[field as keyof SignupForm],
    ),
  ) as typeof errors;

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = event.currentTarget;
    const value =
      target instanceof HTMLInputElement && target.type === 'checkbox'
        ? target.checked
        : target.value;

    setForm((current) => ({ ...current, [target.name]: value }) as SignupForm);
  };

  const markTouched = (field: keyof SignupForm) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    if (Object.keys(errors).length > 0) {
      return;
    }
  };

  return (
    <div className="space-y-5">
      <form
        onSubmit={handleSubmit}
        className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              validation
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              Ошибки должны объяснять, что исправить и где именно это сделать
            </h3>
          </div>
          <StatusPill tone={report.tone}>{report.errorCount} errors</StatusPill>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-semibold">Email</span>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={() => markTouched('email')}
              className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 outline-none"
            />
            {visibleErrors.email ? (
              <span className="text-sm text-rose-700">{visibleErrors.email}</span>
            ) : null}
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-semibold">План</span>
            <select
              name="plan"
              value={form.plan}
              onChange={handleChange}
              onBlur={() => markTouched('plan')}
              className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 outline-none"
            >
              <option value="starter">Starter</option>
              <option value="team">Team</option>
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-semibold">Пароль</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={() => markTouched('password')}
              className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 outline-none"
            />
            {visibleErrors.password ? (
              <span className="text-sm text-rose-700">{visibleErrors.password}</span>
            ) : null}
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-semibold">Повтор пароля</span>
            <input
              type="password"
              name="repeatPassword"
              value={form.repeatPassword}
              onChange={handleChange}
              onBlur={() => markTouched('repeatPassword')}
              className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 outline-none"
            />
            {visibleErrors.repeatPassword ? (
              <span className="text-sm text-rose-700">
                {visibleErrors.repeatPassword}
              </span>
            ) : null}
          </label>
        </div>

        <label className="mt-5 inline-flex items-center gap-3 rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={form.agreeToTerms}
            onChange={handleChange}
            onBlur={() => markTouched('agreeToTerms')}
          />
          Принять правила
        </label>
        {visibleErrors.agreeToTerms ? (
          <p className="mt-2 text-sm text-rose-700">{visibleErrors.agreeToTerms}</p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="submit" className="chip">
            Проверить и отправить
          </button>
          <button
            type="button"
            onClick={() => {
              setForm(createSignupForm());
              setTouched({});
              setSubmitted(false);
            }}
            className="chip"
          >
            Сбросить
          </button>
        </div>
      </form>

      <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm leading-6 text-slate-600">{report.summary}</p>
      </div>
    </div>
  );
}
