import clsx from 'clsx';
import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { PORTAL_ROOT_ID, layerCards, type TooltipMode } from '../../lib/escape-domain';
import { buildLayeringReport, computeTooltipPlacement } from '../../lib/layering-model';
import { Panel, StatusPill } from '../ui';

export function LayerEscapeLab() {
  const portalRoot =
    typeof document === 'undefined' ? null : document.getElementById(PORTAL_ROOT_ID);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [tooltipMode, setTooltipMode] = useState<TooltipMode>('portal');
  const [isOpen, setIsOpen] = useState(true);
  const [position, setPosition] = useState({ top: 24, left: 24 });

  useLayoutEffect(() => {
    if (!isOpen || tooltipMode !== 'portal') {
      return;
    }

    const anchor = anchorRef.current;

    if (!anchor) {
      return;
    }

    const update = () => {
      const next = computeTooltipPlacement(
        anchor.getBoundingClientRect(),
        window.innerWidth,
        window.innerHeight,
        260,
        120,
      );
      setPosition(next);
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [isOpen, tooltipMode]);

  const inlineReport = buildLayeringReport('inline');
  const portalReport = buildLayeringReport('portal');

  const tooltipCard = (
    <div
      style={
        tooltipMode === 'portal' ? { top: position.top, left: position.left } : undefined
      }
      className={clsx(
        'w-[16.25rem] rounded-[24px] border border-blue-200 bg-blue-50/95 p-4 text-sm leading-6 text-blue-950 shadow-lg shadow-blue-200/30',
        tooltipMode === 'portal'
          ? 'fixed z-[115]'
          : 'absolute -right-16 top-full mt-3 z-20',
      )}
    >
      Portal overlay может выйти из clipping-контейнера и жить в отдельном верхнем слое.
    </div>
  );

  return (
    <Panel className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone="success">portals escape clipping</StatusPill>
        <span className="text-sm text-slate-500">
          Mode: <strong>{tooltipMode}</strong>
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Tooltip mode</span>
          <div className="flex flex-wrap gap-2">
            {(['portal', 'inline'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setTooltipMode(mode)}
                className={clsx(
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  tooltipMode === mode
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
            Layer rule
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {tooltipMode === 'portal' ? portalReport.summary : inlineReport.summary}
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,rgba(248,250,252,0.96),rgba(255,255,255,0.92))] p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          {layerCards.map((card, index) => (
            <div
              key={card.id}
              className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Card {index + 1}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{card.summary}</p>
              {card.id === 'gamma' ? (
                <div className="relative mt-5">
                  <button
                    ref={anchorRef}
                    type="button"
                    onClick={() => setIsOpen((current) => !current)}
                    className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    {isOpen ? 'Скрыть tooltip' : 'Показать tooltip'}
                  </button>
                  {tooltipMode === 'inline' && isOpen ? tooltipCard : null}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {tooltipMode === 'portal' && isOpen && portalRoot
        ? createPortal(tooltipCard, portalRoot)
        : null}
    </Panel>
  );
}
