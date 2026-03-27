import { useEffect, useRef, useState } from 'react';

import { buildDefaultActionReport } from '../../lib/default-action-model';
import { CodeBlock, Panel, StatusPill } from '../ui';

export function DefaultActionLab() {
  const [preventLink, setPreventLink] = useState(false);
  const [preventCheckbox, setPreventCheckbox] = useState(false);
  const [checkboxVersion, setCheckboxVersion] = useState(0);
  const [currentHash, setCurrentHash] = useState(
    typeof window === 'undefined' ? '(пусто)' : window.location.hash || '(пусто)',
  );
  const [checkboxState, setCheckboxState] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const checkboxRef = useRef<HTMLInputElement | null>(null);
  const report = buildDefaultActionReport({ preventLink, preventCheckbox });

  useEffect(() => {
    function syncHash() {
      setCurrentHash(window.location.hash || '(пусто)');
    }

    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  function pushEntry(message: string) {
    setHistory((current) => [message, ...current].slice(0, 8));
  }

  function handleLinkClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (preventLink) {
      event.preventDefault();
    }

    window.setTimeout(() => {
      const nextHash = window.location.hash || '(пусто)';
      setCurrentHash(nextHash);
      pushEntry(
        preventLink
          ? 'Ссылка нажата, но переход по hash остановлен через preventDefault().'
          : `Ссылка нажата, браузер перешёл к ${nextHash}.`,
      );
    }, 0);
  }

  function handleCheckboxClick(event: React.MouseEvent<HTMLInputElement>) {
    if (preventCheckbox) {
      event.preventDefault();
    }

    window.setTimeout(() => {
      const checked = Boolean(checkboxRef.current?.checked);
      setCheckboxState(checked);
      pushEntry(
        preventCheckbox
          ? `Checkbox кликнут, но default toggle остановлен. DOM checked = ${checked}.`
          : `Checkbox кликнут, браузер сам переключил checked в ${checked}.`,
      );
    }, 0);
  }

  function resetCheckbox() {
    setCheckboxVersion((current) => current + 1);
    setCheckboxState(false);
    pushEntry(
      'Checkbox смонтирован заново, чтобы начать эксперимент с чистого состояния.',
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <Panel className="space-y-5">
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={preventLink}
              onChange={(event) => setPreventLink(event.target.checked)}
            />
            `preventDefault()` на ссылке
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={preventCheckbox}
              onChange={(event) => setPreventCheckbox(event.target.checked)}
            />
            `preventDefault()` на checkbox
          </label>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-[28px] border border-blue-200 bg-blue-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              Link default action
            </p>
            <a
              href="#react-events-anchor"
              onClick={handleLinkClick}
              className="mt-4 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Перейти к hash target
            </a>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Текущий hash: <code>{currentHash}</code>
            </p>
            <button
              type="button"
              onClick={() => {
                window.history.replaceState(
                  null,
                  '',
                  window.location.pathname + window.location.search,
                );
                setCurrentHash('(пусто)');
                pushEntry('Hash очищен без новой навигации.');
              }}
              className="mt-3 rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              Очистить hash
            </button>
          </div>

          <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Checkbox default action
            </p>
            <label className="mt-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
              <input
                key={checkboxVersion}
                ref={checkboxRef}
                type="checkbox"
                onClick={handleCheckboxClick}
              />
              Разрешить публикацию после проверки
            </label>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              DOM checked после клика: <code>{String(checkboxState)}</code>
            </p>
            <button
              type="button"
              onClick={resetCheckbox}
              className="mt-3 rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              Сбросить checkbox
            </button>
          </div>
        </div>

        <div
          id="react-events-anchor"
          className="rounded-2xl border border-slate-200 bg-white p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">Что сейчас происходит</p>
            <StatusPill tone={report.tone}>preventDefault</StatusPill>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">{report.summary}</p>
          <CodeBlock label="Default action" code={report.snippet} />
        </div>
      </Panel>

      <Panel className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Журнал последствий</h3>
        <div className="space-y-2">
          {history.length > 0 ? (
            history.map((entry, index) => (
              <div
                key={`${entry}-${index}`}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700"
              >
                {entry}
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-500">
              Попробуйте сначала ссылку, потом checkbox. Журнал покажет разницу между
              разрешённым и отменённым browser default behavior.
            </div>
          )}
        </div>
      </Panel>
    </div>
  );
}
