import { useParams, useSearchParams } from 'react-router-dom';

import { EntityUrlWorkbench } from '../components/routing-state/EntityUrlWorkbench';
import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { findRoutingModule } from '../lib/routing-domain';
import { projectStudyByLab } from '../lib/project-study';
import { resolveEntityUrlState } from '../lib/url-state-model';

export function EntitySelectionPage() {
  const { entityId } = useParams();
  const [searchParams] = useSearchParams();
  const entity = findRoutingModule(entityId ?? '');
  const state = resolveEntityUrlState(searchParams);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Path Param + Query"
        title="Path хранит выбранную сущность, query string уточняет режим её просмотра"
        copy="Так адрес остаётся читаемым: path отвечает за identity экрана, а query string дописывает tab, panel и другие устойчивые режимы внутри него."
        aside={
          <StatusPill tone={entity ? 'success' : 'error'}>
            entity: {entity?.id ?? 'not-found'}
          </StatusPill>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Current entity"
          value={entity?.id ?? 'unknown'}
          hint="Выбранная сущность чаще всего заслуживает path param, а не local state."
        />
        <MetricCard
          label="Active tab"
          value={state.tab}
          hint="Режим внутри экрана можно уточнять через query string."
          tone="accent"
        />
        <MetricCard
          label="Panel mode"
          value={state.panel}
          hint="Path и search params работают вместе, а не конкурируют друг с другом."
          tone="cool"
        />
      </div>

      <EntityUrlWorkbench />

      <BeforeAfter
        beforeTitle="Entity только в local state"
        before="Если выбранная сущность не закодирована в адресе, refresh и deep link теряют самую важную часть контекста экрана."
        afterTitle="Identity в path, mode в query"
        after="Path отвечает за сам объект экрана, а query string уточняет конкретный режим просмотра без разрастания route tree."
      />

      <Panel>
        <ProjectStudy {...projectStudyByLab.entities} />
      </Panel>
    </div>
  );
}
