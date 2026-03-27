import { useSearchParams } from 'react-router-dom';

import { UrlStateWorkbench } from '../components/routing-state/UrlStateWorkbench';
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
import { getWorkspaceRows, resolveWorkspaceUrlState } from '../lib/url-state-model';

export function UrlStatePage() {
  const [searchParams] = useSearchParams();
  const state = resolveWorkspaceUrlState(searchParams);
  const rows = getWorkspaceRows(routingModules, state);

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="URL As State"
        title="Один и тот же path может описывать много устойчивых состояний экрана"
        copy="URL as state особенно полезен там, где tab, status и sort задают повторяемую конфигурацию экрана, к которой нужно возвращаться через refresh и browser history."
        aside={<StatusPill tone="success">tab: {state.tab}</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Status filter"
          value={state.status}
          hint="Query string может хранить фильтр без отдельной зеркальной копии в local state."
        />
        <MetricCard
          label="Visible modules"
          value={String(rows.length)}
          hint="Состояние URL сразу определяет, какие карточки видны на экране."
          tone="accent"
        />
        <MetricCard
          label="Sort mode"
          value={state.sort}
          hint="Один screen route меняет режимы, но остаётся той же страницей."
          tone="cool"
        />
      </div>

      <UrlStateWorkbench />

      <BeforeAfter
        beforeTitle="Каждый режим прячется в local state"
        before="Когда screen mode нельзя восстановить из URL, back/forward и copy link перестают совпадать с ожиданиями пользователя."
        afterTitle="URL описывает устойчивое состояние экрана"
        after="Если tab, status и sort важны для сценария, их полезно кодировать в адресе и получать прямо из search params."
      />

      <Panel>
        <ProjectStudy {...projectStudyByLab['url-state']} />
      </Panel>
    </div>
  );
}
