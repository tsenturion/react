import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { PORTAL_ROOT_ID, type PortalRenderMode } from '../../lib/escape-domain';
import { describePortalMode } from '../../lib/portal-model';
import { Panel, StatusPill } from '../ui';

function ModalSurface({
  label,
  onClose,
  onPromote,
}: {
  label: string;
  onClose: () => void;
  onPromote: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 px-4">
      <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {label}
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-slate-900">
          Модальное дерево остаётся частью React-логики
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          DOM этой поверхности может оказаться в другом месте документа, но кнопки ниже
          всё равно управляют state родительского компонента.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onPromote}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Изменить parent state
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

export function PortalModalLab() {
  const portalRoot =
    typeof document === 'undefined' ? null : document.getElementById(PORTAL_ROOT_ID);
  const [renderMode, setRenderMode] = useState<PortalRenderMode>('portal');
  const [isOpen, setIsOpen] = useState(false);
  const [ownerState, setOwnerState] = useState(0);

  useEffect(() => {
    if (!isOpen || renderMode !== 'portal') {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, renderMode]);

  const modeCopy = useMemo(() => describePortalMode(renderMode), [renderMode]);

  const content = isOpen ? (
    <ModalSurface
      label={renderMode === 'portal' ? 'Rendered in portal host' : 'Rendered inline'}
      onClose={() => setIsOpen(false)}
      onPromote={() => setOwnerState((current) => current + 1)}
    />
  ) : null;

  return (
    <Panel className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone="success">createPortal for modal layer</StatusPill>
        <span className="text-sm text-slate-500">
          Parent state: <strong>{ownerState}</strong>
        </span>
        <span className="text-sm text-slate-500">
          Portal host: <strong>{portalRoot ? `#${PORTAL_ROOT_ID}` : 'not found'}</strong>
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700">Render mode</span>
          <div className="flex flex-wrap gap-2">
            {(['portal', 'inline'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setRenderMode(mode)}
                className={clsx(
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  renderMode === mode
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
            Что происходит
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">{modeCopy}</p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,rgba(248,250,252,0.96),rgba(255,255,255,0.92))] p-6 shadow-sm">
        <div className="max-w-xl rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Page shell
          </p>
          <h3 className="mt-3 text-xl font-semibold text-slate-900">
            Управление модалкой живёт в родителе
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Откройте modal и измените parent state изнутри неё. Это та же React-ветка,
            даже если DOM уедет в отдельный host.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Открыть modal
            </button>
            <button
              type="button"
              onClick={() => setOwnerState((current) => current + 1)}
              className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-200"
            >
              Изменить parent state снаружи
            </button>
          </div>
        </div>

        {renderMode === 'inline' ? content : null}
      </div>

      {renderMode === 'portal' && portalRoot && content
        ? // Portal меняет место DOM-узла, но не ownership в React.
          createPortal(content, portalRoot)
        : null}
    </Panel>
  );
}
