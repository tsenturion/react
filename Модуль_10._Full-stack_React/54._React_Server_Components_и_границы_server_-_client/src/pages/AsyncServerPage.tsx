import { AsyncServerComponentsLab } from '../components/rsc-labs/AsyncServerComponentsLab';
import { ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function AsyncServerPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Async server components"
        title="Как async server components меняют порядок появления данных и уменьшают client waterfall"
        copy="Здесь сравниваются три стратегии: data read внутри async server component, server page с отдельным client island и классический client fetch после загрузки JS."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">Сначала данные, потом islands</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Async server component полезен там, где содержимое экрана важнее раннего
              подъёма целого client tree.
            </p>
          </div>
        }
      />

      <AsyncServerComponentsLab />

      <ProjectStudy
        files={projectStudyByLab['async-server'].files}
        snippets={projectStudyByLab['async-server'].snippets}
      />
    </div>
  );
}
