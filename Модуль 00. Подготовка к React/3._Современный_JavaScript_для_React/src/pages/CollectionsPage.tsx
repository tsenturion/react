import { useState } from 'react';

import {
  CodeBlock,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import {
  buildCollectionView,
  collectionLevels,
  collectionTags,
  type CollectionLevel,
} from '../lib/collection-model';
import { formatMinutes } from '../lib/common';
import { projectStudy } from '../lib/project-study';

export function CollectionsPage() {
  const [level, setLevel] = useState<CollectionLevel>('all');
  const [query, setQuery] = useState('');
  const [readyOnly, setReadyOnly] = useState(false);
  const [tag, setTag] = useState('all');

  const view = buildCollectionView({ level, query, readyOnly, tag });

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Lab 3"
        title="map, filter, reduce и переход от структуры данных к интерфейсу"
        copy="Один массив уроков здесь порождает и карточки, и метрики, и breakdown по уровням. Именно так JavaScript-модель данных превращается в React-интерфейс без дублирования источников истины."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">collections</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Все видимые блоки справа строятся из одного массива без ручного хранения
              промежуточного UI-состояния.
            </p>
          </div>
        }
      />

      <Panel className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <label
              className="text-sm font-semibold text-slate-800"
              htmlFor="collection-query"
            >
              Поиск по title, summary и tags
            </label>
            <input
              id="collection-query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400"
              placeholder="например: async"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">Level</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {collectionLevels.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLevel(item)}
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    level === item
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <input
              type="checkbox"
              checked={readyOnly}
              onChange={(event) => setReadyOnly(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
            />
            <span className="text-sm leading-6 text-slate-700">
              Показывать только элементы, готовые к использованию.
            </span>
          </label>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-800">Tag filter</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {['all', ...collectionTags].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTag(item)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  tag === item
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <MetricCard
            label="visible lessons"
            value={String(view.metrics.totalVisible)}
            hint="Это результат filter-цепочки."
          />
          <MetricCard
            label="total duration"
            value={formatMinutes(view.metrics.totalDuration)}
            hint="reduce собирает общую длительность без ручного цикла."
            tone="cool"
          />
          <MetricCard
            label="ready count"
            value={String(view.metrics.readyCount)}
            hint="Булевы значения тоже можно сворачивать в числовую сводку."
            tone="accent"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3">
            {view.visibleLessons.map((lesson) => (
              <article
                key={lesson.id}
                className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                    {lesson.level}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                    {lesson.kind}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">
                  {lesson.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{lesson.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {lesson.tags.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
            {view.visibleLessons.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-600">
                Фильтры дали пустой массив. Это не отдельная ошибка UI: интерфейс честно
                показывает результат той же модели данных.
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <CodeBlock label="collection pipeline" code={view.codePreview} />
            <ListBlock
              title="Breakdown по уровням"
              items={Object.entries(view.levelBreakdown).map(
                ([itemLevel, count]) => `${itemLevel}: ${count}`,
              )}
            />
            <ListBlock
              title="Типичные ошибки"
              items={[
                'Хранить отдельно и исходный массив, и derived-список, который можно вычислить через filter/map/reduce.',
                'Мутировать исходный массив перед рендером, а затем искать, почему другие части интерфейса неожиданно изменились.',
                'Зашивать цифры сводки вручную вместо reduce по тем же данным, которые рендерятся на экран.',
              ]}
            />
          </div>
        </div>
      </Panel>

      <Panel>
        <ProjectStudy
          files={projectStudy.collections.files}
          snippets={projectStudy.collections.snippets}
        />
      </Panel>
    </div>
  );
}
