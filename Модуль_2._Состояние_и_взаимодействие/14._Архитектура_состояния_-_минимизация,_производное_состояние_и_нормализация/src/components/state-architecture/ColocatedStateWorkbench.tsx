import { useState } from 'react';

import {
  buildColocationReport,
  type ColocationMode,
} from '../../lib/colocated-state-model';
import {
  createSectionCards,
  type SectionCard,
} from '../../lib/state-architecture-domain';
import { StatusPill } from '../ui';

function LocalSectionCard({ section }: { section: SectionCard }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setOpen((current) => !current)}
      className="rounded-[22px] border border-slate-200 bg-white px-4 py-4 text-left shadow-sm"
    >
      <span className="block text-sm font-semibold text-slate-900">{section.title}</span>
      <span className="mt-2 block text-xs uppercase tracking-[0.18em] text-slate-500">
        local: {open ? 'open' : 'closed'}
      </span>
      {open ? (
        <span className="mt-3 block text-sm leading-6 text-slate-600">
          {section.summary}
        </span>
      ) : null}
    </button>
  );
}

function HoistedSectionCard({
  section,
  open,
  onToggle,
}: {
  section: SectionCard;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-[22px] border border-slate-200 bg-white px-4 py-4 text-left shadow-sm"
    >
      <span className="block text-sm font-semibold text-slate-900">{section.title}</span>
      <span className="mt-2 block text-xs uppercase tracking-[0.18em] text-slate-500">
        hoisted: {open ? 'open' : 'closed'}
      </span>
      {open ? (
        <span className="mt-3 block text-sm leading-6 text-slate-600">
          {section.summary}
        </span>
      ) : null}
    </button>
  );
}

export function ColocatedStateWorkbench() {
  const sections = createSectionCards();
  const [mode, setMode] = useState<ColocationMode>('local');
  const [needsParentSummary, setNeedsParentSummary] = useState(false);
  const [expandedById, setExpandedById] = useState<Record<string, boolean>>({});

  const expandedCount = Object.values(expandedById).filter(Boolean).length;
  const report = buildColocationReport(sections, mode, needsParentSummary, expandedCount);

  const toggleHoisted = (sectionId: string) => {
    setExpandedById((current) => ({
      ...current,
      [sectionId]: !current[sectionId],
    }));
  };

  return (
    <div className="space-y-5">
      <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              colocated state
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              Состояние поднимается только тогда, когда знание действительно нужно выше
            </h3>
          </div>
          <StatusPill tone={report.tone}>{report.summaryLabel}</StatusPill>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {(['local', 'hoisted'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              className={mode === item ? 'chip chip-active' : 'chip'}
            >
              {item}
            </button>
          ))}
          <label className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={needsParentSummary}
              onChange={(event) => setNeedsParentSummary(event.target.checked)}
            />
            Родителю нужен summary
          </label>
          <button type="button" onClick={() => setExpandedById({})} className="chip">
            Сбросить hoisted flags
          </button>
        </div>

        <div className="mt-5 rounded-[24px] bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
          root state slots: {report.rootStateSize}
          <br />
          {needsParentSummary && mode === 'local'
            ? 'Родитель не видит local open-флаги карточек и не может честно собрать общий summary.'
            : report.summary}
        </div>
      </article>

      {mode === 'local' ? (
        <div className="grid gap-3 md:grid-cols-3">
          {sections.map((section) => (
            <LocalSectionCard key={section.id} section={section} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-[22px] border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700 shadow-sm">
            Parent summary: открыто {expandedCount} из {sections.length}
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {sections.map((section) => (
              <HoistedSectionCard
                key={section.id}
                section={section}
                open={Boolean(expandedById[section.id])}
                onToggle={() => toggleHoisted(section.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
