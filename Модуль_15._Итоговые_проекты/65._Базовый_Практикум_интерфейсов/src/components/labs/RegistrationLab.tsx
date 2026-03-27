import clsx from 'clsx';
import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';

import {
  buildPasswordChecklist,
  buildRegistrationPayload,
  collectErrorMessages,
  createRegistrationForm,
  experienceOptions,
  focusOptions,
  getPasswordStrengthLabel,
  planOptions,
  validateRegistrationForm,
  type RegistrationForm,
  type SubmittedRegistration,
} from '../../lib/registration-model';
import { Badge, Field, StatCard } from '../ui';

type TouchedFields = Partial<Record<keyof RegistrationForm, boolean>>;

type RegistrationLabProps = {
  onRegister?: (payload: SubmittedRegistration) => void;
  existingEmails?: string[];
};

export function RegistrationLab({
  onRegister = () => undefined,
  existingEmails = [],
}: RegistrationLabProps) {
  const [form, setForm] = useState(createRegistrationForm);
  const [touched, setTouched] = useState<TouchedFields>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submittedPayload, setSubmittedPayload] = useState<SubmittedRegistration | null>(
    null,
  );

  const errors = validateRegistrationForm(form, { existingEmails });
  const passwordChecklist = buildPasswordChecklist(form.password);
  const passwordStrength = getPasswordStrengthLabel(form.password);
  const canSubmit = Object.keys(errors).length === 0;
  const visibleErrorMessages = submitAttempted ? collectErrorMessages(errors) : [];

  function markTouched(field: keyof RegistrationForm) {
    setTouched((current) => ({
      ...current,
      [field]: true,
    }));
  }

  function updateField<K extends keyof RegistrationForm>(
    field: K,
    value: RegistrationForm[K],
  ) {
    setSubmittedPayload(null);
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleTextChange<K extends keyof RegistrationForm>(field: K) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        event.currentTarget instanceof HTMLInputElement &&
        event.currentTarget.type === 'checkbox'
          ? event.currentTarget.checked
          : event.currentTarget.value;

      updateField(field, value as RegistrationForm[K]);
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitAttempted(true);

    if (!canSubmit) {
      setSubmittedPayload(null);
      return;
    }

    const payload = buildRegistrationPayload(form);
    setSubmittedPayload(payload);
    onRegister(payload);
    setForm(createRegistrationForm());
    setTouched({});
    setSubmitAttempted(false);
  }

  function resetForm() {
    setForm(createRegistrationForm());
    setTouched({});
    setSubmitAttempted(false);
    setSubmittedPayload(null);
  }

  function getFieldError(field: keyof RegistrationForm) {
    if (!submitAttempted && !touched[field]) {
      return undefined;
    }

    return errors[field];
  }

  const fullNameError = getFieldError('fullName');
  const cityError = getFieldError('city');
  const emailError = getFieldError('email');
  const passwordError = getFieldError('password');
  const confirmPasswordError = getFieldError('confirmPassword');
  const bioError = getFieldError('bio');
  const teamNameError = getFieldError('teamName');
  const acceptPolicyError = getFieldError('acceptPolicy');

  return (
    <div className="lab-grid lab-grid--stacked">
      <div className="lab-column">
        <form className="lab-card" onSubmit={handleSubmit} noValidate>
          <div className="card-header">
            <div>
              <p className="eyebrow">Заявка</p>
              <h3 className="card-title">Регистрация нового участника</h3>
            </div>
            <Badge tone={canSubmit ? 'success' : 'warning'}>
              {canSubmit ? 'Можно отправлять' : 'Есть ошибки'}
            </Badge>
          </div>

          {visibleErrorMessages.length > 0 ? (
            <section className="error-summary" role="alert">
              <h4 className="note-title">Форма ещё не готова к отправке</h4>
              <ul className="note-list">
                {visibleErrorMessages.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="form-grid">
            <Field
              label="Имя и фамилия"
              htmlFor="fullName"
              hint="По этому имени участник попадёт в реестр и в карточку матча."
              error={fullNameError}
              required
            >
              <input
                id="fullName"
                className="text-input"
                type="text"
                value={form.fullName}
                onChange={handleTextChange('fullName')}
                onBlur={() => markTouched('fullName')}
                aria-invalid={Boolean(fullNameError)}
                aria-describedby={describeBy(
                  'fullName-hint',
                  fullNameError && 'fullName-error',
                )}
                placeholder="Ирина Петрова"
              />
            </Field>

            <Field label="Город" htmlFor="city" error={cityError} required>
              <input
                id="city"
                className="text-input"
                type="text"
                value={form.city}
                onChange={handleTextChange('city')}
                onBlur={() => markTouched('city')}
                aria-invalid={Boolean(cityError)}
                aria-describedby={describeBy(cityError && 'city-error')}
                placeholder="Екатеринбург"
              />
            </Field>

            <Field
              label="E-mail"
              htmlFor="email"
              hint="Адрес должен быть уникальным внутри текущего реестра."
              error={emailError}
              required
            >
              <input
                id="email"
                className="text-input"
                type="email"
                value={form.email}
                onChange={handleTextChange('email')}
                onBlur={() => markTouched('email')}
                aria-invalid={Boolean(emailError)}
                aria-describedby={describeBy('email-hint', emailError && 'email-error')}
                placeholder="irina@example.com"
              />
            </Field>

            <Field
              label="Пароль"
              htmlFor="password"
              hint="Checklist и strength label вычисляются из одного поля."
              error={passwordError}
              required
            >
              <input
                id="password"
                className="text-input"
                type="password"
                value={form.password}
                onChange={handleTextChange('password')}
                onBlur={() => markTouched('password')}
                aria-invalid={Boolean(passwordError)}
                aria-describedby={describeBy(
                  'password-hint',
                  passwordError && 'password-error',
                )}
              />
            </Field>

            <Field
              label="Повторите пароль"
              htmlFor="confirmPassword"
              error={confirmPasswordError}
              required
            >
              <input
                id="confirmPassword"
                className="text-input"
                type="password"
                value={form.confirmPassword}
                onChange={handleTextChange('confirmPassword')}
                onBlur={() => markTouched('confirmPassword')}
                aria-invalid={Boolean(confirmPasswordError)}
                aria-describedby={describeBy(
                  confirmPasswordError && 'confirmPassword-error',
                )}
              />
            </Field>

            <Field
              label="О себе"
              htmlFor="bio"
              hint="Это описание сразу появится в карточке участника."
              error={bioError}
              required
            >
              <textarea
                id="bio"
                className="textarea-input"
                rows={4}
                value={form.bio}
                onChange={handleTextChange('bio')}
                onBlur={() => markTouched('bio')}
                aria-invalid={Boolean(bioError)}
                aria-describedby={describeBy('bio-hint', bioError && 'bio-error')}
                placeholder="Хочу играть в матчах и помогать с а11y-проверкой интерфейсов."
              />
            </Field>
          </div>

          <fieldset className="fieldset-reset">
            <legend className="field-label">Направление участия</legend>
            <div className="choice-grid">
              {focusOptions.map((option) => (
                <label
                  key={option.value}
                  className={clsx(
                    'choice-card',
                    form.focus === option.value && 'is-selected',
                  )}
                >
                  <input
                    type="radio"
                    name="focus"
                    value={option.value}
                    checked={form.focus === option.value}
                    onChange={() => updateField('focus', option.value)}
                  />
                  <span className="choice-title">{option.label}</span>
                  <span className="choice-description">{option.description}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="fieldset-reset">
            <legend className="field-label">Уровень подготовки</legend>
            <div className="choice-grid">
              {experienceOptions.map((option) => (
                <label
                  key={option.value}
                  className={clsx(
                    'choice-card',
                    form.experience === option.value && 'is-selected',
                  )}
                >
                  <input
                    type="radio"
                    name="experience"
                    value={option.value}
                    checked={form.experience === option.value}
                    onChange={() => updateField('experience', option.value)}
                  />
                  <span className="choice-title">{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="fieldset-reset">
            <legend className="field-label">Формат участия</legend>
            <div className="choice-grid">
              {planOptions.map((option) => (
                <label
                  key={option.value}
                  className={clsx(
                    'choice-card',
                    form.plan === option.value && 'is-selected',
                  )}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={option.value}
                    checked={form.plan === option.value}
                    onChange={() => updateField('plan', option.value)}
                  />
                  <span className="choice-title">{option.label}</span>
                  <span className="choice-description">{option.description}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {form.plan === 'team' ? (
            <Field
              label="Название команды"
              htmlFor="teamName"
              error={teamNameError}
              required
            >
              <input
                id="teamName"
                className="text-input"
                type="text"
                value={form.teamName}
                onChange={handleTextChange('teamName')}
                onBlur={() => markTouched('teamName')}
                aria-invalid={Boolean(teamNameError)}
                aria-describedby={describeBy(teamNameError && 'teamName-error')}
                placeholder="State Mechanics"
              />
            </Field>
          ) : null}

          <div className="field">
            <div className="field-label-row">
              <span className="field-label">Подтверждение</span>
            </div>
            <label className="checkbox-row" htmlFor="acceptPolicy">
              <input
                id="acceptPolicy"
                type="checkbox"
                checked={form.acceptPolicy}
                onChange={handleTextChange('acceptPolicy')}
                onBlur={() => markTouched('acceptPolicy')}
                aria-invalid={Boolean(acceptPolicyError)}
                aria-describedby={acceptPolicyError ? 'acceptPolicy-error' : undefined}
              />
              <span>
                Согласен с правилами участия, обработкой данных и регламентом матча.
              </span>
            </label>
            {acceptPolicyError ? (
              <p id="acceptPolicy-error" className="field-error">
                {acceptPolicyError}
              </p>
            ) : null}

            <label className="checkbox-row" htmlFor="wantsDigest">
              <input
                id="wantsDigest"
                type="checkbox"
                checked={form.wantsDigest}
                onChange={handleTextChange('wantsDigest')}
              />
              <span>Получать дайджест событий и анонсы следующих турниров.</span>
            </label>
          </div>

          <div className="action-row">
            <button type="submit" className="button">
              Добавить участника
            </button>
            <button
              type="button"
              className="button button--secondary"
              onClick={resetForm}
            >
              Очистить форму
            </button>
          </div>

          {submittedPayload ? (
            <p className="success-banner" role="status">
              Участник добавлен в реестр. Теперь его можно найти в таблице и поставить в
              матч.
            </p>
          ) : null}
        </form>
      </div>

      <aside className="lab-sidebar">
        <div className="stat-grid stat-grid--stacked">
          <StatCard
            label="Сила пароля"
            value={passwordStrength}
            tone={passwordTone(passwordStrength)}
          />
          <StatCard
            label="Ошибок"
            value={Object.keys(errors).length}
            note="Валидация пересчитывается из текущей формы."
            tone={Object.keys(errors).length === 0 ? 'success' : 'warning'}
          />
          <StatCard
            label="Формат"
            value={form.plan === 'team' ? 'Команда' : 'Соло'}
            note="Формат влияет на обязательность поля с названием команды."
            tone={canSubmit ? 'success' : 'accent'}
          />
        </div>

        <section className="lab-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Безопасность</p>
              <h3 className="card-title">Требования к паролю</h3>
            </div>
            <Badge tone={passwordTone(passwordStrength)}>{passwordStrength}</Badge>
          </div>

          <ul className="checklist">
            {passwordChecklist.map((rule) => (
              <li
                key={rule.id}
                className={clsx('checklist-item', rule.passed && 'is-passed')}
              >
                {rule.label}
              </li>
            ))}
          </ul>
        </section>

        <section className="lab-card">
          <div className="card-header">
            <div>
              <p className="eyebrow">Предпросмотр</p>
              <h3 className="card-title">Карточка, которая будет создана</h3>
            </div>
            <Badge tone={submittedPayload ? 'success' : 'neutral'}>
              {submittedPayload ? 'ready' : 'draft'}
            </Badge>
          </div>

          <pre className="payload-pre">
            {JSON.stringify(
              submittedPayload ?? buildRegistrationPayloadPreview(form),
              null,
              2,
            )}
          </pre>
        </section>
      </aside>
    </div>
  );
}

function describeBy(...ids: Array<string | false | undefined>) {
  const value = ids.filter(Boolean).join(' ');
  return value.length > 0 ? value : undefined;
}

function passwordTone(strength: string) {
  if (strength === 'Надёжный') {
    return 'success' as const;
  }

  if (strength === 'Нормальный') {
    return 'accent' as const;
  }

  if (strength === 'Пусто') {
    return 'neutral' as const;
  }

  return 'warning' as const;
}

function buildRegistrationPayloadPreview(form: RegistrationForm) {
  return {
    fullName: form.fullName.trim() || '...',
    city: form.city.trim() || '...',
    email: form.email.trim().toLowerCase() || '...',
    focus: form.focus,
    experience: form.experience,
    plan: form.plan,
    teamName: form.plan === 'team' ? form.teamName.trim() || '...' : undefined,
    bio: form.bio.trim() || '...',
    wantsDigest: form.wantsDigest,
  };
}
