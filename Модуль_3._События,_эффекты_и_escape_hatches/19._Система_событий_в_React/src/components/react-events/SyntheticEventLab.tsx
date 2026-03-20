import clsx from 'clsx';
import { useState } from 'react';

import type { HandlerPattern } from '../../lib/event-domain';
import { buildHandlerPatternReport } from '../../lib/synthetic-event-model';
import { CodeBlock, Panel, StatusPill } from '../ui';

type EventSnapshot = {
  action: string;
  pattern: HandlerPattern;
  type: string;
  target: string;
  currentTarget: string;
  nativeType: string;
};

const actionButtons = [
  {
    id: 'save',
    label: 'Сохранить',
    pattern: 'direct',
    note: 'Прямой handler, когда дополнительный аргумент не нужен.',
  },
  {
    id: 'archive',
    label: 'Архивировать',
    pattern: 'inline',
    note: 'Inline wrapper, когда нужно передать action name.',
  },
  {
    id: 'pin',
    label: 'Закрепить',
    pattern: 'curried',
    note: 'Factory handler, когда нужен заранее подготовленный callback.',
  },
] as const;

function readElementLabel(node: EventTarget | null) {
  if (!(node instanceof HTMLElement)) {
    return 'unknown';
  }

  const action = node.dataset.action;
  return action
    ? `${node.tagName.toLowerCase()}[data-action="${action}"]`
    : node.tagName.toLowerCase();
}

export function SyntheticEventLab() {
  const [activePattern, setActivePattern] = useState<HandlerPattern>('direct');
  const [lastEvent, setLastEvent] = useState<EventSnapshot | null>(null);
  const [history, setHistory] = useState<EventSnapshot[]>([]);

  const activeReport = buildHandlerPatternReport(activePattern);

  function commitSnapshot(
    action: string,
    pattern: HandlerPattern,
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    const snapshot = {
      action,
      pattern,
      type: event.type,
      target: readElementLabel(event.target),
      // Для dataset и element-level метаданных нужен именно currentTarget:
      // это тот узел, на котором висит обработчик React.
      currentTarget: readElementLabel(event.currentTarget),
      nativeType: event.nativeEvent.constructor.name,
    } satisfies EventSnapshot;

    setActivePattern(pattern);
    setLastEvent(snapshot);
    setHistory((current) => [snapshot, ...current].slice(0, 6));
  }

  function handleDirectClick(event: React.MouseEvent<HTMLButtonElement>) {
    commitSnapshot(event.currentTarget.dataset.action ?? 'save', 'direct', event);
  }

  function handleNamedAction(
    action: string,
    pattern: HandlerPattern,
    event: React.MouseEvent<HTMLButtonElement>,
  ) {
    commitSnapshot(action, pattern, event);
  }

  function createPinnedHandler(action: string) {
    return (event: React.MouseEvent<HTMLButtonElement>) => {
      commitSnapshot(action, 'curried', event);
    };
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {actionButtons.map((button) => (
            <button
              key={button.id}
              type="button"
              onMouseEnter={() => setActivePattern(button.pattern)}
              className={clsx('chip', activePattern === button.pattern && 'chip-active')}
            >
              {button.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">
              Паттерны назначения обработчиков
            </h3>
            <StatusPill tone={activeReport.tone}>{activePattern}</StatusPill>
          </div>
          <p className="text-sm leading-6 text-slate-600">{activeReport.summary}</p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <button
            type="button"
            data-action="save"
            onClick={handleDirectClick}
            className="rounded-[24px] border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              direct
            </span>
            <span className="mt-2 block text-lg font-semibold text-slate-900">
              Сохранить
            </span>
            <span className="mt-2 block text-sm leading-6 text-slate-600">
              {actionButtons[0].note}
            </span>
          </button>

          <button
            type="button"
            data-action="archive"
            onClick={(event) => handleNamedAction('archive', 'inline', event)}
            className="rounded-[24px] border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              inline
            </span>
            <span className="mt-2 block text-lg font-semibold text-slate-900">
              <span className="rounded-md bg-amber-100 px-2 py-1 text-amber-900">
                Архив
              </span>{' '}
              курса
            </span>
            <span className="mt-2 block text-sm leading-6 text-slate-600">
              {actionButtons[1].note}
            </span>
          </button>

          <button
            type="button"
            data-action="pin"
            onClick={createPinnedHandler('pin')}
            className="rounded-[24px] border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              curried
            </span>
            <span className="mt-2 block text-lg font-semibold text-slate-900">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                P
              </span>{' '}
              Закрепить
            </span>
            <span className="mt-2 block text-sm leading-6 text-slate-600">
              {actionButtons[2].note}
            </span>
          </button>
        </div>

        <CodeBlock label={activeReport.title} code={activeReport.snippet} />
      </Panel>

      <Panel className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">
            Снимок последнего события
          </h3>
          {lastEvent ? <StatusPill tone="success">{lastEvent.type}</StatusPill> : null}
        </div>

        {lastEvent ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Action
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {lastEvent.action}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Pattern
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                {lastEvent.pattern}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                target
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {lastEvent.target}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                currentTarget
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {lastEvent.currentTarget}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                nativeEvent
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {lastEvent.nativeType}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
            Нажмите любую из трёх кнопок слева. Здесь появится снимок `SyntheticEvent` и
            данные из `nativeEvent`.
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Журнал
            </h4>
            <button
              type="button"
              onClick={() => {
                setLastEvent(null);
                setHistory([]);
              }}
              className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
            >
              Очистить
            </button>
          </div>
          <div className="space-y-2">
            {history.length > 0 ? (
              history.map((entry, index) => (
                <div
                  key={`${entry.action}-${entry.pattern}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700"
                >
                  <span className="font-semibold text-slate-900">{entry.pattern}</span>{' '}
                  передал ` {entry.type} ` и открыл `{entry.currentTarget}`.
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-500">
                Журнал пуст. Здесь удобно видеть, что React передаёт единый объект события
                независимо от того, direct это handler или wrapper.
              </div>
            )}
          </div>
        </div>
      </Panel>
    </div>
  );
}
