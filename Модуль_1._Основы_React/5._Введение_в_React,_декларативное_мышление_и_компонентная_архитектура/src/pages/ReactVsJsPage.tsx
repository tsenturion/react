import { useState } from 'react';

import {
  CatalogSummaryPanel,
  CatalogSurface,
} from '../components/catalog/CatalogSurface';
import { ImperativeCatalogPreview } from '../components/imperative/ImperativeCatalogPreview';
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
  type CatalogCategoryFilter,
} from '../lib/catalog-domain';
import { deriveCatalogView } from '../lib/catalog-domain';
import { projectStudy } from '../lib/project-study';
import { compareJsAndReact } from '../lib/react-vs-js-model';

export function ReactVsJsPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CatalogCategoryFilter>('all');
  const [onlyStable, setOnlyStable] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('react-role');

  const view = deriveCatalogView({
    ...defaultCatalogOptions,
    query,
    category,
    onlyStable,
    focusTag: 'dom',
  });

  const effectiveSelectedId =
    view.items.find((item) => item.id === selectedItemId)?.id ??
    view.items[0]?.id ??
    null;
  const comparison = compareJsAndReact(view, effectiveSelectedId);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Plain JS vs React"
        title="Одна и та же задача через DOM API и через React"
        copy="Здесь рядом стоят два варианта одного и того же интерфейса. Слева контейнер пересобирается императивно через обычный JavaScript и DOM API. Справа тот же результат описывается как React-компонент, зависящий от данных и выбранного состояния."
        aside={
          <div className="space-y-3">
            <StatusPill tone={comparison.tone}>
              DOM-операций заметно больше, чем правил рендера
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Меняйте поиск, категорию и выделенную карточку. Оба превью обновятся, но
              цена обновления будет описана по-разному.
            </p>
          </div>
        }
      />

      <Panel className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-800">Поиск</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Например: react"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400"
              />
            </label>

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

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={onlyStable}
                onChange={(event) => setOnlyStable(event.target.checked)}
              />
              Оставить только stable-карточки
            </label>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-800">Выделенная карточка</p>
              <div className="flex flex-wrap gap-2">
                {view.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedItemId(item.id)}
                    className={`chip ${
                      effectiveSelectedId === item.id ? 'chip-active' : ''
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <ImperativeCatalogPreview view={view} selectedId={effectiveSelectedId} />

            <section className="space-y-4 rounded-[24px] border border-blue-200 bg-blue-50/55 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Declarative React preview
                </p>
                <h3 className="mt-2 text-lg font-semibold text-blue-950">React</h3>
                <p className="mt-2 text-sm leading-6 text-blue-900/80">
                  Эта версия не трогает DOM вручную. Она получает `view` и `selectedId`, а
                  затем возвращает новое дерево элементов.
                </p>
              </div>
              <CatalogSummaryPanel view={view} />
              <CatalogSurface view={view} compact highlightedId={effectiveSelectedId} />
            </section>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Оценка DOM-операций"
          value={comparison.domOperationEstimate}
          hint="Сколько отдельных действий описывает обычный JS для актуального состояния."
          tone="accent"
        />
        <MetricCard
          label="React-правил"
          value={comparison.reactRuleCount}
          hint="Сколько базовых шагов описывает то же поведение в React-модели."
          tone="cool"
        />
        <MetricCard
          label="Видимых карточек"
          value={String(view.visibleCount)}
          hint="Обе версии получают один и тот же результат, но разными способами."
          tone="dark"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <ListBlock title="Что делает обычный JS" items={comparison.imperativeLog} />
        </Panel>
        <Panel>
          <ListBlock title="Что делает React-версия" items={comparison.reactLog} />
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <BeforeAfter
            beforeTitle="Ручной DOM"
            before={comparison.before}
            afterTitle="React-рендер"
            after={comparison.after}
          />
        </Panel>
        <Panel>
          <ListBlock title="Где ошибаются чаще всего" items={comparison.risks} />
        </Panel>
      </div>

      <Panel>
        <ProjectStudy
          files={projectStudy.reactVsJs.files}
          snippets={projectStudy.reactVsJs.snippets}
        />
      </Panel>
    </div>
  );
}
