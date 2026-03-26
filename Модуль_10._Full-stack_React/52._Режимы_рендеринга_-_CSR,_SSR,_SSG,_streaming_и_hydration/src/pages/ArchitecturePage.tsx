import { ArchitectureConsequencesLab } from '../components/render-modes/ArchitectureConsequencesLab';
import { ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function ArchitecturePage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Architecture"
        title="Как режим рендеринга меняет структуру проекта, кэш и доставку данных"
        copy="CSR, SSR, SSG и streaming по-разному раскладывают ответственность между build pipeline, сервером, CDN и клиентом. Поэтому выбор режима меняет не только UX, но и саму карту проекта."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">
              Режим рендеринга — это архитектурное решение
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Один и тот же экран по-разному организует кэш, invalidation, персонализацию
              и серверную стоимость в зависимости от режима.
            </p>
          </div>
        }
      />

      <ArchitectureConsequencesLab />

      <ProjectStudy
        files={projectStudyByLab.architecture.files}
        snippets={projectStudyByLab.architecture.snippets}
      />
    </div>
  );
}
