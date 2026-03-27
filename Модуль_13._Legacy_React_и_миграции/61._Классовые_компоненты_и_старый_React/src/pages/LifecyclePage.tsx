import { BeforeAfter, ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { LifecycleLab } from '../components/legacy-react-labs/LifecycleLab';
import { projectStudyByLab } from '../lib/project-study';

export function LifecyclePage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Lifecycle methods"
        title="Как читать mount, update и cleanup в class-based коде через причину обновления, а не через абстрактный список методов"
        copy="Старый React требует фазового мышления. Важно не просто помнить названия lifecycle methods, а видеть, какое изменение их запускает и почему побочный эффект живёт именно там."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">componentDidUpdate требует guard</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Без сравнения с prevProps или prevState update-логика превращается в цикл.
            </p>
          </div>
        }
      />

      <LifecycleLab />

      <BeforeAfter
        beforeTitle="Плохой update flow"
        before="componentDidUpdate срабатывает после любого апдейта и сразу снова зовёт setState без проверки причины. Компонент уходит в бесконечный loop."
        afterTitle="Хороший update flow"
        after="componentDidUpdate сначала сравнивает prevProps или prevState, а уже потом запускает узкий side effect для конкретного изменения."
      />

      <ProjectStudy
        files={projectStudyByLab.lifecycle.files}
        snippets={projectStudyByLab.lifecycle.snippets}
      />
    </div>
  );
}
