import { ServerFunctionsPlaybookLab } from '../components/server-functions-labs/ServerFunctionsPlaybookLab';
import { ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function PlaybookPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Server Functions playbook"
        title="Как понять, когда server function действительно упрощает full-stack React, а когда нужен другой transport-паттерн"
        copy="В финальной лаборатории свойства экрана собираются в решение: form action через серверную границу, client island с точечным серверным вызовом, manual API или purely client сценарий."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">
              Сначала boundary и поток, потом технология
            </StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Хорошее решение появляется не из модного API, а из того, где реально
              находятся данные, права, submit и browser interaction.
            </p>
          </div>
        }
      />

      <ServerFunctionsPlaybookLab />

      <ProjectStudy
        files={projectStudyByLab.playbook.files}
        snippets={projectStudyByLab.playbook.snippets}
      />
    </div>
  );
}
