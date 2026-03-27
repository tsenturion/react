import clsx from 'clsx';
import { useState } from 'react';

import type { BubbleStop } from '../../lib/event-domain';
import { buildBubblingReport } from '../../lib/bubbling-model';
import { Panel, StatusPill } from '../ui';

type BubbleEntry = {
  zone: string;
  target: string;
  currentTarget: string;
  stopped: boolean;
};

function readNodeLabel(node: EventTarget | null) {
  if (!(node instanceof HTMLElement)) {
    return 'unknown';
  }

  return node.dataset.zone ?? node.tagName.toLowerCase();
}

const stopOptions: readonly { id: BubbleStop; label: string; note: string }[] = [
  {
    id: 'none',
    label: 'Не останавливать',
    note: 'button передаст событие дальше к card и board.',
  },
  {
    id: 'button',
    label: 'Остановить на button',
    note: 'Родители выше уже не получат событие.',
  },
  {
    id: 'card',
    label: 'Остановить на card',
    note: 'button и card отработают, board уже нет.',
  },
];

export function BubblingLab() {
  const [stopAt, setStopAt] = useState<BubbleStop>('none');
  const [history, setHistory] = useState<BubbleEntry[]>([]);

  const report = buildBubblingReport(stopAt);

  function pushEntry(
    zone: string,
    event: React.MouseEvent<HTMLElement>,
    stopped: boolean,
  ) {
    const entry = {
      zone,
      target: readNodeLabel(event.target),
      currentTarget: readNodeLabel(event.currentTarget),
      stopped,
    } satisfies BubbleEntry;

    setHistory((current) => [entry, ...current].slice(0, 8));
  }

  function handleBoardClick(event: React.MouseEvent<HTMLDivElement>) {
    pushEntry('board', event, false);
  }

  function handleCardClick(event: React.MouseEvent<HTMLDivElement>) {
    const shouldStop = stopAt === 'card';
    if (shouldStop) {
      event.stopPropagation();
    }
    pushEntry('card', event, shouldStop);
  }

  function handleButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
    const shouldStop = stopAt === 'button';
    if (shouldStop) {
      event.stopPropagation();
    }
    pushEntry('button', event, shouldStop);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {stopOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setStopAt(option.id)}
              className={clsx('chip', stopAt === option.id && 'chip-active')}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 sm:p-6">
          <div
            data-zone="board"
            onClick={handleBoardClick}
            className="rounded-[26px] border border-blue-200 bg-blue-50 p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              board
            </p>
            <div
              data-zone="card"
              onClick={handleCardClick}
              className="mt-4 rounded-[22px] border border-emerald-200 bg-emerald-50 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                card
              </p>
              <button
                type="button"
                data-zone="button"
                onClick={handleButtonClick}
                className="mt-4 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Нажмите button
              </button>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Лучше всего видно всплытие, если нажать центральную кнопку. Но можно
                кликнуть и по card или board: журнал покажет реальный `target`.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">Ожидаемая цепочка</p>
            <StatusPill tone={report.tone}>{stopAt}</StatusPill>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {report.propagation.map((step) => (
              <span
                key={step}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
              >
                {step}
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{report.summary}</p>
        </div>
      </Panel>

      <Panel className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Журнал всплытия</h3>
          <button
            type="button"
            onClick={() => setHistory([])}
            className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
          >
            Очистить
          </button>
        </div>

        <div className="space-y-2">
          {history.length > 0 ? (
            history.map((entry, index) => (
              <div
                key={`${entry.zone}-${index}`}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">{entry.zone}</p>
                  {entry.stopped ? (
                    <StatusPill tone="warn">stopPropagation()</StatusPill>
                  ) : (
                    <StatusPill tone="success">bubble</StatusPill>
                  )}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  target: <code>{entry.target}</code>, currentTarget:{' '}
                  <code>{entry.currentTarget}</code>
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-500">
              Нажмите кнопку внутри card. Порядок записей покажет, как React поднимает
              событие вверх по дереву обработчиков.
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
