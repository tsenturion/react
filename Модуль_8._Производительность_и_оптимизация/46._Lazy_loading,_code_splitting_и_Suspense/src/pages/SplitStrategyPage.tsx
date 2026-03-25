import { SplitStrategyAdvisorLab } from '../components/lazy-loading/SplitStrategyAdvisorLab';
import { Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function SplitStrategyPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Split strategy"
        title="Code splitting не должен превращать приложение в набор случайных догрузок"
        copy="Финальная лаборатория собирает target, вес кода, частоту использования и ширину fallback в одну decision model. Так легче увидеть, где split даёт пользу, а где только сетевую дробность."
      />

      <SplitStrategyAdvisorLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab['split-strategy']} />
      </Panel>
    </div>
  );
}
