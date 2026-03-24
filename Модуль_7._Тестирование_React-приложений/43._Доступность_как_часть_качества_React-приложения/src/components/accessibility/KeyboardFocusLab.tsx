import { useEffect, useMemo, useRef, useState } from 'react';

import { summarizeKeyboardScenario } from '../../lib/accessibility-runtime';
import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';

type InteractionMode = 'semantic' | 'click-only';

const quickActions = [
  { id: 'search', label: 'Быстрый поиск' },
  { id: 'save', label: 'Сохранить как черновик' },
];

export function KeyboardFocusLab() {
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('semantic');
  const [restoresFocus, setRestoresFocus] = useState(true);
  const [supportsEscape, setSupportsEscape] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogQuery, setDialogQuery] = useState('');
  const [activeElement, setActiveElement] = useState('ничего не сфокусировано');
  const openerRef = useRef<HTMLButtonElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const scopeRef = useRef<HTMLDivElement>(null);

  const summary = useMemo(
    () =>
      summarizeKeyboardScenario({
        usesSemanticControls: interactionMode === 'semantic',
        restoresFocus,
        supportsEscape,
        clickOnlyHotspots: interactionMode === 'click-only',
      }),
    [interactionMode, restoresFocus, supportsEscape],
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

  useEffect(() => {
    if (!dialogOpen) {
      return;
    }

    firstFieldRef.current?.focus();
  }, [dialogOpen]);

  function closeDialog() {
    setDialogOpen(false);

    if (restoresFocus) {
      queueMicrotask(() => {
        openerRef.current?.focus();
      });
    }
  }

  return (
    <div ref={scopeRef} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Score"
          value={String(summary.score)}
          hint="Оценка зависит от native controls, возврата фокуса и предсказуемого выхода из диалога."
        />
        <MetricCard
          label="Verdict"
          value={summary.verdict}
          hint="Хороший keyboard flow не требует мыши для завершения сценария."
          tone="accent"
        />
        <MetricCard
          label="Current focus"
          value={activeElement}
          hint="Откройте диалог, пройдите действия и посмотрите, где реально находится focus."
          tone="cool"
        />
      </div>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Keyboard support
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Keyboard-путь должен проходить через действия и временные слои без тупиков
            </h2>
          </div>
          <StatusPill tone={summary.score >= 80 ? 'success' : 'warn'}>
            {summary.score >= 80 ? 'stable flow' : 'risk in flow'}
          </StatusPill>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
            <input
              type="radio"
              name="interaction-mode"
              checked={interactionMode === 'semantic'}
              onChange={() => setInteractionMode('semantic')}
            />
            <span>Действия собраны из button</span>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
            <input
              type="radio"
              name="interaction-mode"
              checked={interactionMode === 'click-only'}
              onChange={() => setInteractionMode('click-only')}
            />
            <span>Действия остались click-only div</span>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={restoresFocus}
              onChange={(event) => setRestoresFocus(event.target.checked)}
            />
            <span>После закрытия диалога фокус возвращается к триггеру</span>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={supportsEscape}
              onChange={(event) => setSupportsEscape(event.target.checked)}
            />
            <span>Диалог можно закрыть через Escape</span>
          </label>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-800">
              Пройдите quick actions через клавиатуру. В click-only режиме элементы
              визуально похожи на действия, но не входят в стандартный Tab-порядок.
            </p>

            <div className="flex flex-wrap gap-3">
              {quickActions.map((action) =>
                interactionMode === 'semantic' ? (
                  <button
                    key={action.id}
                    type="button"
                    data-focus-label={action.label}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                  >
                    {action.label}
                  </button>
                ) : (
                  <div
                    key={action.id}
                    onClick={() => setActiveElement(`${action.label} (mouse only)`)}
                    className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-950"
                  >
                    {action.label}
                  </div>
                ),
              )}
            </div>

            <button
              ref={openerRef}
              type="button"
              data-focus-label="Открыть диалог действий"
              onClick={() => setDialogOpen(true)}
              className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-600"
            >
              Открыть диалог действий
            </button>
          </div>

          <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white p-5">
            <ListBlock title="Ожидаемый Tab-порядок" items={summary.tabPreview} />
          </div>
        </div>
      </Panel>

      {dialogOpen ? (
        <Panel className="space-y-4 border-teal-200 bg-teal-50/70">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="actions-dialog-title"
            className="space-y-4"
            onKeyDown={(event) => {
              if (event.key === 'Escape' && supportsEscape) {
                closeDialog();
              }
            }}
          >
            <h3
              id="actions-dialog-title"
              className="text-lg font-semibold text-slate-900"
            >
              Командная палитра действий
            </h3>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-800">
                Поиск по действиям
              </span>
              <input
                ref={firstFieldRef}
                type="text"
                value={dialogQuery}
                aria-label="Поиск по действиям"
                onChange={(event) => setDialogQuery(event.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={closeDialog}
                className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
              >
                Закрыть диалог
              </button>
            </div>

            {!supportsEscape ? (
              <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
                Escape сейчас отключён. Слой визуально закрываемый, но keyboard-путь стал
                уже менее предсказуемым.
              </p>
            ) : null}
          </div>
        </Panel>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <ListBlock title="Что помогает сценарию" items={summary.risks.slice(0, 2)} />
        </Panel>
        <Panel>
          <ListBlock title="Что легко ломает путь" items={summary.risks.slice(2)} />
        </Panel>
      </div>
    </div>
  );
}
