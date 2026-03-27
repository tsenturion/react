import { StrategyCompareLab } from '../components/context-reducer/StrategyCompareLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function StrategyPage() {
  const study = projectStudies.strategy;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Когда хватит lifting state up, а когда уже нужен Context + Reducer"
        copy="Не каждая shared задача требует provider, и не каждый reducer должен сопровождаться context. Архитектура зависит от глубины дерева, удалённости потребителей, сложности transitions и ширины общей области. Эта лаборатория помогает увидеть, где заканчивается нормальный props flow и где появляется реальная польза от context и reducer."
      />

      <Panel>
        <StrategyCompareLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Сначала спросите"
          value="Who needs it?"
          hint="Количество и расположение потребителей определяют delivery strategy."
          tone="cool"
        />
        <MetricCard
          label="Потом спросите"
          value="How complex?"
          hint="Сложность переходов определяет, нужен ли reducer или хватит простого setState."
        />
        <MetricCard
          label="И только потом"
          value="Where provider?"
          hint="Provider — это не автоматический ответ, а граница конкретной общей секции."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
