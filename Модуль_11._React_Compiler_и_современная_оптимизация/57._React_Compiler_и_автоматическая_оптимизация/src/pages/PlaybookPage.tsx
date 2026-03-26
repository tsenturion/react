import { ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { CompilerPlaybookLab } from '../components/compiler-labs/CompilerPlaybookLab';
import { projectStudyByLab } from '../lib/project-study';

export function PlaybookPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Playbook"
        title="Как выбирать стратегию внедрения React Compiler без мифа о том, что он автоматически заменяет всё остальное performance work"
        copy="Итоговый playbook собирает тему в архитектурное решение: когда начинать с малого, когда compiler уже можно включать системно, а когда сначала стоит чинить саму структуру приложения."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">Compiler — слой, а не религия</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Даже удачный rollout не освобождает от работы над state placement, data flow
              и boundaries между тяжёлыми частями интерфейса.
            </p>
          </div>
        }
      />

      <CompilerPlaybookLab />

      <ProjectStudy
        files={projectStudyByLab.playbook.files}
        snippets={projectStudyByLab.playbook.snippets}
      />
    </div>
  );
}
