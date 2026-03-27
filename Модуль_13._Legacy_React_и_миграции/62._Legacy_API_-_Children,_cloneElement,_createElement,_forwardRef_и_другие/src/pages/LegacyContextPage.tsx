import { BeforeAfter, ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { LegacyContextLab } from '../components/legacy-api-labs/LegacyContextLab';
import { projectStudyByLab } from '../lib/project-study';

export function LegacyContextPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Legacy Context"
        title="contextType, Consumer и старый context API: как читать старые provider boundaries через современную оптику"
        copy="Context менялся вместе с React. В старом коде вы можете встретить class consumers, render-prop consumers и ещё более ранний historical context API. Поэтому здесь важна не только техника чтения значения, но и дисциплина вокруг provider boundaries, nested overrides и стратегии миграции."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">Provider boundaries</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Самая частая ошибка при поддержке старого context-кода: менять consumer до
              того, как найден реальный provider и его область ответственности.
            </p>
          </div>
        }
      />

      <LegacyContextLab />

      <BeforeAfter
        beforeTitle="Исторический context"
        before="Значение context сложнее отследить по дереву, а API вокруг provider и consumers более шумный и менее прозрачный."
        afterTitle="Современная модель"
        after="createContext и useContext делают dependency явнее, но migration всё равно нужно строить вокруг существующих provider boundaries."
      />

      <ProjectStudy
        files={projectStudyByLab.context.files}
        snippets={projectStudyByLab.context.snippets}
      />
    </div>
  );
}
