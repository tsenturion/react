import { RollbackLab } from '../components/mutations/RollbackLab';
import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function RollbackPage() {
  const study = projectStudies.rollback;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="Rollback при ошибке"
        copy="Optimistic UX без rollback превращается в ложь интерфейса. Здесь вы видите, как локально показанный успех должен исчезнуть, если сервер его не подтвердил."
      />

      <Panel>
        <RollbackLab />
      </Panel>

      <BeforeAfter
        beforeTitle="Без rollback"
        before="Интерфейс продолжает показывать успешный итог, хотя сервер его отверг. Это разрушает доверие к данным."
        afterTitle="С rollback"
        after="Интерфейс возвращается к последнему подтверждённому состоянию и объясняет, что именно не удалось сохранить."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Snapshot"
          value="Return point"
          hint="Нужна точка возврата к последнему подтверждённому состоянию."
          tone="cool"
        />
        <MetricCard
          label="Ошибка мутации"
          value="Not hidden"
          hint="Пользователь должен видеть не только rollback, но и причину, почему optimistic итог исчез."
        />
        <MetricCard
          label="Главное правило"
          value="Truth wins"
          hint="Если сервер не подтвердил действие, UI обязан подчиниться подтверждённой реальности."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
