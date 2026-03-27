import clsx from 'clsx';

import type {
  BoundaryGroup,
  BoundaryPart,
  BoundaryTone,
} from '../../lib/component-architecture-model';

const toneClasses: Record<BoundaryTone, string> = {
  default: 'border-slate-300 bg-slate-100 text-slate-800',
  accent: 'border-orange-300 bg-orange-100 text-orange-900',
  cool: 'border-teal-300 bg-teal-100 text-teal-900',
  dark: 'border-slate-800 bg-slate-950 text-white',
};

const areaClasses: Record<BoundaryPart['area'], string> = {
  header: 'md:col-span-3',
  controls: 'md:col-span-2',
  summary: 'md:col-span-1',
  'content-wide': 'md:col-span-2',
  'content-narrow': 'md:col-span-1',
  aside: 'md:col-span-1',
};

export function BoundaryMap({
  parts,
  groups,
}: {
  parts: readonly BoundaryPart[];
  groups: readonly BoundaryGroup[];
}) {
  const groupMap = Object.fromEntries(groups.map((group) => [group.id, group]));

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        {groups.map((group) => (
          <div
            key={group.id}
            className={clsx('rounded-[24px] border p-4', toneClasses[group.tone])}
          >
            <p className="text-sm font-semibold">{group.label}</p>
            <p className="mt-2 text-sm leading-6 opacity-90">{group.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {parts.map((part) => {
          const group = groupMap[part.groupId];

          return (
            <article
              key={part.id}
              className={clsx(
                'rounded-[24px] border p-4 shadow-sm',
                areaClasses[part.area],
                group ? toneClasses[group.tone] : toneClasses.default,
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-75">
                {group?.label ?? 'Ungrouped'}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{part.label}</h3>
              <p className="mt-2 text-sm leading-6 opacity-90">{part.description}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
