import { FrameworkPlaybookLab } from '../components/framework-labs/FrameworkPlaybookLab';
import { ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function PlaybookPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Framework playbook"
        title="Как выбрать между Next.js, React Router framework mode и сохранением текущего SPA-подхода"
        copy="Финальная лаборатория собирает реальные требования продукта в стратегическое решение. Здесь хорошо видно, что framework выбирают не по популярности, а по ownership маршрутов, данных и rendering story."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">Сначала product shape, потом framework</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Удачный выбор начинается с вопроса: нужен ли продукту единый full-stack
              route surface уже сейчас.
            </p>
          </div>
        }
      />

      <FrameworkPlaybookLab />

      <ProjectStudy
        files={projectStudyByLab.playbook.files}
        snippets={projectStudyByLab.playbook.snippets}
      />
    </div>
  );
}
