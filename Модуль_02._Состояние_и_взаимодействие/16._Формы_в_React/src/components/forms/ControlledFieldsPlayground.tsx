import { useState, type ChangeEvent } from 'react';

import { buildControlledFormReport } from '../../lib/controlled-form-model';
import {
  createControlledLessonForm,
  type ControlledLessonForm,
} from '../../lib/form-domain';
import { StatusPill } from '../ui';

export function ControlledFieldsPlayground() {
  const [form, setForm] = useState(createControlledLessonForm);
  const report = buildControlledFormReport(form);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const target = event.currentTarget;
    const { name } = target;

    // Для checkbox источник истины — checked, а не value.
    // Остальные поля читают value и снова рисуются из state на следующем рендере.
    const value =
      target instanceof HTMLInputElement && target.type === 'checkbox'
        ? target.checked
        : target.value;

    setForm((current) => ({ ...current, [name]: value }) as ControlledLessonForm);
  };

  return (
    <div className="space-y-5">
      <form className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              controlled form
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              Ввод сразу попадает в state и тут же возвращается в UI
            </h3>
          </div>
          <StatusPill tone={report.tone}>{report.completion}% complete</StatusPill>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-semibold">Имя</span>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 outline-none"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-semibold">Трек</span>
            <select
              name="track"
              value={form.track}
              onChange={handleChange}
              className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 outline-none"
            >
              <option value="basics">Basics</option>
              <option value="state">State</option>
              <option value="forms">Forms</option>
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-700 md:col-span-2">
            <span className="font-semibold">Задача</span>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 outline-none"
            />
          </label>

          <label className="inline-flex items-center gap-3 rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
            <input
              type="checkbox"
              name="newsletter"
              checked={form.newsletter}
              onChange={handleChange}
            />
            Получать обновления по теме
          </label>

          <fieldset className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-4">
            <legend className="px-2 text-sm font-semibold text-slate-700">
              Канал связи
            </legend>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-700">
              {(['email', 'telegram', 'phone'] as const).map((item) => (
                <label key={item} className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="contactPreference"
                    value={item}
                    checked={form.contactPreference === item}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </form>

      <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          state preview
        </p>
        <pre className="mt-3 overflow-x-auto text-sm leading-6 text-slate-700">
          <code>{JSON.stringify(form, null, 2)}</code>
        </pre>
        <p className="mt-4 text-sm leading-6 text-slate-600">{report.previewLabel}</p>
      </div>
    </div>
  );
}
