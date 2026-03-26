import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { ReducerUnionLab } from '../components/advanced-types-labs/ReducerUnionLab';
import { projectStudyByLab } from '../lib/project-study';

export function ReducerUnionPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Reducers & unions"
        title="Typed reducer помогает держать сложный editor flow в конечных и проверяемых ветках"
        copy="В этой лаборатории reducer управляет тремя разными ветками редактора. Смотрите, как discriminated union делает допустимые переходы явными и не даёт случайно мутировать нерелевантные поля."
        aside={
          <div className="space-y-3">
            <StatusPill tone="success">Reducer logic = component contract</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Здесь типы описывают не только shape данных, но и допустимые переходы между
              режимами редактирования.
            </p>
          </div>
        }
      />

      <Panel>
        <ReducerUnionLab />
      </Panel>

      <BeforeAfter
        beforeTitle="Loose reducer"
        before="Экран держится на одном `state`-объекте и произвольных `field/value` actions, поэтому новая ветка легко ломает старую или silently игнорируется."
        afterTitle="Typed reducer"
        after="Action union связан с конкретными ветками editor state, а неверный переход заметен сразу во время изменения reducer или calling code."
      />

      <ProjectStudy
        files={projectStudyByLab.reducers.files}
        snippets={projectStudyByLab.reducers.snippets}
      />
    </div>
  );
}
