import { useState } from 'react';

import {
  CatalogSummaryPanel,
  CatalogSurface,
} from '../components/catalog/CatalogSurface';
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
  sortModes,
  type CatalogCategoryFilter,
  type SortMode,
} from '../lib/catalog-domain';
import { buildDeclarativeComparison } from '../lib/declarative-model';
import { projectStudy } from '../lib/project-study';

export function DeclarativePage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CatalogCategoryFilter>('all');
  const [onlyStable, setOnlyStable] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('priority');

  const comparison = buildDeclarativeComparison({
    ...defaultCatalogOptions,
    query,
    category,
    onlyStable,
    sortMode,
  });

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Declarative UI"
        title="Один экран: ручные DOM-шаги против описания результата"
        copy="React не отменяет JavaScript, но меняет способ мысли. Вместо списка команд для DOM вы держите состояние фильтров и получаете новый UI как следствие вычисления."
        aside={
          <div className="space-y-3">
            <StatusPill tone={comparison.tone}>
              Риск рассинхрона: {comparison.syncRisk}
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Чем больше ручных веток и синхронизации между summary, списком и empty
              state, тем заметнее выигрывает декларативный подход.
            </p>
          </div>
        }
      />

      <Panel className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-800">
              Поиск по карточкам
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Например: state"
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

          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={onlyStable}
              onChange={(event) => setOnlyStable(event.target.checked)}
            />
            Оставить только stable-карточки
          </label>
        </div>

        <div className="space-y-4">
          <CatalogSummaryPanel view={comparison.view} />
          <CatalogSurface view={comparison.view} compact />
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Оценка DOM-шагов"
          value={comparison.imperativeCount}
          hint="Столько действий приходится держать в голове, если синхронизация описывается вручную."
          tone="accent"
        />
        <MetricCard
          label="Декларативных правил"
          value={comparison.declarativeCount}
          hint="Сколько базовых правил описывает то же поведение через данные и рендер."
          tone="cool"
        />
        <MetricCard
          label="Sync risk"
          value={comparison.syncRisk}
          hint="Чем больше веток поведения, тем легче забыть один из побочных DOM-шагов."
          tone="dark"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <ListBlock title="Императивные шаги" items={comparison.imperativeSteps} />
        </Panel>
        <Panel>
          <ListBlock title="Декларативные правила" items={comparison.declarativeRules} />
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <BeforeAfter
            beforeTitle="Пошаговое управление DOM"
            before={comparison.before}
            afterTitle="UI как следствие состояния"
            after={comparison.after}
          />
        </Panel>
        <Panel>
          <ListBlock title="Типичные ошибки" items={comparison.mistakes} />
        </Panel>
      </div>

      <Panel>
        <ProjectStudy
          files={projectStudy.declarative.files}
          snippets={projectStudy.declarative.snippets}
        />
      </Panel>
    </div>
  );
}
