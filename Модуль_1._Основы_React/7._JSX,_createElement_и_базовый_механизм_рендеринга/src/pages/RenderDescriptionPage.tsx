import { useState } from 'react';

import { ElementTreeView } from '../components/rendering/ElementTreeView';
import { LessonCatalogSurface } from '../components/rendering/LessonCatalogSurface';
import {
  CodeBlock,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import {
  buildRenderSnippet,
  buildRenderSurface,
  defaultCatalogState,
  type CatalogLayout,
  type CatalogLevel,
  type CatalogSort,
  type CatalogState,
} from '../lib/render-description-model';
import { buildLessonCatalogElement } from '../lib/lesson-catalog-element';
import { getProjectStudy } from '../lib/project-study';

export function RenderDescriptionPage() {
  const [state, setState] = useState<CatalogState>(defaultCatalogState);
  const surface = buildRenderSurface(state);
  const study = getProjectStudy('render-description');
  const previewElement = buildLessonCatalogElement(surface);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Как данные меняют описание интерфейса"
        copy="Когда меняется поиск, фильтр или layout, React не переписывает экран вручную по шагам. Сначала формируется новое описание интерфейса из новых данных, а уже потом reconciler решает, как обновить DOM."
      />

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <Panel className="space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">Входные данные</h2>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Поиск</span>
            <input
              value={state.query}
              onChange={(event) =>
                setState((current) => ({ ...current, query: event.target.value }))
              }
              placeholder="Например, fragment"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            />
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Уровень</span>
            <select
              value={state.level}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  level: event.target.value as CatalogLevel,
                }))
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            >
              {['all', 'base', 'advanced'].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Сортировка</span>
            <select
              value={state.sort}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  sort: event.target.value as CatalogSort,
                }))
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            >
              {['title', 'duration', 'price'].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-700">
            <span className="font-medium">Layout</span>
            <select
              value={state.layout}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  layout: event.target.value as CatalogLayout,
                }))
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3"
            >
              {['grid', 'list'].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <span className="font-medium">Только доступные</span>
            <input
              type="checkbox"
              checked={state.availableOnly}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  availableOnly: event.target.checked,
                }))
              }
            />
          </label>
        </Panel>

        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="Visible cards"
              value={String(surface.lessons.length)}
              hint="Сколько элементов осталось после фильтрации и сортировки."
              tone="cool"
            />
            <MetricCard
              label="Removed"
              value={String(surface.removedCount)}
              hint="Сколько карточек исчезло из описания интерфейса."
            />
            <MetricCard
              label="Root type"
              value={surface.rootType}
              hint="Grid и list создают разную корневую структуру React elements."
              tone="accent"
            />
          </div>

          <Panel className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Preview</h2>
            <p className="text-sm leading-6 text-slate-600">{surface.summary}</p>
            <LessonCatalogSurface surface={surface} />
          </Panel>

          <div className="grid gap-4 xl:grid-cols-2">
            <CodeBlock label="Текущий JSX mapping" code={buildRenderSnippet(surface)} />
            <Panel>
              <ListBlock
                title="Как это связано с virtual DOM"
                items={[
                  'Сначала меняется массив `lessons` после фильтров и сортировки.',
                  'Затем JSX описывает уже новый набор узлов через `map(...)`.',
                  'Только после этого React сравнивает новое описание с предыдущим и обновляет DOM.',
                ]}
              />
            </Panel>
          </div>

          <Panel className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Element tree до DOM</h2>
            <ElementTreeView label="Catalog render tree" element={previewElement} />
          </Panel>
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
