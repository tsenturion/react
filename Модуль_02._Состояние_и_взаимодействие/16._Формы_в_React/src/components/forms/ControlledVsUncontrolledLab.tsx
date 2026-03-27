import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';

import {
  buildFormModeComparison,
  serializeControlledForm,
  serializeUncontrolledForm,
} from '../../lib/controlled-vs-uncontrolled-model';
import {
  createControlledLessonForm,
  type ControlledLessonForm,
} from '../../lib/form-domain';
import { StatusPill } from '../ui';

export function ControlledVsUncontrolledLab() {
  const [controlledForm, setControlledForm] = useState(createControlledLessonForm);
  const [uncontrolledSnapshot, setUncontrolledSnapshot] = useState(() =>
    serializeUncontrolledForm({}),
  );
  const uncontrolledFormRef = useRef<HTMLFormElement | null>(null);
  const comparison = buildFormModeComparison(
    serializeControlledForm(controlledForm),
    uncontrolledSnapshot,
  );

  const handleControlledChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const target = event.currentTarget;
    const value =
      target instanceof HTMLInputElement && target.type === 'checkbox'
        ? target.checked
        : target.value;

    setControlledForm(
      (current) =>
        ({
          ...current,
          [target.name]: value,
        }) as ControlledLessonForm,
    );
  };

  const readUncontrolled = () => {
    const form = uncontrolledFormRef.current;

    if (!form) {
      return;
    }

    // Uncontrolled форма не держит live-значение в React state.
    // DOM читается только тогда, когда его явно запрашивают через FormData.
    const data = new FormData(form);
    setUncontrolledSnapshot(
      serializeUncontrolledForm({
        fullName: data.get('fullName') ?? undefined,
        track: data.get('track') ?? undefined,
        newsletter: data.get('newsletter') ?? undefined,
      }),
    );
  };

  const handleUncontrolledSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    readUncontrolled();
  };

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <form className="rounded-[28px] border border-emerald-300 bg-emerald-50/70 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              controlled
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-emerald-950">
              React знает каждое изменение сразу
            </h3>
          </div>
          <StatusPill tone="success">{comparison.controlledSummary}</StatusPill>
        </div>

        <div className="mt-5 grid gap-4">
          <input
            name="fullName"
            value={controlledForm.fullName}
            onChange={handleControlledChange}
            className="rounded-[18px] border border-emerald-200 bg-white px-4 py-3 outline-none"
          />
          <select
            name="track"
            value={controlledForm.track}
            onChange={handleControlledChange}
            className="rounded-[18px] border border-emerald-200 bg-white px-4 py-3 outline-none"
          >
            <option value="basics">Basics</option>
            <option value="state">State</option>
            <option value="forms">Forms</option>
          </select>
          <label className="inline-flex items-center gap-3 rounded-[18px] border border-emerald-200 bg-white px-4 py-3 text-sm text-emerald-950">
            <input
              type="checkbox"
              name="newsletter"
              checked={controlledForm.newsletter}
              onChange={handleControlledChange}
            />
            Newsletter
          </label>
        </div>
      </form>

      <form
        ref={uncontrolledFormRef}
        onSubmit={handleUncontrolledSubmit}
        className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              uncontrolled
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              React узнаёт итог только при чтении DOM
            </h3>
          </div>
          <StatusPill tone={comparison.tone}>{comparison.uncontrolledSummary}</StatusPill>
        </div>

        <div className="mt-5 grid gap-4">
          <input
            name="fullName"
            defaultValue={createControlledLessonForm().fullName}
            className="rounded-[18px] border border-slate-200 bg-white px-4 py-3 outline-none"
          />
          <select
            name="track"
            defaultValue={createControlledLessonForm().track}
            className="rounded-[18px] border border-slate-200 bg-white px-4 py-3 outline-none"
          >
            <option value="basics">Basics</option>
            <option value="state">State</option>
            <option value="forms">Forms</option>
          </select>
          <label className="inline-flex items-center gap-3 rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <input type="checkbox" name="newsletter" defaultChecked />
            Newsletter
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="submit" className="chip">
            Прочитать через submit
          </button>
          <button type="button" onClick={readUncontrolled} className="chip">
            Прочитать через FormData
          </button>
          <button
            type="button"
            onClick={() => uncontrolledFormRef.current?.reset()}
            className="chip"
          >
            Нативный reset
          </button>
        </div>
      </form>
    </div>
  );
}
