import { type FormEvent, useState } from 'react';

import {
  CodeBlock,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import {
  describeFormBehavior,
  messageModes,
  summarizeSubmittedEntries,
  type MessageMode,
} from '../lib/form-model';
import { projectStudy } from '../lib/project-study';

type SubmissionSummary = ReturnType<typeof summarizeSubmittedEntries>;

export function FormsPage() {
  const [trackHasName, setTrackHasName] = useState(true);
  const [messageMode, setMessageMode] = useState<MessageMode>('enabled');
  const [requireConsent, setRequireConsent] = useState(true);
  const [submission, setSubmission] = useState<SubmissionSummary | null>(null);
  const [invalidMessage, setInvalidMessage] = useState('');

  const behavior = describeFormBehavior({
    trackHasName,
    messageMode,
    requireConsent,
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInvalidMessage('');

    // Форма здесь намеренно остаётся uncontrolled: тема разбирает поведение платформы,
    // поэтому браузер и FormData выступают источником истины.
    if (!event.currentTarget.reportValidity()) {
      return;
    }

    const entries = Array.from(new FormData(event.currentTarget).entries());
    setSubmission(
      summarizeSubmittedEntries(entries, {
        trackHasName,
        messageMode,
        requireConsent,
      }),
    );
  };

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Lab 2"
        title="Нативные формы: labels, name, browser validation и FormData"
        copy="Здесь форма намеренно не завязана на постоянный React-state для каждого поля. Так видно, что сама платформа уже умеет сериализовать данные, валидировать обязательные поля и отличать `disabled` от `readonly`."
        aside={
          <div className="space-y-3">
            <StatusPill tone={invalidMessage ? 'error' : submission ? 'success' : 'warn'}>
              {invalidMessage ? 'invalid' : submission ? 'submitted' : 'native form'}
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Меняйте атрибуты полей и сразу смотрите, как браузер меняет payload формы.
            </p>
          </div>
        }
      />

      <Panel className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <input
                  type="checkbox"
                  checked={trackHasName}
                  onChange={(event) => setTrackHasName(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                <span className="text-sm leading-6 text-slate-700">
                  У `select` есть `name`, поэтому значение попадает в `FormData`.
                </span>
              </label>

              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <input
                  type="checkbox"
                  checked={requireConsent}
                  onChange={(event) => setRequireConsent(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                <span className="text-sm leading-6 text-slate-700">
                  Согласие обязательно, и браузер блокирует submit без него.
                </span>
              </label>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                Состояние комментария
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {messageModes.map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setMessageMode(mode)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      messageMode === mode
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <form
              className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
              onInvalidCapture={(event) => {
                const target = event.target as
                  | HTMLInputElement
                  | HTMLSelectElement
                  | HTMLTextAreaElement;
                setInvalidMessage(
                  `${target.name || target.id}: ${target.validationMessage}`,
                );
              }}
              onReset={() => {
                setSubmission(null);
                setInvalidMessage('');
              }}
              onSubmit={handleSubmit}
            >
              <fieldset className="space-y-4">
                <legend className="text-lg font-semibold text-slate-900">
                  Учебная регистрация
                </legend>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium text-slate-800"
                      htmlFor="full-name"
                    >
                      Имя
                    </label>
                    <input
                      id="full-name"
                      name="fullName"
                      required
                      defaultValue="Алексей"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-800" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      defaultValue="reader@example.com"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-800" htmlFor="track">
                    Трек
                  </label>
                  <select
                    id="track"
                    {...(trackHasName ? { name: 'track' } : {})}
                    defaultValue="accessibility"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400"
                  >
                    <option value="semantics">HTML и landmarks</option>
                    <option value="forms">Формы платформы</option>
                    <option value="events">DOM events</option>
                    <option value="accessibility">Доступность</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-800" htmlFor="message">
                    Комментарий
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    defaultValue="Хочу разобрать native behavior подробнее."
                    readOnly={messageMode === 'readonly'}
                    disabled={messageMode === 'disabled'}
                    className="min-h-28 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 disabled:bg-slate-100"
                  />
                </div>

                <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <input
                    id="consent"
                    name="consent"
                    type="checkbox"
                    required={requireConsent}
                    defaultChecked
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
                  />
                  <span className="text-sm leading-6 text-slate-700">
                    Согласие на получение материалов по теме.
                  </span>
                </label>
              </fieldset>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Отправить форму
                </button>
                <button
                  type="reset"
                  className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  Сбросить
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard
                label="submitted fields"
                value={String(submission?.fieldCount ?? 0)}
                hint="Количество полей, которые реально вошли в `FormData`."
              />
              <MetricCard
                label="form status"
                value={
                  invalidMessage
                    ? 'blocked by browser'
                    : submission
                      ? 'valid submit'
                      : 'not sent'
                }
                hint="Native validation срабатывает до пользовательской логики обработки."
                tone="accent"
              />
            </div>

            {invalidMessage ? (
              <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-950">
                Браузер не пропустил submit: {invalidMessage}
              </div>
            ) : null}

            <CodeBlock label="form markup preview" code={behavior.markupPreview} />

            <ListBlock
              title="Что меняет текущая конфигурация"
              items={behavior.fieldRules}
            />
            <ListBlock
              title="Чего не будет в payload"
              items={
                behavior.omissions.length > 0
                  ? behavior.omissions
                  : [
                      'Все текущие controls либо сериализуются, либо участвуют в валидации ожидаемым образом.',
                    ]
              }
            />
            <ListBlock
              title="FormData после submit"
              items={
                submission?.fields.length
                  ? submission.fields
                  : ['После успешного submit здесь появятся реальные пары name/value.']
              }
            />
          </div>
        </div>
      </Panel>

      <Panel>
        <ProjectStudy
          files={projectStudy.forms.files}
          snippets={projectStudy.forms.snippets}
        />
      </Panel>
    </div>
  );
}
