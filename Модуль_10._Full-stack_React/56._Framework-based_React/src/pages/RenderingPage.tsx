import { RenderingDirectionLab } from '../components/framework-labs/RenderingDirectionLab';
import { ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function RenderingPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Rendering strategy"
        title="Как SSR, streaming, partial prerendering и новые platform APIs становятся частью framework pipeline"
        copy="На этой странице rendering mode рассматривается не как абстрактная теория, а как следствие route structure, layouts, data latency и выбранного framework surface."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">
              Разделяйте production-ready story и направление платформы
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              PPR и resume/prerender family APIs важны, но их роль нужно оценивать вместе
              со зрелостью конкретного framework и задачами продукта.
            </p>
          </div>
        }
      />

      <RenderingDirectionLab />

      <ProjectStudy
        files={projectStudyByLab.rendering.files}
        snippets={projectStudyByLab.rendering.snippets}
      />
    </div>
  );
}
