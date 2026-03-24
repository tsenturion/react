import { LabelAndErrorsLab } from '../components/accessibility/LabelAndErrorsLab';
import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function LabelsPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Labels and accessible names"
        title="Подпись поля, его подсказка и ошибка должны собираться в одну доступную модель"
        copy="Устойчивое поле не прячет своё имя в placeholder и не отрывает ошибку от контрола. В этой лаборатории видно, как accessible name и описание меняются при одном и том же визуальном UI."
        aside={<StatusPill tone="success">label first</StatusPill>}
      />

      <BeforeAfter
        beforeTitle="Хрупкая модель"
        before="Placeholder заменяет label, а ошибка живёт отдельно. Поле визуально похоже на рабочее, но теряет смысл сразу после ввода."
        afterTitle="Устойчивая модель"
        after="Видимая label связана с контролом, helper text и error message входят в описание поля, а тест может искать его по role и имени."
      />

      <LabelAndErrorsLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab.labels} />
      </Panel>
    </div>
  );
}
