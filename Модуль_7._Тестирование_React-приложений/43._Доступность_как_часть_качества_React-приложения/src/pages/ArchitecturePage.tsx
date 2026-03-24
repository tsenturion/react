import { QualityBlueprintLab } from '../components/accessibility/QualityBlueprintLab';
import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function ArchitecturePage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Accessibility architecture"
        title="Доступность перестаёт быть чеклистом, когда становится частью проектирования экрана"
        copy="Формы, маршруты, диалоги, async status и custom widgets создают архитектурную нагрузку. Чем раньше accessibility входит в эти решения, тем меньше в проекте хрупких заплаток."
        aside={<StatusPill tone="success">quality blueprint</StatusPill>}
      />

      <BeforeAfter
        beforeTitle="Поздняя доработка"
        before="Сначала собирается экран, потом поверх него точечно добавляются label, aria и тесты. В результате качество распадается между слоями."
        afterTitle="Часть проектирования"
        after="Landmarks, focus flow, названия контролов, статусы и tests по поведению проектируются вместе с маршрутом, состояниями и компонентами."
      />

      <QualityBlueprintLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab.architecture} />
      </Panel>
    </div>
  );
}
