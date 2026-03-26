import { ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { TypeScriptPlaybookLab } from '../components/typescript-labs/TypeScriptPlaybookLab';
import { projectStudyByLab } from '../lib/project-study';

export function PlaybookPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Playbook"
        title="Как вводить TypeScript в React-проект так, чтобы он усиливал архитектуру, а не создавал лишний шум"
        copy="Итоговый playbook собирает тему целиком: где начать с props contracts, где сначала типизировать DOM и events, а где типовые ошибки уже показывают необходимость переделать саму модель UI."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">Не лечите всё через `as any`</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Если типизация постоянно требует обходных манёвров, чаще всего это сигнал
              пересмотреть границу компонента или формы данных.
            </p>
          </div>
        }
      />

      <TypeScriptPlaybookLab />

      <ProjectStudy
        files={projectStudyByLab.playbook.files}
        snippets={projectStudyByLab.playbook.snippets}
      />
    </div>
  );
}
