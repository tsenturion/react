import { HydrationMismatchLab } from '../components/render-modes/HydrationMismatchLab';
import { BeforeAfter, ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function HydrationPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Hydration"
        title="Почему mismatch — это не случайный warning, а признак нестабильного initial render"
        copy="Hydration связывает серверный HTML и клиентский React tree. Если первый проход на сервере и в браузере строится по разным данным, React вынужден чинить дерево уже после старта страницы."
        aside={
          <div className="space-y-3">
            <StatusPill tone="error">
              Сначала стабилизируйте render, потом гасите warning
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              suppressHydrationWarning полезен только в узких местах и не заменяет поиск
              причины расхождения.
            </p>
          </div>
        }
      />

      <HydrationMismatchLab />

      <BeforeAfter
        beforeTitle="Хрупкая версия"
        before="Initial render зависит от времени, случайности и browser-only API, поэтому сервер и клиент собирают разный HTML."
        afterTitle="Стабильная версия"
        after="Первый проход строится по одинаковым данным, а всё, что зависит от браузера, появляется позже или в отдельной клиентской части дерева."
      />

      <ProjectStudy
        files={projectStudyByLab.hydration.files}
        snippets={projectStudyByLab.hydration.snippets}
      />
    </div>
  );
}
