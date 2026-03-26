import { ClientSuspenseLab } from '../components/suspense-labs/ClientSuspenseLab';
import { ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function ClientSuspensePage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Client Suspense"
        title="Как границы ожидания меняют поведение одного и того же клиентского экрана"
        copy="На этой странице вы сравниваете одну большую границу ожидания и раздельные локальные boundaries. Именно здесь хорошо видно, что Suspense управляет размером зоны ожидания, а не создаёт данные сам по себе."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">Boundary size = UX cost</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Чем крупнее граница, тем выше шанс, что одна медленная секция скроет уже
              полезную часть интерфейса.
            </p>
          </div>
        }
      />

      <ClientSuspenseLab />

      <ProjectStudy
        files={projectStudyByLab.client.files}
        snippets={projectStudyByLab.client.snippets}
      />
    </div>
  );
}
