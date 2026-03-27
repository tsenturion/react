import { WorkspaceArchitectureLab } from '../components/context-reducer/WorkspaceArchitectureLab';
import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function WorkspaceArchitecturePage() {
  const study = projectStudies.architecture;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="Context + Reducer: delivery и update logic в одной архитектуре"
        copy="Когда данные нужны далёким веткам дерева, а переходы уже состоят из множества действий, context и reducer начинают работать как одна система. Context доставляет `state` и `dispatch`, а reducer удерживает transitions в одном месте. Вместе они образуют понятный shared scope, но только внутри разумной границы provider."
      />

      <Panel>
        <WorkspaceArchitectureLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Context отвечает за"
          value="Delivery"
          hint="State и dispatch доходят до toolbar, list и inspector без prop drilling."
          tone="cool"
        />
        <MetricCard
          label="Reducer отвечает за"
          value="Transitions"
          hint="Все actions и переходы читаются в одном месте, а не размазываются по дереву."
        />
        <MetricCard
          label="Вместе дают"
          value="Shared scope"
          hint="Одна секция получает общий state model без превращения всего приложения в мегастор."
          tone="accent"
        />
      </div>

      <Panel>
        <BeforeAfter
          beforeTitle="Если просто поднять всё выше"
          before="Верхний владелец быстро захлебнётся в callbacks, промежуточные уровни начнут тащить чужой API, а logic слой окажется размазанным."
          afterTitle="Если разделить Context и Reducer"
          after="Provider задаёт зону доставки, reducer держит сложные переходы в одном месте, а компоненты читаются как роли внутри одной секции."
        />
      </Panel>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
