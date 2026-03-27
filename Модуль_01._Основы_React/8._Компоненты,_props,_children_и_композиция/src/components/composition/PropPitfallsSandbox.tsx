import { useMemo, useState } from 'react';

import { buildMirrorReport, buildMutationReport } from '../../lib/anti-pattern-model';
import { Panel, StatusPill } from '../ui';

function BrokenMirrorField({ title }: { title: string }) {
  // Это намеренно плохой пример:
  // локальный state один раз копирует prop и больше не синхронизируется с родителем.
  const [draft, setDraft] = useState(title);

  return (
    <div className="space-y-3 rounded-[24px] border border-amber-300 bg-amber-50 p-4">
      <p className="text-sm font-semibold text-amber-900">Плохой вариант</p>
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        className="w-full rounded-2xl border border-amber-200 bg-white px-4 py-3"
      />
      <p className="text-sm leading-6 text-amber-900">
        Локальная копия: <strong>{draft}</strong>
      </p>
    </div>
  );
}

function ControlledMirrorField({
  title,
  onChange,
}: {
  title: string;
  onChange: (nextTitle: string) => void;
}) {
  return (
    <div className="space-y-3 rounded-[24px] border border-emerald-300 bg-emerald-50 p-4">
      <p className="text-sm font-semibold text-emerald-900">Хороший вариант</p>
      <input
        value={title}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3"
      />
      <p className="text-sm leading-6 text-emerald-900">
        Значение приходит напрямую из props и меняется через callback.
      </p>
    </div>
  );
}

function MutatingTagsBad({ tags, onPing }: { tags: string[]; onPing: () => void }) {
  return (
    <button
      type="button"
      onClick={() => {
        tags.push(`mutated-${tags.length + 1}`);
        onPing();
      }}
      className="rounded-2xl bg-rose-600 px-4 py-3 font-semibold text-white"
    >
      Плохое добавление через mutation
    </button>
  );
}

function ImmutableTagsGood({ onAdd }: { onAdd: () => void }) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white"
    >
      Хорошее добавление через setState
    </button>
  );
}

export function PropPitfallsSandbox() {
  const [parentTitle, setParentTitle] = useState('Компонент как независимый блок');
  const [tags, setTags] = useState(['props', 'children']);
  const [tick, setTick] = useState(0);
  const [initialTagCount] = useState(tags.length);

  const mirrorReport = buildMirrorReport(parentTitle, 'Компонент как независимый блок');
  const mutationReport = useMemo(
    () => buildMutationReport(initialTagCount, tags.length),
    [initialTagCount, tags.length],
  );

  return (
    <div className="space-y-6">
      <Panel className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Зеркалирование props в state
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Измените parent title и сравните, как реагируют хороший и плохой вариант.
            </p>
          </div>
          <StatusPill tone={mirrorReport.tone}>{mirrorReport.title}</StatusPill>
        </div>

        <label className="space-y-2 text-sm text-slate-700">
          <span className="font-medium">Parent title</span>
          <input
            value={parentTitle}
            onChange={(event) => setParentTitle(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3"
          />
        </label>

        <div className="grid gap-4 lg:grid-cols-2">
          <BrokenMirrorField title={parentTitle} />
          <ControlledMirrorField title={parentTitle} onChange={setParentTitle} />
        </div>
        <p className="text-sm leading-6 text-slate-600">{mirrorReport.note}</p>
      </Panel>

      <Panel className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Мутация props/state</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Плохой пример мутирует массив напрямую и вызывает посторонний ререндер через
              `tick`. Хороший вариант создаёт новый массив через `setState`.
            </p>
          </div>
          <StatusPill tone={mutationReport.tone}>{mutationReport.title}</StatusPill>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm leading-6 text-slate-700">
            Tick для искусственного ререндера: <strong>{tick}</strong>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white px-3 py-2 text-sm font-medium text-slate-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <MutatingTagsBad tags={tags} onPing={() => setTick((current) => current + 1)} />
          <ImmutableTagsGood
            onAdd={() => setTags((current) => [...current, `safe-${current.length + 1}`])}
          />
        </div>
        <p className="text-sm leading-6 text-slate-600">{mutationReport.note}</p>
      </Panel>
    </div>
  );
}
