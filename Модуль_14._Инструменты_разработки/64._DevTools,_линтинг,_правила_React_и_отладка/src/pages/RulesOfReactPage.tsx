import { RulesOfReactLab } from '../components/tooling-labs/RulesOfReactLab';
import { ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function RulesOfReactPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Rules of React"
        title="Современные правила React проверяют не только hooks order, но и purity, refs и shape кода"
        copy="Conditional hooks — только вершина айсберга. Здесь можно включать разные классы нарушений и смотреть, как меняется pressure-zone: базовый порядок хуков, purity render phase или архитектурная читаемость component tree."
      />

      <RulesOfReactLab />

      <section className="panel p-5 sm:p-6">
        <ProjectStudy {...projectStudyByLab.rules} />
      </section>
    </div>
  );
}
