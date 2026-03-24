import { type FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useJourneyState } from '../../state/JourneyStateContext';
import { Panel, StatusPill } from '../ui';

type DraftState = {
  title: string;
  owner: string;
  scope: 'critical' | 'standard';
  notes: string;
};

const initialDraft: DraftState = {
  title: 'Auth redirect regression pack',
  owner: 'security-squad',
  scope: 'critical',
  notes: 'Проверить redirect на защищённый экран после login и сохранение intent.',
};

export function ReleaseFormLab() {
  const navigate = useNavigate();
  const { setLastSubmission } = useJourneyState();
  const [draft, setDraft] = useState<DraftState>(initialDraft);
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => {
    const nextErrors: string[] = [];

    if (!draft.title.trim()) {
      nextErrors.push('Название сценария не может быть пустым.');
    }

    if (!draft.owner.trim()) {
      nextErrors.push('Нужно указать ответственный поток.');
    }

    if (draft.notes.trim().length < 16) {
      nextErrors.push('Примечание для review screen должно быть содержательным.');
    }

    return nextErrors;
  }, [draft]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    if (errors.length > 0) {
      return;
    }

    setLastSubmission(draft);

    // Финальное подтверждение принадлежит отдельному маршруту review.
    // E2E видит полноценный screen transition, а не локальный флаг "успешно отправлено".
    void navigate('/submission-review');
  }

  return (
    <div className="space-y-6">
      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Form journey
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              От локального ввода к отдельному review screen
            </h2>
          </div>
          <StatusPill tone={errors.length === 0 ? 'success' : 'warn'}>
            {errors.length === 0 ? 'ready to submit' : 'needs fixes'}
          </StatusPill>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Название релизного сценария</span>
              <input
                value={draft.title}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, title: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
              />
            </label>

            <label className="space-y-2 text-sm text-slate-700">
              <span className="font-medium">Ответственный поток</span>
              <input
                value={draft.owner}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, owner: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
              />
            </label>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-slate-700">Критичность</legend>
            <div className="flex flex-wrap gap-3">
              {[
                ['critical', 'critical'],
                ['standard', 'standard'],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700"
                >
                  <input
                    type="radio"
                    name="scope"
                    value={value}
                    checked={draft.scope === value}
                    onChange={() =>
                      setDraft((current) => ({
                        ...current,
                        scope: value as DraftState['scope'],
                      }))
                    }
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Примечание для review screen</span>
            <textarea
              value={draft.notes}
              onChange={(event) =>
                setDraft((current) => ({ ...current, notes: event.target.value }))
              }
              className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-400"
            />
          </label>

          {submitted && errors.length > 0 ? (
            <div
              role="alert"
              className="rounded-[24px] border border-rose-200 bg-rose-50 px-4 py-4"
            >
              <p className="text-sm font-semibold text-rose-950">
                До review screen не хватает нескольких условий:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-rose-950">
                {errors.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Отправить на review screen
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft(initialDraft);
                setSubmitted(false);
              }}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Сбросить форму
            </button>
          </div>
        </form>
      </Panel>

      <Panel className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Validation
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Пока требования не выполнены, путь останавливается в текущем экране и
            показывает `role=alert`.
          </p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Submit
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            После submit браузер переходит на отдельный route, поэтому сценарий виден как
            настоящий screen-to-screen flow.
          </p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Review
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Итоговое подтверждение находится уже вне формы. Это снижает риск теста,
            который знает только локальный state и не видит весь путь.
          </p>
        </div>
      </Panel>
    </div>
  );
}
