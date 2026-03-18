import clsx from 'clsx';

import type { CatalogItem, CatalogView } from '../../lib/catalog-domain';
import { StatusPill } from '../ui';

type CatalogSurfaceProps = {
  view: CatalogView;
  compact?: boolean;
  highlightedId?: string | null;
  showCategoryHeadings?: boolean;
};

// Тема урока — компоненты и дерево UI, поэтому даже небольшой preview здесь
// намеренно разбит на summary, section и card вместо одного большого JSX-блока.
export function CatalogSurface({
  view,
  compact = false,
  highlightedId = null,
  showCategoryHeadings = true,
}: CatalogSurfaceProps) {
  if (view.visibleCount === 0) {
    return (
      <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6">
        <h3 className="text-lg font-semibold text-slate-900">{view.emptyTitle}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{view.emptyCopy}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {view.sections.map((section) => (
        <CatalogSection
          key={section.category}
          category={showCategoryHeadings ? section.category : null}
          items={section.items}
          compact={compact}
          highlightedId={highlightedId}
          focusTag={view.focusTag}
        />
      ))}
    </div>
  );
}

export function CatalogSummaryPanel({ view }: { view: CatalogView }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <SummaryCard
        label="Видимых карточек"
        value={String(view.visibleCount)}
        hint="Это производный результат фильтров и сортировки."
      />
      <SummaryCard
        label="Готовых блоков"
        value={String(view.stableVisibleCount)}
        hint="Статус не дублируется отдельным summary-state."
      />
      <SummaryCard
        label="Активных фильтров"
        value={String(view.activeFilters.length)}
        hint={
          view.activeFilters.length > 0
            ? view.activeFilters.join(' • ')
            : 'Сейчас список строится без дополнительных ограничений.'
        }
      />
    </div>
  );
}

export function FeaturedCatalogStrip({
  items,
  focusTag = 'all',
}: {
  items: readonly CatalogItem[];
  focusTag?: CatalogView['focusTag'];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <CatalogCard
          key={item.id}
          item={item}
          compact={false}
          highlighted={false}
          emphasized={focusTag !== 'all' && item.tags.includes(focusTag)}
        />
      ))}
    </div>
  );
}

function CatalogSection({
  category,
  items,
  compact,
  highlightedId,
  focusTag,
}: {
  category: string | null;
  items: CatalogItem[];
  compact: boolean;
  highlightedId: string | null;
  focusTag: CatalogView['focusTag'];
}) {
  return (
    <section className="space-y-3">
      {category ? (
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">{category}</h3>
          <span className="text-xs uppercase tracking-[0.18em] text-slate-500">
            {items.length} карточек
          </span>
        </div>
      ) : null}

      <div className={clsx('grid gap-4', compact ? 'md:grid-cols-2' : 'xl:grid-cols-2')}>
        {items.map((item) => (
          <CatalogCard
            key={item.id}
            item={item}
            compact={compact}
            highlighted={item.id === highlightedId}
            emphasized={focusTag !== 'all' && item.tags.includes(focusTag)}
          />
        ))}
      </div>
    </section>
  );
}

function CatalogCard({
  item,
  compact,
  highlighted,
  emphasized,
}: {
  item: CatalogItem;
  compact: boolean;
  highlighted: boolean;
  emphasized: boolean;
}) {
  return (
    <article
      className={clsx(
        'rounded-[24px] border bg-white p-4 shadow-sm transition',
        highlighted
          ? 'border-blue-500 bg-blue-50/60 shadow-md'
          : emphasized
            ? 'border-teal-300 bg-teal-50/70'
            : 'border-slate-200',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {item.category}
          </p>
          <h4
            className={clsx(
              'mt-2 font-semibold text-slate-950',
              compact ? 'text-base' : 'text-lg',
            )}
          >
            {item.title}
          </h4>
        </div>
        <StatusPill tone={item.stable ? 'success' : 'warn'}>
          {item.stable ? 'stable' : 'draft'}
        </StatusPill>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600">{item.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className={clsx(
              'rounded-full px-3 py-1 text-xs font-semibold',
              emphasized && item.tags.includes(tag)
                ? 'bg-teal-100 text-teal-700'
                : 'bg-slate-100 text-slate-600',
            )}
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

function SummaryCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{hint}</p>
    </div>
  );
}
