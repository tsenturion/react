import { KeyboardFocusLab } from '../components/accessibility/KeyboardFocusLab';
import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function KeyboardPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Keyboard and focus"
        title="Фокус должен двигаться как карта интерфейса, а не как побочный эффект кликов"
        copy="Кнопка, диалог и временный слой считаются доступными только тогда, когда весь путь можно пройти без мыши: войти, выполнить действие, выйти и вернуться к исходной точке."
        aside={<StatusPill tone="success">focus flow</StatusPill>}
      />

      <BeforeAfter
        beforeTitle="Ломается быстро"
        before="Click-only div выглядит как action, но не попадает в Tab-порядок. Диалог закрывается, а focus исчезает в никуда."
        afterTitle="Работает предсказуемо"
        after="Native controls попадают в keyboard flow автоматически, Escape закрывает временный слой, а focus возвращается к триггеру."
      />

      <KeyboardFocusLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab.keyboard} />
      </Panel>
    </div>
  );
}
