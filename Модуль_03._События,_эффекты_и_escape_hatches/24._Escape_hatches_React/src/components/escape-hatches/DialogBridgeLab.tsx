import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

import { Panel, StatusPill } from '../ui';

type ShellMode = 'closed' | 'react-open' | 'drift-open';

export function DialogBridgeLab() {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [shellMode, setShellMode] = useState<ShellMode>('closed');
  const [status, setStatus] = useState(
    'Откройте dialog через state bridge и отдельно попробуйте force-open без синхронизации с React.',
  );

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    const handleClose = () => {
      setIsOpen(false);
      setShellMode('closed');
      setStatus('Dialog закрылся и bridge вернул React state в closed.');
    };

    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('cancel', handleClose);
    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('cancel', handleClose);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (isOpen && !dialog.open) {
      dialog.showModal();
    }

    if (!isOpen && shellMode !== 'drift-open' && dialog.open) {
      dialog.close();
    }
  }, [isOpen, shellMode]);

  return (
    <Panel className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone="success">bridge to imperative browser API</StatusPill>
        <span className="text-sm text-slate-500">
          React shell: <strong>{shellMode}</strong>
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setShellMode('react-open');
            setStatus('React state открыл dialog через effect bridge к showModal().');
          }}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Open through state
        </button>
        <button
          type="button"
          onClick={() => {
            if (!dialogRef.current?.open) {
              dialogRef.current?.showModal();
            }
            setShellMode('drift-open');
            setStatus(
              'Dialog открыт imperatively напрямую. React shell ещё не считает его открытым через state.',
            );
          }}
          className="rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-200"
        >
          Force open only
        </button>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setShellMode('closed');
            setStatus(
              'React state переведён в closed и bridge вызовет close() для dialog.',
            );
          }}
          className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-200"
        >
          Close through state
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm leading-6 text-slate-600">
            Нативный <code>&lt;dialog&gt;</code> управляется через imperative методы
            <code> showModal()</code> и <code>close()</code>. Здесь bridge делает это
            синхронно со state, а force-open демонстрирует, как быстро возникает drift.
          </p>

          <dialog
            ref={dialogRef}
            className="max-w-xl rounded-[28px] border border-slate-200 p-0 shadow-2xl backdrop:bg-slate-950/45"
          >
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Native dialog API
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900">
                Imperative browser API под контролем React
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Закройте окно кнопкой ниже или клавишей Escape и посмотрите, как слушатель
                `close` возвращает React shell в актуальное состояние.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => dialogRef.current?.close()}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Close dialog
                </button>
              </div>
            </div>
          </dialog>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-blue-200 bg-blue-50/80 p-5 text-sm leading-6 text-blue-950">
            {status}
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-3 text-sm leading-6 text-slate-700">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                state isOpen: {String(isOpen)}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                shell mode: {shellMode}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                recommended path:{' '}
                <span
                  className={clsx(
                    'font-semibold',
                    shellMode === 'drift-open' ? 'text-rose-700' : 'text-emerald-700',
                  )}
                >
                  {shellMode === 'drift-open'
                    ? 'bridge missing'
                    : 'state + effect bridge'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
