import { ControlledFieldsPlayground } from '../components/forms/ControlledFieldsPlayground';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildControlledFormReport } from '../lib/controlled-form-model';
import { createControlledLessonForm } from '../lib/form-domain';
import { getProjectStudy } from '../lib/project-study';

export function ControlledFieldsPage() {
  const report = buildControlledFormReport(createControlledLessonForm());
  const study = getProjectStudy('controlled');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="Controlled поля: input, textarea, select, checkbox и radio"
        copy="Controlled форма строит понятный поток `ввод → state → UI`. Каждое поле читает своё значение из React state и каждое изменение снова проходит через обработчик в state."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Sync model"
          value="input → state → UI"
          hint={report.summary}
          tone="cool"
        />
        <MetricCard
          label="Completion"
          value={`${report.completion}%`}
          hint="Заполнение формы сразу отражается в preview и метриках."
        />
        <MetricCard
          label="Preview"
          value={report.previewLabel}
          hint="Один state-объект уже даёт готовую live-сводку формы."
          tone="accent"
        />
      </div>

      <ControlledFieldsPlayground />

      <Panel className="space-y-4">
        <CodeBlock label="Controlled handler" code={report.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
