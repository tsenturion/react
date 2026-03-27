import { AccessibilityAuditLab } from '../components/accessibility/AccessibilityAuditLab';
import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function TestingPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Testing and audits"
        title="Тесты про доступность должны проверять путь пользователя, а не внутреннюю механику компонента"
        copy="Если suite ищет поля по role и имени, умеет увидеть alert и пройти keyboard flow, она страхует реальный интерфейс. Проверки по классам и test ids дают гораздо более слабый сигнал."
        aside={<StatusPill tone="success">user-centric tests</StatusPill>}
      />

      <BeforeAfter
        beforeTitle="Implementation-centric tests"
        before="Тест знает className и test id, но не замечает, что у поля пропала label, а div притворяется button."
        afterTitle="Behavior-centric tests"
        after="Тест ищет textbox по имени, alert по роли, а кнопку по button/name. Это связывает тестовый слой с реальным поведением интерфейса."
      />

      <AccessibilityAuditLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab.testing} />
      </Panel>
    </div>
  );
}
