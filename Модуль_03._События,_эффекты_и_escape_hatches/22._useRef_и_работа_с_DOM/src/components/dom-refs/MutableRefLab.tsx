import { useRef, useState } from 'react';

import { Panel, StatusPill } from '../ui';

export function MutableRefLab() {
  const draftRef = useRef(0);
  const statusNodeRef = useRef<HTMLDivElement | null>(null);
  const [paintTick, setPaintTick] = useState(1);
  const [committedValue, setCommittedValue] = useState(0);
  const [snapshotValue, setSnapshotValue] = useState(0);

  function handleRefWrite() {
    draftRef.current += 1;

    // Ref меняется сразу, но React render по этому поводу не запускается.
    // Поэтому визуально обновляется только этот imperatively изменённый DOM-узел.
    if (statusNodeRef.current) {
      statusNodeRef.current.textContent = `ref.current = ${draftRef.current}, а React всё ещё показывает snapshot ${snapshotValue}.`;
    }
  }

  function handleForceRender() {
    setSnapshotValue(draftRef.current);
    setPaintTick((current) => current + 1);
  }

  function handleSyncToState() {
    setCommittedValue(draftRef.current);
    setSnapshotValue(draftRef.current);
    setPaintTick((current) => current + 1);
  }

  function handleReset() {
    draftRef.current = 0;
    setCommittedValue(0);
    setSnapshotValue(0);
    setPaintTick(1);
    if (statusNodeRef.current) {
      statusNodeRef.current.textContent =
        'Сейчас ref и JSX снова синхронны. Дальше попробуйте изменить только ref.';
    }
  }

  return (
    <Panel className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Snapshot in JSX
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {snapshotValue}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Это значение попало в текущий render. Простая запись в ref его не обновит.
          </p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Committed to state
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {committedValue}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            State нужен там, где изменение должно стать частью интерфейса.
          </p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Render tick
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {paintTick}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Tick растёт только на state-driven шагах.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone="success">useRef keeps mutable value</StatusPill>
        <button
          type="button"
          onClick={handleRefWrite}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Изменить ref без render
        </button>
        <button
          type="button"
          onClick={handleForceRender}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          Принудительно обновить JSX
        </button>
        <button
          type="button"
          onClick={handleSyncToState}
          className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
        >
          Синхронизировать ref в state
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          Сбросить
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm leading-6 text-slate-700">
            Сначала несколько раз нажмите <strong>«Изменить ref без render»</strong>.
            Затем посмотрите, что snapshot в JSX не меняется. После этого нажмите
            <strong> «Принудительно обновить JSX»</strong> или
            <strong> «Синхронизировать ref в state»</strong>, чтобы увидеть новый
            snapshot.
          </p>
        </div>

        <div
          ref={statusNodeRef}
          className="rounded-[24px] border border-blue-200 bg-blue-50/80 p-5 text-sm leading-6 text-blue-950"
        >
          Сейчас ref и JSX синхронны. Дальше попробуйте изменить только ref.
        </div>
      </div>
    </Panel>
  );
}
