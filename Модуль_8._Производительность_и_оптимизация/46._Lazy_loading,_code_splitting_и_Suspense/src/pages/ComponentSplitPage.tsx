import { ComponentLazyLab } from '../components/lazy-loading/ComponentLazyLab';
import { Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function ComponentSplitPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Component splitting"
        title="Тяжёлый widget имеет смысл выносить в chunk по намерению, а не по умолчанию"
        copy="Эта лаборатория сравнивает eager import и `React.lazy` на одном и том же наборе panel. Важно увидеть не только наличие fallback, но и то, когда код действительно загружается."
      />

      <ComponentLazyLab />

      <Panel>
        <ProjectStudy {...projectStudyByLab['component-splitting']} />
      </Panel>
    </div>
  );
}
