import { useEffect, useMemo, useRef, useState } from 'react';

import { summarizeLabelScenario, type NamingMode } from '../../lib/accessibility-runtime';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

const fieldId = 'announcement-subject-field';
const hintId = 'announcement-subject-hint';
const errorId = 'announcement-subject-error';

export function LabelAndErrorsLab() {
  const [namingMode, setNamingMode] = useState<NamingMode>('visible-label');
  const [linksHint, setLinksHint] = useState(true);
  const [linksError, setLinksError] = useState(true);
  const [draft, setDraft] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [activeElement, setActiveElement] = useState('пока ничего не сфокусировано');
  const scopeRef = useRef<HTMLDivElement>(null);

  const hasError = submitted && draft.trim().length === 0;
  const describedBy = [linksHint ? hintId : null, hasError && linksError ? errorId : null]
    .filter(Boolean)
    .join(' ');

  const summary = useMemo(
    () => summarizeLabelScenario({ namingMode, linksHint, linksError }),
    [linksError, linksHint, namingMode],
  );

  useEffect(() => {
    const scope = scopeRef.current;

    if (!scope) {
      return;
    }

    function handleFocusIn(event: FocusEvent) {
      const target = event.target as HTMLElement | null;
      const label =
        target?.getAttribute('aria-label') ??
        target?.getAttribute('data-focus-label') ??
        target?.textContent?.trim() ??
        target?.tagName.toLowerCase() ??
        'неизвестный элемент';

      setActiveElement(label);
    }

    scope.addEventListener('focusin', handleFocusIn);

    return () => {
      scope.removeEventListener('focusin', handleFocusIn);
    };
  }, []);

  return (
    <div ref={scopeRef} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Score"
          value={String(summary.score)}
          hint="Оценка падает, если имя поля держится только на placeholder или ошибка живёт отдельно."
        />
        <MetricCard
          label="Name source"
          value={summary.nameSource}
          hint="Смотрите, откуда на самом деле рождается доступное имя поля."
          tone="accent"
        />
        <MetricCard
          label="Focus target"
          value={activeElement}
          hint="Нажмите на подпись поля и посмотрите, куда реально уходит focus."
          tone="cool"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Labels and errors
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Имя поля должно собираться из интерфейса, а не из догадки браузера
            </h2>
          </div>
          <StatusPill tone={summary.score >= 80 ? 'success' : 'warn'}>
            {summary.verdict}
          </StatusPill>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {[
            ['visible-label', 'Связанный visible label'],
            ['placeholder-only', 'Только placeholder'],
            ['aria-label-only', 'aria-label без связанной подписи'],
          ].map(([value, label]) => (
            <label
              key={value}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700"
            >
              <input
                type="radio"
                name="naming-mode"
                checked={namingMode === value}
                onChange={() => setNamingMode(value as NamingMode)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={linksHint}
              onChange={(event) => setLinksHint(event.target.checked)}
            />
            <span>Подсказка связана с полем через `aria-describedby`</span>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={linksError}
              onChange={(event) => setLinksError(event.target.checked)}
            />
            <span>Ошибка тоже входит в описание поля</span>
          </label>
        </div>

        <form
          className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
          }}
        >
          <div className="space-y-2">
            {namingMode === 'visible-label' ? (
              <label
                htmlFor={fieldId}
                className="block text-sm font-medium text-slate-800"
              >
                Тема объявления
              </label>
            ) : namingMode === 'placeholder-only' ? (
              <span className="block text-sm font-medium text-slate-800">
                Тема объявления
              </span>
            ) : (
              <span className="block text-sm font-medium text-slate-800">
                Видимая подпись не связана с контролом
              </span>
            )}

            <input
              id={fieldId}
              type="text"
              value={draft}
              data-focus-label="Поле темы объявления"
              placeholder={
                namingMode === 'placeholder-only'
                  ? 'Тема объявления'
                  : 'Например, обновление расписания'
              }
              aria-label={
                namingMode === 'aria-label-only' ? 'Тема объявления' : undefined
              }
              aria-describedby={describedBy || undefined}
              aria-invalid={hasError || undefined}
              onChange={(event) => setDraft(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500"
            />

            <p id={hintId} className="text-sm leading-6 text-slate-600">
              Нажмите на подпись поля. В устойчивом варианте focus попадёт в input сразу,
              а ошибка и подсказка будут читаться вместе с именем.
            </p>

            {hasError ? (
              <p
                id={errorId}
                role="alert"
                className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-950"
              >
                Поле не заполнено. Ошибка должна звучать вместе с именем поля, а не
                отдельно от него.
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-600"
            >
              Проверить форму
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft('');
                setSubmitted(false);
              }}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Очистить поле
            </button>
          </div>

          {submitted && !hasError ? (
            <p
              role="status"
              className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-950"
            >
              Поле прошло проверку и остаётся понятным по имени и описанию.
            </p>
          ) : null}
        </form>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <ListBlock title="Что уже хорошо" items={summary.strengths} />
        </Panel>
        <Panel>
          <ListBlock title="Где возникает риск" items={summary.risks} />
        </Panel>
      </div>
    </div>
  );
}
