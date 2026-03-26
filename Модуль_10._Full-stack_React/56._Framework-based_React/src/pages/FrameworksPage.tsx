import { FrameworkComparisonLab } from '../components/framework-labs/FrameworkComparisonLab';
import { ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function FrameworksPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Framework comparison"
        title="Когда React-приложению нужен полноценный framework, а когда ручной стек ещё не стал архитектурной нагрузкой"
        copy="На этой странице вы сравниваете три пути: DIY SPA, React Router framework mode и Next.js App Router. Разница видна не только по routing, но и по тому, сколько full-stack infrastructure уже встроено в выбранную поверхность."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">
              Сравнивайте не названия, а встроенные обязанности
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Чем больше product shape упирается в SSR, route-owned data и server
              mutations, тем ценнее framework-first решение.
            </p>
          </div>
        }
      />

      <FrameworkComparisonLab />

      <ProjectStudy
        files={projectStudyByLab.frameworks.files}
        snippets={projectStudyByLab.frameworks.snippets}
      />
    </div>
  );
}
