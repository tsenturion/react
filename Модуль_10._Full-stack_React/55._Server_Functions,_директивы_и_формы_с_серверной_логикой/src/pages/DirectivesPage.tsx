import { DirectiveBoundaryLab } from '../components/server-functions-labs/DirectiveBoundaryLab';
import { ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function DirectivesPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="`use client` / `use server`"
        title="Как провести server/client boundary так, чтобы форма и серверная логика не утянули весь экран в browser bundle"
        copy="На этой странице границу можно двигать руками. Здесь хорошо видно, что директивы определяют не только допустимый синтаксис, но и размер client graph, hydration pressure и число мест, где client всё равно будет обращаться к серверной логике."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">
              Server default не означает server everywhere
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Client слой нужен там, где действительно живёт browser event loop: input,
              preview, optimistic feedback и локальный pending UX.
            </p>
          </div>
        }
      />

      <DirectiveBoundaryLab />

      <ProjectStudy
        files={projectStudyByLab.directives.files}
        snippets={projectStudyByLab.directives.snippets}
      />
    </div>
  );
}
