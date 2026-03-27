import clsx from 'clsx';
import { useState } from 'react';

import {
  createBlueprintPresets,
  type BlueprintPresetId,
} from '../../lib/interface-practice-domain';
import { buildBlueprintPlan } from '../../lib/blueprint-model';

const presets = createBlueprintPresets();

export function BlueprintWorkshopLab() {
  const [presetId, setPresetId] = useState<BlueprintPresetId>('course-console');
  const preset = presets.find((item) => item.id === presetId) ?? presets[0];
  const plan = buildBlueprintPlan(presetId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {presets.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setPresetId(item.id)}
            className={clsx('chip', presetId === item.id && 'chip-active')}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Текстовый бриф
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-700">{preset.brief}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {preset.highlights.map((item) => (
              <span
                key={item}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <aside className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Как читать результат
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-700">
            Сначала извлекаются части экрана, затем state-срезы, потом derived values и
            только после этого список событий. Именно так бриф превращается в реактовскую
            архитектуру.
          </p>
        </aside>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <ListPanel title="Компоненты" items={plan.components} />
        <ListPanel title="State" items={plan.state} />
        <ListPanel title="Derived" items={plan.derived} />
        <ListPanel title="Events" items={plan.events} />
      </div>
    </div>
  );
}

function ListPanel({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {title}
      </p>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
