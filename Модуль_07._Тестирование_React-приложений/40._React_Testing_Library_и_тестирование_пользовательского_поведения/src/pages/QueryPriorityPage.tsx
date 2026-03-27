import {
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { QueryPriorityWorkbench } from '../components/testing-library/QueryPriorityWorkbench';
import { projectStudyByLab } from '../lib/project-study';

export function QueryPriorityPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Query Priority"
        title="Правильный query начинается с доступной поверхности UI"
        copy="Сначала ищите роль, имя и label. Только если у элемента нет собственной доступной поверхности, опускайтесь ниже по приоритету."
        aside={<StatusPill tone="success">roles first</StatusPill>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Main rule"
          value="role > label > text"
          hint="Порядок поиска должен следовать за тем, как интерфейс читается человеком и assistive tech."
        />
        <MetricCard
          label="What to avoid"
          value="className hooks"
          hint="Селектор по className чаще отражает оформление, а не пользовательский контракт."
          tone="accent"
        />
        <MetricCard
          label="Result"
          value="устойчивые тесты"
          hint="Чем ближе query к доступной поверхности, тем меньше тест зависит от случайной реализации."
          tone="cool"
        />
      </div>

      <QueryPriorityWorkbench />

      <Panel>
        <ProjectStudy {...projectStudyByLab.queries} />
      </Panel>
    </div>
  );
}
