import { useState } from 'react';

import { useRenderCount } from '../../hooks/useRenderCount';
import { describeStatePlacement } from '../../lib/state-colocation-model';
import { MetricCard, StatusPill } from '../ui';

const catalogItems = [
  'Component tree map',
  'Form ownership checklist',
  'Routing contracts',
  'Error boundary strategy',
  'Query caching notes',
  'Render budget review',
  'Profiler walkthrough',
  'Testing matrix',
] as const;

function matchesItem(item: string, query: string) {
  return item.toLowerCase().includes(query.trim().toLowerCase());
}

function LiftedFilter({
  query,
  onChange,
}: {
  query: string;
  onChange: (value: string) => void;
}) {
  const commits = useRenderCount();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-800">Lifted filter panel</p>
        <output aria-label="Lifted filter commits" className="chip">
          {commits} commits
        </output>
      </div>
      <label className="mt-3 block space-y-2">
        <span className="text-sm text-slate-600">Запрос (lifted state)</span>
        <input
          aria-label="Запрос (lifted state)"
          value={query}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
        />
      </label>
    </div>
  );
}

function LiftedList({ query }: { query: string }) {
  const commits = useRenderCount();
  const visibleItems = catalogItems.filter((item) => matchesItem(item, query));

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-800">Lifted result list</p>
        <output aria-label="Lifted list commits" className="chip">
          {commits} commits
        </output>
      </div>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
        {visibleItems.map((item) => (
          <li
            key={item}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LiftedBoard() {
  const commits = useRenderCount();
  const [query, setQuery] = useState('');
  const diagnosis = describeStatePlacement({
    mode: 'lifted',
    shellCommits: commits,
    listCommits: 0,
    hasUnappliedDraft: false,
  });

  return (
    <div className="space-y-4 rounded-[28px] border border-rose-200 bg-rose-50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
            Сценарий A
          </p>
          <h3 className="mt-2 text-xl font-semibold text-rose-950">Lifted state</h3>
        </div>
        <output
          aria-label="Lifted shell commits"
          className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-rose-700"
        >
          {commits} commits
        </output>
      </div>
      <p className="text-sm leading-6 text-rose-900">{diagnosis.detail}</p>
      <LiftedFilter query={query} onChange={setQuery} />
      <LiftedList query={query} />
    </div>
  );
}

function ColocatedFilter({ onApply }: { onApply: (value: string) => void }) {
  const commits = useRenderCount();
  const [draft, setDraft] = useState('');

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-800">Colocated filter panel</p>
        <output aria-label="Colocated filter commits" className="chip">
          {commits} commits
        </output>
      </div>
      <label className="mt-3 block space-y-2">
        <span className="text-sm text-slate-600">Черновик фильтра (colocated state)</span>
        <input
          aria-label="Черновик фильтра (colocated state)"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-emerald-400"
        />
      </label>
      <button
        type="button"
        onClick={() => onApply(draft)}
        className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
      >
        Применить локальный фильтр
      </button>
    </div>
  );
}

function ColocatedList({ query }: { query: string }) {
  const commits = useRenderCount();
  const visibleItems = catalogItems.filter((item) => matchesItem(item, query));

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-800">Colocated result list</p>
        <output aria-label="Colocated list commits" className="chip">
          {commits} commits
        </output>
      </div>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
        {visibleItems.map((item) => (
          <li
            key={item}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ColocatedBoard() {
  const commits = useRenderCount();
  const [appliedQuery, setAppliedQuery] = useState('');
  const diagnosis = describeStatePlacement({
    mode: 'colocated',
    shellCommits: commits,
    listCommits: 0,
    hasUnappliedDraft: true,
  });

  return (
    <div className="space-y-4 rounded-[28px] border border-emerald-200 bg-emerald-50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Сценарий B
          </p>
          <h3 className="mt-2 text-xl font-semibold text-emerald-950">
            Colocated draft state
          </h3>
        </div>
        <output
          aria-label="Colocated shell commits"
          className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-emerald-700"
        >
          {commits} commits
        </output>
      </div>
      <p className="text-sm leading-6 text-emerald-900">{diagnosis.detail}</p>
      <ColocatedFilter onApply={setAppliedQuery} />
      <ColocatedList query={appliedQuery} />
    </div>
  );
}

export function StateColocationLab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Первый вопрос"
          value="Кому реально нужен draft?"
          hint="Если только input, не поднимайте его в общий shell раньше времени."
          tone="accent"
        />
        <MetricCard
          label="Хороший сигнал"
          value="typing не трогает list"
          hint="В expensive surfaces должно обновляться только applied state."
          tone="cool"
        />
        <MetricCard
          label="Смысл урока"
          value="optimize by ownership"
          hint="Часто проблема решается placement state, а не сложными техниками."
          tone="dark"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <LiftedBoard />
        <ColocatedBoard />
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-5 text-white">
        <div className="flex items-center justify-between gap-3">
          <p className="text-lg font-semibold">Что здесь сравнивается</p>
          <StatusPill tone="warn">state ownership</StatusPill>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Оба экрана решают одну и ту же задачу. Разница только в том, где живёт draft
          состояния. Именно это и меняет ширину рендера на каждый ввод.
        </p>
      </div>
    </div>
  );
}
