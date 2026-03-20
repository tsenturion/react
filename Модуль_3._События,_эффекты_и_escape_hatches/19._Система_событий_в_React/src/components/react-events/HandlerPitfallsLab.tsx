import clsx from 'clsx';
import { useState } from 'react';

import type { PitfallMode } from '../../lib/event-domain';
import { buildPitfallReport } from '../../lib/event-pitfall-model';
import { CodeBlock, Panel, StatusPill } from '../ui';

const modes: readonly { id: PitfallMode; label: string }[] = [
  { id: 'target-vs-currentTarget', label: 'target vs currentTarget' },
  { id: 'invoke-during-render', label: 'invoke during render' },
  { id: 'arg-wrapper', label: 'аргументы через wrapper' },
];

const lessonCards = [
  { id: 'events-101', title: 'Synthetic Events' },
  { id: 'events-201', title: 'Bubbling' },
  { id: 'events-301', title: 'preventDefault' },
] as const;

export function HandlerPitfallsLab() {
  const [mode, setMode] = useState<PitfallMode>('target-vs-currentTarget');
  const [targetLog, setTargetLog] = useState<string | null>(null);
  const [renderLog, setRenderLog] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  const report = buildPitfallReport(mode);

  function handleTargetComparison(event: React.MouseEvent<HTMLButtonElement>) {
    const targetNode = event.target instanceof HTMLElement ? event.target : null;
    const targetLessonId = targetNode?.dataset.lessonId ?? '(нет dataset)';
    const currentLessonId = event.currentTarget.dataset.lessonId ?? '(нет dataset)';

    setMode('target-vs-currentTarget');
    setTargetLog(
      `target = ${targetNode?.tagName.toLowerCase() ?? 'unknown'} / ${targetLessonId}; currentTarget = ${event.currentTarget.tagName.toLowerCase()} / ${currentLessonId}`,
    );
  }

  function simulateRender(strategy: 'invoke' | 'pass') {
    setMode('invoke-during-render');
    setRenderLog(
      strategy === 'invoke'
        ? 'Выражение removeLesson(id) выполнится прямо во время render. В prop попадёт результат вызова, а не функция.'
        : 'В prop onClick попадёт функция-обёртка. Она запустится только после клика пользователя.',
    );
  }

  function handleWrappedSelection(lessonId: string) {
    setMode('arg-wrapper');
    setSelectedLessonId(lessonId);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {modes.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id)}
              className={clsx('chip', mode === item.id && 'chip-active')}
            >
              {item.label}
            </button>
          ))}
        </div>

        {mode === 'target-vs-currentTarget' ? (
          <div className="space-y-4">
            <button
              type="button"
              data-lesson-id="events-201"
              onClick={handleTargetComparison}
              className="w-full rounded-[28px] border border-slate-200 bg-white p-5 text-left shadow-sm"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                nested button
              </span>
              <span className="mt-3 block text-lg font-semibold text-slate-900">
                <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-blue-700">
                  click
                </span>{' '}
                по внутреннему span
              </span>
              <span
                data-lesson-id="inner-span"
                className="mt-3 inline-flex rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700"
              >
                Внутренний элемент внутри button
              </span>
            </button>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              {targetLog ??
                'Нажмите на внутренний элемент. Сравнение покажет, почему dataset родителя нужно читать через currentTarget.'}
            </div>
          </div>
        ) : null}

        {mode === 'invoke-during-render' ? (
          <div className="grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={() => simulateRender('invoke')}
              className="rounded-[24px] border border-rose-200 bg-rose-50 p-4 text-left"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                bad
              </p>
              <p className="mt-2 text-sm font-medium text-rose-950">
                onClick=&#123;removeLesson(id)&#125;
              </p>
            </button>
            <button
              type="button"
              onClick={() => simulateRender('pass')}
              className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-4 text-left"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                good
              </p>
              <p className="mt-2 text-sm font-medium text-emerald-950">
                onClick=&#123;() =&gt; removeLesson(id)&#125;
              </p>
            </button>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600 md:col-span-2">
              {renderLog ??
                'Нажмите один из вариантов. Здесь появится симуляция того, что реально получает prop onClick.'}
            </div>
          </div>
        ) : null}

        {mode === 'arg-wrapper' ? (
          <div className="grid gap-3">
            {lessonCards.map((lesson) => (
              <div
                key={lesson.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-slate-200 bg-white p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{lesson.title}</p>
                  <p className="text-sm leading-6 text-slate-600">{lesson.id}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleWrappedSelection(lesson.id)}
                  className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Выбрать урок
                </button>
              </div>
            ))}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              {selectedLessonId
                ? `Wrapper корректно передал аргумент. Сейчас выбран: ${selectedLessonId}.`
                : 'Выберите любой урок. Обработчик получит id не через немедленный вызов, а через функцию-обёртку.'}
            </div>
          </div>
        ) : null}
      </Panel>

      <Panel className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">{report.title}</h3>
          <StatusPill tone={report.tone}>{mode}</StatusPill>
        </div>
        <p className="text-sm leading-6 text-slate-600">{report.summary}</p>
        <div className="grid gap-4 xl:grid-cols-2">
          <CodeBlock label="Bad snippet" code={report.badSnippet} />
          <CodeBlock label="Good snippet" code={report.goodSnippet} />
        </div>
      </Panel>
    </div>
  );
}
