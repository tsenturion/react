import { useState, type FormEvent } from 'react';

import { buildControlledFormReport } from '../../lib/controlled-form-model';
import {
  createControlledLessonForm,
  type ControlledLessonForm,
} from '../../lib/form-domain';
import {
  buildSubmitFlowReport,
  buildSubmitPayload,
  canSubmitControlledForm,
  type SubmitStage,
} from '../../lib/submit-flow-model';
import { StatusPill } from '../ui';

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function SubmitFlowLab() {
  const [form, setForm] = useState(createControlledLessonForm);
  const [stage, setStage] = useState<SubmitStage>('idle');
  const [lastPayload, setLastPayload] = useState<object | null>(null);

  const canSubmit = canSubmitControlledForm(form);
  const flow = buildSubmitFlowReport(stage, canSubmit);
  const report = buildControlledFormReport(form);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      setStage('error');
      return;
    }

    setStage('submitting');
    const payload = buildSubmitPayload(form);
    setLastPayload(payload);
    await wait(500);
    setStage('success');
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
              submit flow
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              Submit — это не одна кнопка, а последовательность состояний формы
            </h3>
          </div>
          <StatusPill tone={flow.tone}>{flow.actionLabel}</StatusPill>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <input
            value={form.fullName}
            onChange={(event) =>
              setForm((current) => ({ ...current, fullName: event.target.value }))
            }
            className="rounded-[18px] border border-slate-200 bg-white px-4 py-3 outline-none"
          />
          <select
            value={form.track}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                track: event.target.value as ControlledLessonForm['track'],
              }))
            }
            className="rounded-[18px] border border-slate-200 bg-white px-4 py-3 outline-none"
          >
            <option value="basics">Basics</option>
            <option value="state">State</option>
            <option value="forms">Forms</option>
          </select>
          <textarea
            value={form.bio}
            onChange={(event) =>
              setForm((current) => ({ ...current, bio: event.target.value }))
            }
            rows={4}
            className="rounded-[18px] border border-slate-200 bg-white px-4 py-3 outline-none md:col-span-2"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="submit" disabled={stage === 'submitting'} className="chip">
            {stage === 'submitting' ? 'Отправка...' : 'Отправить'}
          </button>
          <button
            type="button"
            onClick={() => {
              setForm(createControlledLessonForm());
              setStage('idle');
              setLastPayload(null);
            }}
            className="chip"
          >
            Полный reset
          </button>
        </div>

        <p className="mt-5 text-sm leading-6 text-slate-600">{report.summary}</p>
      </form>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            stage
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-700">{flow.summary}</p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            payload preview
          </p>
          <pre className="mt-3 overflow-x-auto text-sm leading-6 text-slate-700">
            <code>{JSON.stringify(lastPayload, null, 2)}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
