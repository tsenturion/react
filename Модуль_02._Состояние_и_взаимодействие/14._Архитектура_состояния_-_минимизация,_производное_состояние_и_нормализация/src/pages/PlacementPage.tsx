import { StatePlacementAdvisor } from '../components/state-architecture/StatePlacementAdvisor';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { getProjectStudy } from '../lib/project-study';

export function PlacementPage() {
  const study = getProjectStudy('placement');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Где хранить состояние"
        copy="Вопрос “куда положить state” на самом деле означает “кто его настоящий владелец”. Ответ зависит от того, derived это значение или source of truth, нужно ли оно siblings, живёт ли оно только в leaf-компоненте и дублируется ли сущность в нескольких ветках."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Derived"
          value="do not store"
          hint="Если значение полностью выводится из другого state, отдельное поле только увеличит риск drift."
          tone="cool"
        />
        <MetricCard
          label="Leaf-only"
          value="local"
          hint="Leaf-компонент остаётся владельцем, пока знание не нужно соседям."
        />
        <MetricCard
          label="Shared entity"
          value="normalize"
          hint="Если одна сущность копируется в нескольких ветках, архитектура выигрывает от ids и entity maps."
          tone="accent"
        />
      </div>

      <StatePlacementAdvisor />

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
