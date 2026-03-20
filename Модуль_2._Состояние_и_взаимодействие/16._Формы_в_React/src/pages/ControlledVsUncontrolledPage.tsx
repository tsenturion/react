import { ControlledVsUncontrolledLab } from '../components/forms/ControlledVsUncontrolledLab';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import {
  buildFormModeComparison,
  serializeControlledForm,
  serializeUncontrolledForm,
} from '../lib/controlled-vs-uncontrolled-model';
import { createControlledLessonForm } from '../lib/form-domain';
import { getProjectStudy } from '../lib/project-study';

export function ControlledVsUncontrolledPage() {
  const comparison = buildFormModeComparison(
    serializeControlledForm(createControlledLessonForm()),
    serializeUncontrolledForm({
      fullName: 'Ирина',
      track: 'forms',
      newsletter: 'on',
    }),
  );
  const study = getProjectStudy('uncontrolled');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="Controlled и uncontrolled components"
        copy="Оба режима могут быть полезны, но они решают разные задачи. Controlled форма даёт live-контроль и синхронный UI, uncontrolled опирается на DOM и читается тогда, когда это действительно нужно."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Controlled"
          value={comparison.controlledSummary}
          hint="React знает значение поля уже во время ввода."
          tone="cool"
        />
        <MetricCard
          label="Uncontrolled"
          value={comparison.uncontrolledSummary}
          hint="DOM становится источником истины до явного чтения через FormData."
        />
        <MetricCard
          label="Практика"
          value="choose by need"
          hint={comparison.summary}
          tone="accent"
        />
      </div>

      <BeforeAfter
        beforeTitle="Если нужен live preview и custom UX"
        before="Controlled форма проще для мгновенной валидации, зависимых полей и предсказуемого reset."
        afterTitle="Если нужен простой native flow"
        after="Uncontrolled форма подходит там, где достаточно прочитать итог при submit и не держать каждое поле в state."
      />

      <ControlledVsUncontrolledLab />

      <Panel className="space-y-4">
        <CodeBlock label="Uncontrolled read" code={comparison.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
