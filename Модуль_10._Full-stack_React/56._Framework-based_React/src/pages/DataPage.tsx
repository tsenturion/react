import { DataFlowLab } from '../components/framework-labs/DataFlowLab';
import { BeforeAfter, ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function DataPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Data and mutations"
        title="Как framework-owned route surface меняет data loading, auth, ошибки и мутации"
        copy="Здесь видно, что главное отличие framework-based React — не “другой fetch”, а ownership экрана: кто отвечает за загрузку данных, права доступа, серверные действия и rendering pipeline."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">
              Меньше glue-кода — это следствие правильной surface, а не цель сама по себе
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Если экран до сих пор собирается через случайные hooks и отдельные helpers,
              framework surface используется не полностью.
            </p>
          </div>
        }
      />

      <BeforeAfter
        beforeTitle="Ручной путь"
        before="URL, auth, data loading, SSR и мутации живут в разных местах. Команда тратит силы на glue-код и на поддержку собственных соглашений."
        afterTitle="Framework-owned путь"
        after="Маршрут владеет экраном и его full-stack поведением. Данные, ошибки, redirects и mutations укладываются в более прямую и читаемую архитектуру."
      />

      <DataFlowLab />

      <ProjectStudy
        files={projectStudyByLab.data.files}
        snippets={projectStudyByLab.data.snippets}
      />
    </div>
  );
}
