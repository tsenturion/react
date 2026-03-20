import clsx from 'clsx';
import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { workspacePresets, type WorkspacePresetId } from '../../lib/dom-hooks-domain';

export type PaletteHandle = {
  open(prefill?: string): void;
  focusSearch(): void;
  selectPreset(id: WorkspacePresetId): void;
  reset(): void;
};

export const ImperativePalette = forwardRef<PaletteHandle>(
  function ImperativePalette(_props, ref) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const pendingFocusRef = useRef(false);
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activePreset, setActivePreset] = useState<WorkspacePresetId>('audit');

    useLayoutEffect(() => {
      if (!isOpen || !pendingFocusRef.current) {
        return;
      }

      inputRef.current?.focus();
      pendingFocusRef.current = false;
    }, [isOpen]);

    // Наружу отдаётся только узкий набор команд.
    // Родитель не получает raw DOM и не мутирует состояние child напрямую.
    useImperativeHandle(
      ref,
      () => ({
        open(prefill) {
          setIsOpen(true);
          if (prefill !== undefined) {
            setQuery(prefill);
          }
        },
        focusSearch() {
          pendingFocusRef.current = true;
          setIsOpen(true);
        },
        selectPreset(id) {
          setIsOpen(true);
          setActivePreset(id);
        },
        reset() {
          setIsOpen(false);
          setQuery('');
          setActivePreset('audit');
        },
      }),
      [],
    );

    const preset =
      workspacePresets.find((item) => item.id === activePreset) ?? workspacePresets[0];

    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Imperative child
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">
              Palette internal state stays inside child
            </h3>
          </div>
          <span
            className={clsx(
              'rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]',
              isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600',
            )}
          >
            {isOpen ? 'open' : 'closed'}
          </span>
        </div>

        <div className="mt-5 space-y-4">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-700">
              Search inside child
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Child-owned query"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white"
            />
          </label>

          <div className="grid gap-3 md:grid-cols-3">
            {workspacePresets.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setIsOpen(true);
                  setActivePreset(item.id);
                }}
                className={clsx(
                  'rounded-[20px] border px-4 py-4 text-left transition',
                  activePreset === item.id
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100',
                )}
              >
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
              </button>
            ))}
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            Активный preset: <strong>{preset.label}</strong>. Query inside child:{' '}
            <strong>{query || 'empty'}</strong>.
          </div>
        </div>
      </div>
    );
  },
);
