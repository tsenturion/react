import { useRef, useState } from 'react';

import { ListBlock, MetricCard, Panel, StatusPill } from '../ui';
import { refScenarios } from '../../lib/refs-dom-model';

export function RefsDomLab() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  // ReturnType<typeof setTimeout> удерживает корректный тип handle без привязки
  // к одному конкретному окружению исполнения.
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [log, setLog] = useState<string[]>(['typed refs ready']);
  const [savedAt, setSavedAt] = useState<string>('ещё не сохранено');

  function focusInput() {
    inputRef.current?.focus();
    setLog((items) => ['input focused', ...items].slice(0, 5));
  }

  function scrollList() {
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setLog((items) => ['list scrolled', ...items].slice(0, 5));
  }

  function scheduleAutosave() {
    if (autosaveTimerRef.current !== null) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(() => {
      setSavedAt(new Date().toLocaleTimeString('ru-RU'));
      setLog((items) => ['autosave committed', ...items].slice(0, 5));
      autosaveTimerRef.current = null;
    }, 700);

    setLog((items) => ['autosave scheduled', ...items].slice(0, 5));
  }

  return (
    <Panel className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <input
            ref={inputRef}
            defaultValue="Typed DOM focus"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={focusInput}
              className="rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white"
            >
              Focus input
            </button>
            <button
              type="button"
              onClick={scrollList}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Scroll to list
            </button>
            <button
              type="button"
              onClick={scheduleAutosave}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Schedule autosave
            </button>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">Ref diagnostics</h3>
            <StatusPill tone="success">typed</StatusPill>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Узлы и таймер описаны явными типами, поэтому DOM API, null-ветки и cleanup
            остаются видимыми прямо в коде.
          </p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <MetricCard
          label="Input ref"
          value={refScenarios[0].nodeType}
          hint={refScenarios[0].safePattern}
          tone="accent"
        />
        <MetricCard
          label="List ref"
          value={refScenarios[1].nodeType}
          hint={refScenarios[1].safePattern}
          tone="cool"
        />
        <MetricCard
          label="Autosave"
          value={savedAt}
          hint={refScenarios[2].safePattern}
          tone="dark"
        />
      </div>

      <ul
        ref={listRef}
        className="space-y-2 rounded-[24px] border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-700 shadow-sm"
      >
        {log.map((item) => (
          <li
            key={item}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
          >
            {item}
          </li>
        ))}
      </ul>

      <ListBlock
        title="Типизированные ref-сценарии"
        items={refScenarios.map(
          (item) => `${item.label}: ${item.risk} ${item.safePattern}`,
        )}
      />
    </Panel>
  );
}
