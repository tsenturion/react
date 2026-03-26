import { ModeComparisonLab } from '../components/render-modes/ModeComparisonLab';
import { ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function ModeComparisonPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Modes"
        title="CSR, SSR, SSG и streaming в одной сравнительной модели"
        copy="На этой странице видно, как режим рендеринга влияет на время первого HTML, готовность контента, interactivity, SEO и цену инфраструктуры. Меняйте параметры и смотрите, как рекомендации меняются вместе со сценарием."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">Сравнивайте три времени, а не одно</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Для реального UX обычно важны минимум три точки: первый HTML, момент полной
              видимости контента и момент interactivity.
            </p>
          </div>
        }
      />

      <ModeComparisonLab />

      <ProjectStudy
        files={projectStudyByLab.modes.files}
        snippets={projectStudyByLab.modes.snippets}
      />
    </div>
  );
}
