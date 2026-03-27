import { SemanticsAriaLab } from '../components/accessibility/SemanticsAriaLab';
import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function SemanticsPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Semantics and roles"
        title="Семантика интерфейса должна рождаться из HTML-структуры, а не из случайного набора aria-атрибутов"
        copy="Landmarks, headings и native controls дают экрану форму, которую может читать и человек, и assistive technology. Лишний или неверный ARIA чаще шумит, чем помогает."
        aside={<StatusPill tone="warn">aria only when needed</StatusPill>}
      />

      <BeforeAfter
        beforeTitle="Div soup"
        before="Generic div повторяют внешний вид интерфейса, но теряют landmarks, роли и ожидаемое keyboard-поведение."
        afterTitle="Semantic screen"
        after="main, nav, section и button уже выражают структуру и смысл. ARIA остаётся точечным мостом, а не заменой HTML."
      />

      <SemanticsAriaLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab.semantics} />
      </Panel>
    </div>
  );
}
