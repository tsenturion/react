import { StateOwnerAdvisor } from '../components/shared-state/StateOwnerAdvisor';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildOwnerDecision } from '../lib/owner-model';
import { createOwnerScenario } from '../lib/shared-state-domain';
import { getProjectStudy } from '../lib/project-study';

export function OwnerPage() {
  const decision = buildOwnerDecision(createOwnerScenario());
  const study = getProjectStudy('owner');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Как определить владельца состояния"
        copy="Поднимать состояние вверх нужно не “на всякий случай”, а до того уровня, который действительно объединяет его потребителей. Здесь можно прогонять сценарии и видеть, когда нужен local state, shared parent или более высокий layout owner."
      />

      <div className="space-y-6">
        <div className="grid gap-3 md:grid-cols-3">
          <MetricCard
            label="Recommended owner"
            value={decision.target}
            hint={decision.reason}
            tone="cool"
          />
          <MetricCard
            label="Focus"
            value="real consumers"
            hint="Владелец определяется тем, кто действительно читает и меняет это состояние."
          />
          <MetricCard
            label="Risk"
            value="over-hoisting"
            hint="Слишком высокий owner усиливает prop drilling и раздувает общий state."
            tone="accent"
          />
        </div>

        <StateOwnerAdvisor />
        <CodeBlock label="Owner decision model" code={decision.snippet} />
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
