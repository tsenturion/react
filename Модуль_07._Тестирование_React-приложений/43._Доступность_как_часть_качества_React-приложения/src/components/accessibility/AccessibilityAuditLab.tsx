import { useMemo, useState } from 'react';

import {
  buildAuditChecklist,
  recommendedQueries,
  summarizeTestingScenario,
} from '../../lib/accessibility-runtime';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

const fieldId = 'audit-email-field';
const errorId = 'audit-email-error';

export function AccessibilityAuditLab() {
  const [hasVisibleLabel, setHasVisibleLabel] = useState(true);
  const [linksError, setLinksError] = useState(true);
  const [usesButtonElement, setUsesButtonElement] = useState(true);
  const [hasLandmarks, setHasLandmarks] = useState(true);
  const [queriesByRole, setQueriesByRole] = useState(true);
  const [checksKeyboard, setChecksKeyboard] = useState(true);
  const [checksAnnouncements, setChecksAnnouncements] = useState(true);
  const [usesTestIds, setUsesTestIds] = useState(false);
  const [assertsClasses, setAssertsClasses] = useState(false);
  const [draft, setDraft] = useState('');
  const [showAudit, setShowAudit] = useState(false);

  const hasError = showAudit && draft.trim().length === 0;
  const summary = useMemo(
    () =>
      summarizeTestingScenario({
        queriesByRole,
        checksKeyboard,
        checksAnnouncements,
        usesTestIds,
        assertsClasses,
      }),
    [assertsClasses, checksAnnouncements, checksKeyboard, queriesByRole, usesTestIds],
  );
  const report = useMemo(
    () =>
      buildAuditChecklist({
        hasVisibleLabel,
        linksError,
        usesButtonElement,
        hasLandmarks,
      }),
    [hasLandmarks, hasVisibleLabel, linksError, usesButtonElement],
  );
  const queries = useMemo(
    () => recommendedQueries({ hasVisibleLabel, usesButtonElement }),
    [hasVisibleLabel, usesButtonElement],
  );

  const describedBy = hasError && linksError ? errorId : undefined;

  const preview = (
    <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Preview form
      </p>

      {hasVisibleLabel ? (
        <label htmlFor={fieldId} className="block text-sm font-medium text-slate-800">
          Email для релизных уведомлений
        </label>
      ) : (
        <p className="text-sm font-medium text-slate-800">Label не связана с полем</p>
      )}

      <input
        id={fieldId}
        type="email"
        value={draft}
        placeholder={
          hasVisibleLabel ? 'team@example.com' : 'Email для релизных уведомлений'
        }
        aria-describedby={describedBy}
        aria-invalid={hasError || undefined}
        onChange={(event) => setDraft(event.target.value)}
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500"
      />

      {hasError ? (
        <p
          id={errorId}
          role={checksAnnouncements ? 'alert' : undefined}
          className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-950"
        >
          Укажите email, иначе человек увидит ошибку, но тест и assistive tech не получат
          гарантированного сигнала.
        </p>
      ) : null}

      {usesButtonElement ? (
        <button
          type="button"
          onClick={() => setShowAudit(true)}
          className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-600"
        >
          Отправить форму
        </button>
      ) : (
        <div
          onClick={() => setShowAudit(true)}
          className="inline-flex rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-950"
        >
          Отправить форму
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Score"
          value={String(summary.score)}
          hint="User-centric tests держатся на role/name assertions и проверке поведения, а не на классах и test ids."
        />
        <MetricCard
          label="Verdict"
          value={summary.verdict}
          hint="Набор проверок должен страховать поведение интерфейса, а не только DOM-форму реализации."
          tone="accent"
        />
        <MetricCard
          label="Audit checks"
          value={String(report.length)}
          hint="Один и тот же preview можно смотреть глазами человека, assistive tech и тестовой suite."
          tone="cool"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Testing and audits
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Accessibility-тесты должны видеть то же поведение, что видит человек
            </h2>
          </div>
          <StatusPill tone={summary.score >= 80 ? 'success' : 'warn'}>
            role-based assertions
          </StatusPill>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Конфигурация preview
            </h3>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={hasVisibleLabel}
                onChange={(event) => setHasVisibleLabel(event.target.checked)}
              />
              <span>У поля есть видимая label</span>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={linksError}
                onChange={(event) => setLinksError(event.target.checked)}
              />
              <span>Ошибка связана с полем</span>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={usesButtonElement}
                onChange={(event) => setUsesButtonElement(event.target.checked)}
              />
              <span>Сабмит выражен через button</span>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={hasLandmarks}
                onChange={(event) => setHasLandmarks(event.target.checked)}
              />
              <span>Preview разбит на semantic regions</span>
            </label>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Конфигурация test strategy
            </h3>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={queriesByRole}
                onChange={(event) => setQueriesByRole(event.target.checked)}
              />
              <span>Использовать role/name queries</span>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={checksKeyboard}
                onChange={(event) => setChecksKeyboard(event.target.checked)}
              />
              <span>Проверять keyboard path</span>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={checksAnnouncements}
                onChange={(event) => setChecksAnnouncements(event.target.checked)}
              />
              <span>Проверять alert и status</span>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={usesTestIds}
                onChange={(event) => setUsesTestIds(event.target.checked)}
              />
              <span>Опирайтесь на test ids</span>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={assertsClasses}
                onChange={(event) => setAssertsClasses(event.target.checked)}
              />
              <span>Фиксируйте CSS-классы вместо behaviour</span>
            </label>
          </div>
        </div>

        {/* Landmarks здесь переключаются отдельно, чтобы было видно:
            тесты могут быть user-centric даже при broken preview,
            и наоборот, слабая стратегия не спасает даже хороший UI. */}
        {hasLandmarks ? (
          <section aria-label="Preview audit surface">{preview}</section>
        ) : (
          <div>{preview}</div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowAudit(true)}
            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
          >
            Запустить аудит
          </button>
          <button
            type="button"
            onClick={() => {
              setShowAudit(false);
              setDraft('');
            }}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Сбросить аудит
          </button>
        </div>
      </Panel>

      {showAudit ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-900">Результат аудита</h3>
              <StatusPill tone={summary.score >= 80 ? 'success' : 'warn'}>
                live audit
              </StatusPill>
            </div>
            <ul className="space-y-3">
              {report.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <StatusPill tone={item.passed ? 'success' : 'error'}>
                      {item.passed ? 'pass' : 'fail'}
                    </StatusPill>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel className="space-y-4">
            <ListBlock title="Что проверять в тестах" items={summary.checks} />
            <ListBlock title="Подходящие query patterns" items={queries} />
          </Panel>
        </div>
      ) : null}
    </div>
  );
}
