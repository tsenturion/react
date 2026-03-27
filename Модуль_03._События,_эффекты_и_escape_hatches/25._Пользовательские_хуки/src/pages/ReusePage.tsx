import { ReuseIsolationLab } from '../components/custom-hooks/ReuseIsolationLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function ReusePage() {
  const study = projectStudies.reuse;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="Переиспользование и изоляция"
        copy="Один и тот же custom hook можно вызывать в нескольких ветках дерева, и каждая ветка получит своё собственное состояние. Это важно увидеть живьём: reusable logic не означает shared state."
      />

      <Panel>
        <ReuseIsolationLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Reuse"
          value="Да"
          hint="Поведение не копируется вручную между карточками."
          tone="cool"
        />
        <MetricCard
          label="Shared state"
          value="Нет"
          hint="Каждый вызов hook-а привязан к позиции конкретного компонента в дереве."
        />
        <MetricCard
          label="Граница"
          value="UI-поведение"
          hint="Hook инкапсулирует toggle/open/close, а не разбрасывает логику по карточке."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
