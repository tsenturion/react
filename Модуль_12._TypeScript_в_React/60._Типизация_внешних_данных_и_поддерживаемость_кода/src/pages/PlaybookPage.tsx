import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { ExternalDataPlaybookLab } from '../components/external-data-labs/ExternalDataPlaybookLab';
import { projectStudyByLab } from '../lib/project-study';

export function PlaybookPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Playbook"
        title="Как вводить runtime validation так, чтобы она уменьшала хрупкость, а не плодила церемонию"
        copy="Финальный блок помогает выбрать не просто “использовать ли Zod”, а где именно схеме место: в request client, в форме, в loader boundary или в shared full-stack contract. Полезна точность точки входа, а не массовое оборачивание всего подряд."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">Target the boundary</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Самая полезная схема обычно стоит там, где данные впервые входят в слой.
            </p>
          </div>
        }
      />

      <Panel>
        <ExternalDataPlaybookLab />
      </Panel>

      <BeforeAfter
        beforeTitle="Везде понемногу"
        before="Локальные guards, касты и ad-hoc проверки появляются в каждом компоненте, но общий контракт так и не становится ясным."
        afterTitle="Одна явная точка parse"
        after="Schema живёт рядом с boundary helper и даёт проекту один понятный входной контракт для дальнейшего typed кода."
      />

      <ProjectStudy
        files={projectStudyByLab.playbook.files}
        snippets={projectStudyByLab.playbook.snippets}
      />
    </div>
  );
}
