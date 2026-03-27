import { useRef, useState, type FormEvent } from 'react';

import {
  buildNativeFormPayload,
  buildNativeVsReactReport,
  buildReactFormPayload,
} from '../../lib/native-react-form-model';
import {
  createNativeComparisonForm,
  type NativeComparisonForm,
} from '../../lib/form-domain';
import { StatusPill } from '../ui';

export function NativeVsReactLab() {
  const nativeFormRef = useRef<HTMLFormElement | null>(null);
  const [nativePayload, setNativePayload] = useState(() => buildNativeFormPayload({}));
  const [reactForm, setReactForm] = useState(createNativeComparisonForm);
  const [reactMessage, setReactMessage] = useState('React-форма ещё не отправлялась.');

  const report = buildNativeVsReactReport(
    nativePayload,
    buildReactFormPayload(reactForm),
  );

  const handleNativeSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

    const data = new FormData(form);
    setNativePayload(
      buildNativeFormPayload({
        topic: data.get('topic') ?? undefined,
        details: data.get('details') ?? undefined,
        format: data.get('format') ?? undefined,
      }),
    );
  };

  const handleReactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (reactForm.topic.trim().length < 5) {
      setReactMessage('Тема должна быть не короче 5 символов.');
      return;
    }

    if (reactForm.details.trim().length < 10) {
      setReactMessage('Описание должно быть не короче 10 символов.');
      return;
    }

    setReactMessage(
      'React-форма успешно прошла ручную валидацию и собрала payload из state.',
    );
  };

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <form
        ref={nativeFormRef}
        onSubmit={handleNativeSubmit}
        className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              native form
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              Browser validation, FormData и reset уже есть на платформе
            </h3>
          </div>
          <StatusPill tone={report.tone}>{report.nativeLabel}</StatusPill>
        </div>

        <div className="mt-5 grid gap-4">
          <input
            name="topic"
            required
            minLength={5}
            defaultValue={createNativeComparisonForm().topic}
            className="rounded-[18px] border border-slate-200 bg-white px-4 py-3 outline-none"
          />
          <textarea
            name="details"
            required
            minLength={10}
            rows={4}
            defaultValue={createNativeComparisonForm().details}
            className="rounded-[18px] border border-slate-200 bg-white px-4 py-3 outline-none"
          />
          <select
            name="format"
            defaultValue={createNativeComparisonForm().format}
            className="rounded-[18px] border border-slate-200 bg-white px-4 py-3 outline-none"
          >
            <option value="workshop">Workshop</option>
            <option value="review">Review</option>
          </select>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="submit" className="chip">
            Native submit
          </button>
          <button
            type="button"
            onClick={() => nativeFormRef.current?.reset()}
            className="chip"
          >
            Native reset
          </button>
        </div>
      </form>

      <form
        onSubmit={handleReactSubmit}
        className="rounded-[28px] border border-blue-300 bg-blue-50/70 p-6 shadow-sm"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              react-managed form
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-blue-950">
              State-driven input, custom validation и предсказуемый UI
            </h3>
          </div>
          <StatusPill tone="success">{report.reactLabel}</StatusPill>
        </div>

        <div className="mt-5 grid gap-4">
          <input
            value={reactForm.topic}
            onChange={(event) =>
              setReactForm((current) => ({ ...current, topic: event.target.value }))
            }
            className="rounded-[18px] border border-blue-200 bg-white px-4 py-3 outline-none"
          />
          <textarea
            value={reactForm.details}
            onChange={(event) =>
              setReactForm((current) => ({ ...current, details: event.target.value }))
            }
            rows={4}
            className="rounded-[18px] border border-blue-200 bg-white px-4 py-3 outline-none"
          />
          <select
            value={reactForm.format}
            onChange={(event) =>
              setReactForm((current) => ({
                ...current,
                format: event.target.value as NativeComparisonForm['format'],
              }))
            }
            className="rounded-[18px] border border-blue-200 bg-white px-4 py-3 outline-none"
          >
            <option value="workshop">Workshop</option>
            <option value="review">Review</option>
          </select>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="submit" className="chip">
            React submit
          </button>
          <button
            type="button"
            onClick={() => {
              setReactForm(createNativeComparisonForm());
              setReactMessage('React-форма сброшена через state.');
            }}
            className="chip"
          >
            React reset
          </button>
        </div>

        <p className="mt-5 text-sm leading-6 text-blue-950">{reactMessage}</p>
      </form>
    </div>
  );
}
