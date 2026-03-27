import { StateStrategyPlaybookLab } from '../components/state-identity/StateStrategyPlaybookLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { getProjectStudy } from '../lib/project-study';
import { buildStateStrategyReport } from '../lib/strategy-playbook-model';

export function StateStrategyPage() {
  const preserve = buildStateStrategyReport('preserve', 'switch-entity');
  const reset = buildStateStrategyReport('reset', 'switch-entity');
  const listRule = buildStateStrategyReport('preserve', 'reorder-list');
  const study = getProjectStudy('strategy');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Как осознанно управлять сохранением и сбросом state"
        copy="Архитектура identity редко определяется одной кнопкой. Здесь можно быстро проверить, какой паттерн нужен в зависимости от цели: сохранить черновики, очистить форму, пережить reorder или оставить widget живым при смене layout."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Preserve entity"
          value="map by id"
          hint={preserve.technique}
          tone="cool"
        />
        <MetricCard label="Reset entity" value="key boundary" hint={reset.technique} />
        <MetricCard
          label="Lists"
          value="stable ids"
          hint={listRule.technique}
          tone="accent"
        />
      </div>

      <StateStrategyPlaybookLab />

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
