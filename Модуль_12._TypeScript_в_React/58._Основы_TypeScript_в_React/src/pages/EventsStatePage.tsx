import { ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { EventsStateLab } from '../components/typescript-labs/EventsStateLab';
import { projectStudyByLab } from '../lib/project-study';

export function EventsStatePage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Events & state"
        title="Как типизированные события и state union стабилизируют форму, submit flow и ветки экрана"
        copy="На этой странице типы видны вживую: `ChangeEvent`, `FormEvent`, `KeyboardEvent`, `currentTarget` и union-состояния связывают действия пользователя с более устойчивой UI-логикой."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">`currentTarget` важнее размытого `target`</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Именно он даёт доступ к ожидаемому элементу и не размывает источник значения
              в форме.
            </p>
          </div>
        }
      />

      <EventsStateLab />

      <ProjectStudy
        files={projectStudyByLab.events.files}
        snippets={projectStudyByLab.events.snippets}
      />
    </div>
  );
}
