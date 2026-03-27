import { useRef, useState, type FormEvent } from 'react';

import { createControlledLessonForm, type PitfallMode } from '../../lib/form-domain';
import { buildPitfallReport } from '../../lib/pitfalls-model';
import { CodeBlock, StatusPill } from '../ui';

export function FormPitfallsLab() {
  const [mode, setMode] = useState<PitfallMode>('checkbox-value');
  const [wrongCheckboxValue, setWrongCheckboxValue] = useState<string | boolean>(false);
  const [correctCheckboxValue, setCorrectCheckboxValue] = useState(false);
  const [submitLog, setSubmitLog] = useState('Submit flow ещё не проверялся.');
  const [controlledValue, setControlledValue] = useState(
    createControlledLessonForm().fullName,
  );
  const controlledResetRef = useRef<HTMLFormElement | null>(null);
  const report = buildPitfallReport(mode);

  const handleSubmitPreview = (event: FormEvent<HTMLFormElement>) => {
    if (mode !== 'missing-prevent-default') {
      event.preventDefault();
      setSubmitLog(
        '`preventDefault()` сработал, SPA-форма осталась под контролем React.',
      );
      return;
    }

    setSubmitLog(
      'Без `preventDefault()` браузер ушёл бы в нативный submit flow. В демо навигация остановлена после логирования.',
    );
    event.preventDefault();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        {(
          [
            ['checkbox-value', 'Checkbox value'],
            ['missing-prevent-default', 'Submit flow'],
            ['dom-reset-vs-state', 'Reset mismatch'],
          ] as const
        ).map(([item, label]) => (
          <button
            key={item}
            type="button"
            onClick={() => setMode(item)}
            className={mode === item ? 'chip chip-active' : 'chip'}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              pitfalls
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">{report.label}</h3>
          </div>
          <StatusPill tone={report.tone}>{report.label}</StatusPill>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">{report.summary}</p>
      </div>

      {mode === 'checkbox-value' ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <label className="rounded-[28px] border border-rose-300 bg-rose-50/80 p-6 shadow-sm">
            <span className="block text-sm font-semibold text-rose-950">
              Плохой checkbox handler
            </span>
            <span className="mt-3 inline-flex items-center gap-3 text-sm text-rose-950">
              <input
                type="checkbox"
                value="on"
                checked={Boolean(wrongCheckboxValue)}
                onChange={(event) => setWrongCheckboxValue(event.target.value)}
              />
              newsletter = {String(wrongCheckboxValue)}
            </span>
          </label>

          <label className="rounded-[28px] border border-emerald-300 bg-emerald-50/80 p-6 shadow-sm">
            <span className="block text-sm font-semibold text-emerald-950">
              Корректный checkbox handler
            </span>
            <span className="mt-3 inline-flex items-center gap-3 text-sm text-emerald-950">
              <input
                type="checkbox"
                checked={correctCheckboxValue}
                onChange={(event) => setCorrectCheckboxValue(event.target.checked)}
              />
              newsletter = {String(correctCheckboxValue)}
            </span>
          </label>
        </div>
      ) : null}

      {mode === 'missing-prevent-default' ? (
        <form
          action="/native-submit-preview"
          onSubmit={handleSubmitPreview}
          className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
        >
          <input
            defaultValue="Тест submit"
            className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 outline-none"
          />
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="submit" className="chip">
              Отправить
            </button>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-600">{submitLog}</p>
        </form>
      ) : null}

      {mode === 'dom-reset-vs-state' ? (
        <form
          ref={controlledResetRef}
          className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
        >
          <input
            value={controlledValue}
            onChange={(event) => setControlledValue(event.target.value)}
            className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 outline-none"
          />
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => controlledResetRef.current?.reset()}
              className="chip"
            >
              Только form.reset()
            </button>
            <button
              type="button"
              onClick={() => {
                controlledResetRef.current?.reset();
                setControlledValue(createControlledLessonForm().fullName);
              }}
              className="chip"
            >
              form.reset() + setState
            </button>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-600">
            Controlled value: {controlledValue}
          </p>
        </form>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <CodeBlock label="Bad pattern" code={report.badSnippet} />
        <CodeBlock label="Good pattern" code={report.goodSnippet} />
      </div>
    </div>
  );
}
