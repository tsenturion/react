import { useLocation, useSearchParams } from 'react-router-dom';

import { SearchParamsPlayground } from '../components/routing-state/SearchParamsPlayground';
import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { routingModules } from '../lib/routing-domain';
import { projectStudyByLab } from '../lib/project-study';
import { getCatalogItems, resolveCatalogSearchState } from '../lib/url-state-model';

export function SearchParamsPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const state = resolveCatalogSearchState(searchParams);
  const items = getCatalogItems(routingModules, state);
  const queryCount = Array.from(searchParams.keys()).length;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Search Params"
        title="Фильтры и сортировка становятся устойчивым состоянием, когда живут в query string"
        copy="Если screen mode должен переживать refresh, copy link и переходы по history, его удобнее держать в search params, а не дублировать в локальном состоянии."
        aside={<StatusPill tone="success">query keys: {queryCount}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Current view"
          value={state.view}
          hint="Один и тот же screen route может менять режим отображения через URL."
        />
        <MetricCard
          label="Visible rows"
          value={String(items.length)}
          hint="Результат сразу меняется после записи query string."
          tone="accent"
        />
        <MetricCard
          label="Current query"
          value={location.search || '?level=all&sort=popular&view=cards'}
          hint="Адрес становится ссылкой на конкретную конфигурацию экрана."
          tone="cool"
        />
      </div>

      <SearchParamsPlayground />

      <BeforeAfter
        beforeTitle="Дублирование в local state"
        before="Когда filter и sort живут только в `useState`, refresh теряет конфигурацию, а ссылкой на текущий режим экрана нельзя поделиться."
        afterTitle="Query string как источник режима"
        after="Если screen mode действительно важен для reload и deep link, `useSearchParams` делает его устойчивой частью адреса."
      />

      <Panel>
        <ProjectStudy {...projectStudyByLab.search} />
      </Panel>
    </div>
  );
}
