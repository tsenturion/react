import { useRef, useState } from 'react';

import { workspacePresets, type WorkspacePresetId } from '../../lib/dom-hooks-domain';
import { Panel, StatusPill } from '../ui';
import { ImperativePalette, type PaletteHandle } from './ImperativePalette';

export function ImperativeHandleLab() {
  const paletteRef = useRef<PaletteHandle | null>(null);
  const [history, setHistory] = useState<string[]>([
    'Панель готова. Команды идут через useImperativeHandle, а не через прямую мутацию child state.',
  ]);

  function pushHistory(entry: string) {
    setHistory((current) => [entry, ...current].slice(0, 4));
  }

  function callWithHistory(label: string, action: () => void) {
    action();
    pushHistory(label);
  }

  return (
    <Panel className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone="success">useImperativeHandle</StatusPill>
        <span className="text-sm text-slate-500">
          Exposed commands: <strong>4</strong>
        </span>
        <span className="text-sm text-slate-500">
          Child owns: <strong>open/query/preset</strong>
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() =>
            callWithHistory('Родитель вызвал open("handoff")', () => {
              paletteRef.current?.open('handoff');
            })
          }
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Open with prefill
        </button>
        <button
          type="button"
          onClick={() =>
            callWithHistory('Родитель вызвал focusSearch()', () => {
              paletteRef.current?.focusSearch();
            })
          }
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          Focus search
        </button>
        {workspacePresets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() =>
              callWithHistory(`Родитель выбрал preset ${preset.label}`, () => {
                paletteRef.current?.selectPreset(preset.id as WorkspacePresetId);
              })
            }
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            {preset.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() =>
            callWithHistory('Родитель вызвал reset()', () => {
              paletteRef.current?.reset();
            })
          }
          className="rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-200"
        >
          Reset child
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <ImperativePalette ref={paletteRef} />

        <div className="space-y-4">
          <div className="rounded-[24px] border border-blue-200 bg-blue-50/80 p-5 text-sm leading-6 text-blue-950">
            Родитель здесь не трогает input напрямую и не передаёт наружу сеттеры child
            state. Вместо этого он пользуется ограниченным API-команд.
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Command log
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              {history.map((entry) => (
                <li
                  key={entry}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  {entry}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Panel>
  );
}
