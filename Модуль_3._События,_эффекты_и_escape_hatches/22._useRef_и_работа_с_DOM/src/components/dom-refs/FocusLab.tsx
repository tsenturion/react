import { useRef, useState } from 'react';

import { getFirstInvalidField } from '../../lib/focus-dom-model';
import type { FocusFieldId, FocusFormValues } from '../../lib/ref-domain';
import { Panel, StatusPill } from '../ui';

export function FocusLab() {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const trackRef = useRef<HTMLSelectElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const [values, setValues] = useState<FocusFormValues>({
    name: '',
    email: '',
    track: '',
  });
  const [activeField, setActiveField] = useState<FocusFieldId | 'none'>('none');
  const [status, setStatus] = useState('Фокус пока не направлялся вручную.');

  function updateField<K extends keyof FocusFormValues>(
    key: K,
    value: FocusFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function rememberFocus(field: FocusFieldId, element: HTMLElement) {
    setActiveField(field);
    lastFocusedRef.current = element;
  }

  function focusField(field: FocusFieldId) {
    const map = {
      name: nameRef,
      email: emailRef,
      track: trackRef,
    } as const;

    map[field].current?.focus();
    setStatus(`Фокус направлен на поле "${field}".`);
  }

  function handleSubmit() {
    const firstInvalid = getFirstInvalidField(values);

    if (!firstInvalid) {
      setStatus('Форма выглядит валидной. Здесь ручной focus уже не нужен.');
      return;
    }

    focusField(firstInvalid);
    setStatus(
      `После submit фокус переведён на первое проблемное поле: "${firstInvalid}".`,
    );
  }

  function restoreLastFocus() {
    lastFocusedRef.current?.focus();
    setStatus('Фокус восстановлен на последний известный DOM-элемент.');
  }

  return (
    <Panel className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone="success">DOM refs for focus</StatusPill>
        <span className="text-sm text-slate-500">
          Active field: <strong>{activeField}</strong>
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Имя</span>
          <input
            ref={nameRef}
            value={values.name}
            onFocus={(event) => rememberFocus('name', event.currentTarget)}
            onChange={(event) => updateField('name', event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Email</span>
          <input
            ref={emailRef}
            value={values.email}
            onFocus={(event) => rememberFocus('email', event.currentTarget)}
            onChange={(event) => updateField('email', event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Трек</span>
          <select
            ref={trackRef}
            value={values.track}
            onFocus={(event) => rememberFocus('track', event.currentTarget)}
            onChange={(event) => updateField('track', event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
          >
            <option value="">Выберите</option>
            <option value="dom">DOM</option>
            <option value="forms">Forms</option>
            <option value="events">Events</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => focusField('email')}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Перейти к email
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          Submit и jump to invalid
        </button>
        <button
          type="button"
          onClick={restoreLastFocus}
          className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          Вернуть последний focus
        </button>
      </div>

      <div className="rounded-[24px] border border-blue-200 bg-blue-50/80 p-5 text-sm leading-6 text-blue-950">
        {status}
      </div>
    </Panel>
  );
}
