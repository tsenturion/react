import { RscPlaybookLab } from '../components/rsc-labs/RscPlaybookLab';
import { ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function PlaybookPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="RSC playbook"
        title="Как выбрать правильную boundary strategy для реального экрана"
        copy="В финальной лаборатории playbook собирает свойства экрана в решение: server default, client island, slot-композиция или более крупный mixed subtree."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">
              Сначала среда исполнения, потом компоненты
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Хорошая граница появляется не из синтаксиса, а из того, где живут данные,
              кто должен гидрироваться и что обязано оставаться интерактивным.
            </p>
          </div>
        }
      />

      <RscPlaybookLab />

      <ProjectStudy
        files={projectStudyByLab.playbook.files}
        snippets={projectStudyByLab.playbook.snippets}
      />
    </div>
  );
}
