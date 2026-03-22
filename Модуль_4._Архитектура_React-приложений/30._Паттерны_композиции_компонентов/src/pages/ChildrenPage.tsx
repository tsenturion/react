import { ChildrenCloneLab } from '../components/composition-patterns/ChildrenCloneLab';
import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function ChildrenPage() {
  const study = projectStudies.children;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="cloneElement и Children API"
        copy="Children API и cloneElement позволяют root-компоненту пройтись по прямым детям и добавить им общий API. В узких случаях это удобно, но паттерн быстро становится хрупким, если структура children перестаёт быть полностью предсказуемой."
      />

      <Panel>
        <ChildrenCloneLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Когда помогает"
          value="Direct children"
          hint="Root полностью контролирует прямых детей и знает их точный контракт."
          tone="cool"
        />
        <MetricCard
          label="Что даёт"
          value="Injected API"
          hint="Можно навесить active state, size и handlers без ручной прокладки пропсов по каждому child."
        />
        <MetricCard
          label="Где ломается"
          value="Wrapped child"
          hint="Одна лишняя обёртка уже показывает, насколько паттерн зависит от структуры дерева."
          tone="accent"
        />
      </div>

      <Panel>
        <BeforeAfter
          beforeTitle="Если children API использовать без жёстких границ"
          before="API зависит от скрытого знания о том, какие элементы должны лежать прямо под root и какие props они обязаны понимать."
          afterTitle="Если применять его только точечно"
          after="cloneElement остаётся узким инструментом для прямых детей, а более общие сценарии уходят в slots, config arrays или compound components."
        />
      </Panel>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
