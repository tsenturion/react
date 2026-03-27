import { useMemo, useState } from 'react';

import { compoundSections } from '../../lib/pattern-domain';
import { MetricCard, StatusPill } from '../ui';
import { PatternTabs } from './PatternTabs';

export function CompoundComponentsLab() {
  const [sectionId, setSectionId] = useState<(typeof compoundSections)[number]['id']>(
    compoundSections[0]!.id,
  );
  const activeSection =
    compoundSections.find((section) => section.id === sectionId) ?? compoundSections[0]!;
  const coveredAreas = useMemo(
    () => compoundSections.map((section) => section.label).join(' / '),
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <StatusPill tone="success">success</StatusPill>
        <p className="text-sm leading-6 text-slate-600">
          Compound components сильны там, где несколько подкомпонентов составляют одну
          surface-модель и должны делить общий контракт.
        </p>
      </div>

      <PatternTabs.Root
        value={sectionId}
        onValueChange={(value) =>
          setSectionId(value as (typeof compoundSections)[number]['id'])
        }
      >
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <PatternTabs.List className="flex flex-wrap gap-2">
            {compoundSections.map((section) => (
              <PatternTabs.Trigger
                key={section.id}
                value={section.id}
                description={section.idealFor}
              >
                {section.label}
              </PatternTabs.Trigger>
            ))}
          </PatternTabs.List>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          {compoundSections.map((section) => (
            <PatternTabs.Panel key={section.id} value={section.id}>
              <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">
                  {section.description}
                </p>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Где помогает
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {section.idealFor}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                      Где ломается
                    </p>
                    <p className="mt-2 text-sm leading-6 text-amber-950">
                      {section.caution}
                    </p>
                  </div>
                </div>
              </article>
            </PatternTabs.Panel>
          ))}

          <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Активный section API</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Сейчас открыт блок <strong>{activeSection.label}</strong>. Он выбран тем же
              compound primitive, который управляет навигацией всего урока в
              [src/App.tsx].
            </p>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Covered areas
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{coveredAreas}</p>
            </div>
          </aside>
        </div>
      </PatternTabs.Root>

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Shared contract"
          value="Root + parts"
          hint="Compound API работает, когда root и подкомпоненты принадлежат одной общей модели."
          tone="cool"
        />
        <MetricCard
          label="Главный плюс"
          value="Flexible layout"
          hint="Consumer свободно собирает surface из знакомых частей, не теряя общий state."
        />
        <MetricCard
          label="Главный риск"
          value="Hidden rules"
          hint="Если частей становится слишком много, API начинает требовать скрытых правил порядка и вложенности."
          tone="accent"
        />
      </div>
    </div>
  );
}
