import { LintRulesLab } from '../components/tooling-labs/LintRulesLab';
import { ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function LintRulesPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Linting"
        title="ESLint для React — это ранняя проверка архитектурных предположений"
        copy="В этой лаборатории видно, как один и тот же набор smell-ов по-разному читается в baseline и strict-конфиге. Смысл не в том, чтобы сделать линтер громче, а в том, чтобы его сигналы соответствовали реальным ограничениям проекта."
      />

      <LintRulesLab />

      <section className="panel p-5 sm:p-6">
        <ProjectStudy {...projectStudyByLab.lint} />
      </section>
    </div>
  );
}
