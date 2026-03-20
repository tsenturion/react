import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { PORTAL_ROOT_ID, type BubbleMode } from '../../lib/escape-domain';
import { describeBubbleSequence } from '../../lib/portal-model';
import { Panel, StatusPill } from '../ui';

export function PortalEventsLab() {
  const portalRoot =
    typeof document === 'undefined' ? null : document.getElementById(PORTAL_ROOT_ID);
  const [bubbleMode, setBubbleMode] = useState<BubbleMode>('allow');
  const [logs, setLogs] = useState<string[]>([
    'Нажмите кнопку внутри portal и посмотрите, как событие проходит по React-дереву.',
  ]);
  const [parentHits, setParentHits] = useState(0);

  function pushLog(entry: string) {
    setLogs((current) => [entry, ...current].slice(0, 6));
  }

  const sequence = useMemo(() => describeBubbleSequence(bubbleMode), [bubbleMode]);

  const portalSurface = (
    <div className="fixed bottom-6 right-6 z-[110] w-[22rem] rounded-[24px] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/15">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Portal surface in body host
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        DOM здесь живёт вне карточки ниже, но React-родитель по-прежнему может получить
        bubbling event.
      </p>
      <div
        className="mt-4 rounded-[20px] border border-slate-200 bg-slate-50 p-4"
        onClick={(event) => {
          pushLog('Portal surface обработал click.');
          if (bubbleMode === 'stop') {
            event.stopPropagation();
            pushLog('Portal surface вызвал stopPropagation().');
          }
        }}
      >
        <button
          type="button"
          onClick={() => pushLog('Кнопка внутри portal вызвала свой handler.')}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          Click inside portal
        </button>
      </div>
    </div>
  );

  return (
    <Panel className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone="success">portal keeps React bubbling</StatusPill>
        <span className="text-sm text-slate-500">
          Parent hits: <strong>{parentHits}</strong>
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Bubble mode</span>
          <div className="flex flex-wrap gap-2">
            {(['allow', 'stop'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setBubbleMode(mode)}
                className={clsx(
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  bubbleMode === mode
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </label>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Sequence
          </p>
          <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
            {sequence.map((step, index) => (
              <li
                key={step}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                {index + 1}. {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div
        className="rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,rgba(248,250,252,0.96),rgba(255,255,255,0.92))] p-6 shadow-sm"
        onClick={() => {
          setParentHits((current) => current + 1);
          pushLog('Parent React handler получил bubbling event.');
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Parent React section
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Эта секция находится в обычном дереве приложения. Portal ниже рендерится в
          другой DOM-host, но React bubbling остаётся связан с этим родителем.
        </p>
        <div className="mt-5 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm leading-6 text-slate-600">
            Portal host:{' '}
            <strong>{portalRoot ? `#${PORTAL_ROOT_ID}` : 'not found'}</strong>
          </p>
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Event log
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
          {logs.map((entry) => (
            <li
              key={entry}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              {entry}
            </li>
          ))}
        </ul>
      </div>

      {portalRoot ? createPortal(portalSurface, portalRoot) : null}
    </Panel>
  );
}
