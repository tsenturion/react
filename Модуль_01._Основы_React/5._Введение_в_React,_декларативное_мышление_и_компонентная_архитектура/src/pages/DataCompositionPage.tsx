import { useState } from 'react';

import {
  CatalogSummaryPanel,
  CatalogSurface,
} from '../components/catalog/CatalogSurface';
import { WorkbenchLayout } from '../components/composition/WorkbenchLayout';
import {
  BeforeAfter,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import {
  categoryFilters,
  defaultCatalogOptions,
  focusTagOptions,
  sortModes,
  type CatalogCategoryFilter,
  type CatalogFocusTag,
  type SortMode,
} from '../lib/catalog-domain';
import {
  compositionLayouts,
  describeCompositionScenario,
  type CompositionLayout,
} from '../lib/data-composition-model';
import { projectStudy } from '../lib/project-study';

export function DataCompositionPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CatalogCategoryFilter>('all');
  const [sortMode, setSortMode] = useState<SortMode>('priority');
  const [focusTag, setFocusTag] = useState<CatalogFocusTag>('composition');
  const [onlyStable, setOnlyStable] = useState(false);
  const [showSummary, setShowSummary] = useState(true);
  const [showAside, setShowAside] = useState(true);
  const [compact, setCompact] = useState(false);
  const [layoutMode, setLayoutMode] = useState<CompositionLayout>('split');

  const scenario = describeCompositionScenario({
    ...defaultCatalogOptions,
    query,
    category,
    sortMode,
    focusTag,
    onlyStable,
    layoutMode,
    showSummary,
    showAside,
  });

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Data + State + Composition"
        title="Когда экран собирается из частей, а не из DOM-шагов"
        copy="В React интерфейс удобно строить не как длинную последовательность команд, а как композицию блоков: header, toolbar, summary, main и aside. Данные и состояние определяют, какие ветки дерева сейчас есть и что именно они показывают."
        aside={
          <div className="space-y-3">
            <StatusPill tone={scenario.tone}>
              {scenario.tone === 'success'
                ? 'Композиция выглядит целостно'
                : 'Композиция упрощена, но всё ещё рабочая'}
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">{scenario.layoutLabel}</p>
          </div>
        }
      />

      <Panel className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-800">Поиск</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Например: component"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
            />
          </label>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-800">Layout</p>
            <div className="flex flex-wrap gap-2">
              {compositionLayouts.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLayoutMode(item.id)}
                  className={`chip ${layoutMode === item.id ? 'chip-active' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-800">Категория</p>
            <div className="flex flex-wrap gap-2">
              {categoryFilters.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(item.id)}
                  className={`chip ${category === item.id ? 'chip-active' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-800">Фокус темы</p>
            <div className="flex flex-wrap gap-2">
              {focusTagOptions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFocusTag(item.id)}
                  className={`chip ${focusTag === item.id ? 'chip-active' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-800">Сортировка</p>
            <div className="flex flex-wrap gap-2">
              {sortModes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSortMode(item.id)}
                  className={`chip ${sortMode === item.id ? 'chip-active' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={onlyStable}
                onChange={(event) => setOnlyStable(event.target.checked)}
              />
              Только stable
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={showSummary}
                onChange={(event) => setShowSummary(event.target.checked)}
              />
              Показывать summary
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={showAside}
                onChange={(event) => setShowAside(event.target.checked)}
              />
              Показывать aside
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={compact}
                onChange={(event) => setCompact(event.target.checked)}
              />
              Compact cards
            </label>
          </div>
        </div>
      </Panel>

      <WorkbenchLayout
        layoutMode={layoutMode}
        header={
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Header slot
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">
              Workbench, собранный через композицию
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Здесь layout получает готовые части экрана как props и не знает их
              внутренней бизнес-логики.
            </p>
          </div>
        }
        toolbar={
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Toolbar slot
            </p>
            <p className="text-sm leading-6 text-slate-600">
              Видимые блоки: {scenario.visibleBlocks.join(' → ')}
            </p>
            <p className="text-sm leading-6 text-slate-600">{scenario.layoutLabel}</p>
          </div>
        }
        summary={showSummary ? <CatalogSummaryPanel view={scenario.view} /> : null}
        main={
          <CatalogSurface
            view={scenario.view}
            compact={compact}
            highlightedId={scenario.view.items[0]?.id ?? null}
          />
        }
        aside={
          showAside ? (
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Aside slot
              </p>
              <ul className="space-y-2 text-sm leading-6 text-slate-600">
                {scenario.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          ) : null
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Видимых блоков"
          value={String(scenario.visibleBlocks.length)}
          hint="Сколько частей экрана реально участвует в текущей композиции."
          tone="accent"
        />
        <MetricCard
          label="Зависимостей частей"
          value={String(scenario.dependencies.length)}
          hint="Каждая часть знает только свой набор входных данных."
          tone="cool"
        />
        <MetricCard
          label="Карточек в main"
          value={String(scenario.view.visibleCount)}
          hint="Главный контент остаётся следствием `view`, а не ручного DOM-патча."
          tone="dark"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <ListBlock
            title="Кто от чего зависит"
            items={scenario.dependencies.map(
              (item) => `${item.part} ← ${item.dependsOn.join(', ')}. ${item.note}`,
            )}
          />
        </Panel>
        <Panel>
          <BeforeAfter
            beforeTitle="Ручная сборка экрана"
            before={scenario.before}
            afterTitle="Композиция через React"
            after={scenario.after}
          />
        </Panel>
      </div>

      <Panel>
        <ProjectStudy
          files={projectStudy.composition.files}
          snippets={projectStudy.composition.snippets}
        />
      </Panel>
    </div>
  );
}
