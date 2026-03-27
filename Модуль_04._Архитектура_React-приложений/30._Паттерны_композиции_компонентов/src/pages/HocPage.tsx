import { HocLab } from '../components/composition-patterns/HocLab';
import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function HocPage() {
  const study = projectStudies.hoc;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="Higher-order components"
        copy="HOC — это wrapper-подход, в котором один компонент оборачивает другой и добавляет ему данные или поведение. Сегодня этот паттерн чаще встречается в legacy-коде, adapter-слоях и framework integration, а не как первый выбор для новых feature-компонентов."
      />

      <Panel>
        <HocLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Когда помогает"
          value="Wrapper layer"
          hint="Нужно навесить один и тот же cross-cutting слой на несколько старых base-компонентов."
          tone="cool"
        />
        <MetricCard
          label="Что даёт"
          value="Cross-cutting reuse"
          hint="Общий status, theme adapter или analytics wrapper можно вынести в единый слой."
        />
        <MetricCard
          label="Где ломается"
          value="Wrapper nesting"
          hint="С ростом слоёв становится трудно понять, откуда пришли props и где искать источник поведения."
          tone="accent"
        />
      </div>

      <Panel>
        <BeforeAfter
          beforeTitle="Если HOC использовать как default"
          before="Поведение прячется во wrapper-цепочке, displayName и типы усложняются, а источник injected props становится менее очевидным."
          afterTitle="Если HOC оставить для точечных случаев"
          after="Паттерн остаётся adapter-инструментом для legacy и integration-задач, а новый код продолжает жить на hooks и явной композиции."
        />
      </Panel>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
