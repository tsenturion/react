import { UnidirectionalFlowLab } from '../components/redux-architecture/UnidirectionalFlowLab';
import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function FlowPage() {
  const study = projectStudies.flow;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="Однонаправленный поток данных на уровне приложения"
        copy="Redux нужен не ради store как объекта, а ради дисциплины: пользовательское действие проходит один и тот же маршрут, и разные ветки интерфейса получают следующее состояние через общий reducer tree. Именно это снижает число скрытых связей и делает поведение экрана объяснимым."
      />

      <Panel>
        <UnidirectionalFlowLab />
      </Panel>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Что меняется"
          value="Flow"
          hint="Компоненты перестают координировать друг друга напрямую и начинают говорить с одной state-моделью."
          tone="cool"
        />
        <MetricCard
          label="Что растёт"
          value="Predictability"
          hint="Один dispatch может менять несколько view-веток, но путь этого изменения остаётся одинаковым."
        />
        <MetricCard
          label="Что уходит"
          value="Hidden coupling"
          hint="Веткам UI больше не нужно знать внутреннее устройство соседних веток, чтобы остаться синхронными."
          tone="accent"
        />
      </div>

      <Panel>
        <BeforeAfter
          beforeTitle="Если каждая ветка обновляет соседей напрямую"
          before="Toolbar, list и inspector оказываются завязаны на чужие callbacks и локальные детали реализации."
          afterTitle="Если все ветки читают и обновляют один store"
          after="У веток остаётся только две роли: dispatch-ить intent и читать derived data через selectors."
        />
      </Panel>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
