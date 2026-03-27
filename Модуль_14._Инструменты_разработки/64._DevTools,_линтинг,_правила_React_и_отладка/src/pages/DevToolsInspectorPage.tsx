import { DevToolsInspectorLab } from '../components/tooling-labs/DevToolsInspectorLab';
import { ProjectStudy, SectionIntro } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function DevToolsInspectorPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="DevTools"
        title="Инспекция props, state и context должна вести к решению, а не к любопытству"
        copy="React DevTools полезен не тем, что показывает красивое дерево, а тем, что позволяет переводить баг в конкретный snapshot данных. Здесь можно переключать filter, tabs и theme-context, чтобы увидеть, как меняются причины рендера на уровне компонентной модели."
      />

      <DevToolsInspectorLab />

      <section className="panel p-5 sm:p-6">
        <ProjectStudy {...projectStudyByLab.devtools} />
      </section>
    </div>
  );
}
