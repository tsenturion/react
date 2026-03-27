import { UseCallbackLab } from '../components/memoization/UseCallbackLab';
import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function UseCallbackPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="useCallback and handler stability"
        title="`useCallback` имеет смысл там, где нестабильный handler действительно пробивает memo-child"
        copy="Если child rows сравнивают props по ссылке, новый callback на каждый parent render превращается в широкий rerender списка. Если такого child нет, useCallback часто даёт только более шумный код."
        aside={<StatusPill tone="success">stability for rows</StatusPill>}
      />

      <BeforeAfter
        beforeTitle="Лишняя ширина"
        before="Parent меняет заметку, callback получает новую ссылку, и memo-row считает, что props изменились у каждого элемента."
        afterTitle="Локальность обновлений"
        after="Стабильный handler вместе с primitive row props позволяет обновлять только ту строку, где действительно изменился selected state."
      />

      <UseCallbackLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab['use-callback']} />
      </Panel>
    </div>
  );
}
