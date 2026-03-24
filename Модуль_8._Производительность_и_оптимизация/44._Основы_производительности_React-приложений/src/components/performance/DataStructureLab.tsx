import { useState } from 'react';

import {
  buildCatalogIndex,
  createCatalog,
  projectIndexed,
  projectNested,
  sizePresetConfig,
  type CatalogFilters,
  type Level,
  type SizePreset,
  type SortMode,
  type Track,
} from '../../lib/data-structure-model';
import { MetricCard, StatusPill } from '../ui';

const catalogByPreset = {
  small: createCatalog(
    sizePresetConfig.small.sections,
    sizePresetConfig.small.lessonsPerSection,
  ),
  medium: createCatalog(
    sizePresetConfig.medium.sections,
    sizePresetConfig.medium.lessonsPerSection,
  ),
  large: createCatalog(
    sizePresetConfig.large.sections,
    sizePresetConfig.large.lessonsPerSection,
  ),
} as const;

const indexByPreset = {
  small: buildCatalogIndex(catalogByPreset.small),
  medium: buildCatalogIndex(catalogByPreset.medium),
  large: buildCatalogIndex(catalogByPreset.large),
} as const;

function measureProjection<T>(run: () => T) {
  const startedAt = performance.now();
  const value = run();
  const elapsedMs = performance.now() - startedAt;

  return { value, elapsedMs };
}

export function DataStructureLab() {
  const [size, setSize] = useState<SizePreset>('medium');
  const [query, setQuery] = useState('react');
  const [track, setTrack] = useState<Track | 'all'>('all');
  const [level, setLevel] = useState<Level | 'all'>('all');
  const [sort, setSort] = useState<SortMode>('title');
  const [note, setNote] = useState(
    'Эта заметка не меняет данные, но всё равно вызывает новый render страницы.',
  );

  const filters: CatalogFilters = {
    query,
    track,
    level,
    sort,
  };

  const nested = measureProjection(() => projectNested(catalogByPreset[size], filters));
  const indexed = measureProjection(() => projectIndexed(indexByPreset[size], filters));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Параметры
          </p>

          <div className="mt-4 space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Размер каталога</span>
              <select
                value={size}
                onChange={(event) => setSize(event.target.value as SizePreset)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Поиск</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-3">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Track</span>
                <select
                  value={track}
                  onChange={(event) => setTrack(event.target.value as Track | 'all')}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
                >
                  <option value="all">All</option>
                  <option value="ui">UI</option>
                  <option value="data">Data</option>
                  <option value="tests">Tests</option>
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Level</span>
                <select
                  value={level}
                  onChange={(event) => setLevel(event.target.value as Level | 'all')}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
                >
                  <option value="all">All</option>
                  <option value="intro">Intro</option>
                  <option value="practice">Practice</option>
                  <option value="deep">Deep</option>
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Sort</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortMode)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
                >
                  <option value="title">Title</option>
                  <option value="duration">Duration</option>
                </select>
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">
                Независимая заметка страницы
              </span>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-blue-400"
              />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              label="Nested operations"
              value={`${nested.value.operations}`}
              hint="Сколько условных шагов тратит nested traversal."
              tone="accent"
            />
            <MetricCard
              label="Indexed operations"
              value={`${indexed.value.operations}`}
              hint="Индекс не спасает от всех рендеров, но делает каждый из них дешевле."
              tone="cool"
            />
            <MetricCard
              label="Почему это важно"
              value="same UI, different work"
              hint="Интерфейс выглядит одинаково, но объём вычислений отличается уже на уровне shape данных."
              tone="dark"
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                    Nested projection
                  </p>
                  <p className="mt-2 text-sm leading-6 text-rose-900">
                    Полный обход секций и уроков на каждый рендер.
                  </p>
                </div>
                <StatusPill tone="warn">{nested.elapsedMs.toFixed(2)} ms</StatusPill>
              </div>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-rose-950">
                {nested.value.sampleTitles.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-rose-200 bg-white px-3 py-2"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-6 text-rose-900">
                Visible lessons: <strong>{nested.value.visibleCount}</strong>. Total
                minutes: <strong>{nested.value.totalMinutes}</strong>.
              </p>
            </div>

            <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Indexed projection
                  </p>
                  <p className="mt-2 text-sm leading-6 text-emerald-900">
                    Более узкий candidate set и меньше работы до сортировки.
                  </p>
                </div>
                <StatusPill tone="success">{indexed.elapsedMs.toFixed(2)} ms</StatusPill>
              </div>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-emerald-950">
                {indexed.value.sampleTitles.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-emerald-200 bg-white px-3 py-2"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-6 text-emerald-900">
                Visible lessons: <strong>{indexed.value.visibleCount}</strong>. Total
                minutes: <strong>{indexed.value.totalMinutes}</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
