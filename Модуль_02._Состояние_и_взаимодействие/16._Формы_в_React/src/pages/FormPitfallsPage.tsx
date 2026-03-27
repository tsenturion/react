import { FormPitfallsLab } from '../components/forms/FormPitfallsLab';
import { MetricCard, Panel, ProjectStudy, SectionIntro } from '../components/ui';
import { getProjectStudy } from '../lib/project-study';
import { buildPitfallReport } from '../lib/pitfalls-model';

export function FormPitfallsPage() {
  const report = buildPitfallReport('checkbox-value');
  const study = getProjectStudy('pitfalls');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Типичные ошибки форм"
        copy="Ошибки в формах редко выглядят как сложная архитектурная проблема, но именно они ломают поток `ввод → state → UI`: `value` вместо `checked`, submit без `preventDefault`, reset DOM без reset state и другие мелкие, но дорогие промахи."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Checkbox"
          value="checked, not value"
          hint="Checkbox должен писать boolean, а не строку `on`."
          tone="accent"
        />
        <MetricCard
          label="Submit"
          value="preventDefault()"
          hint="SPA-форма должна явно останавливать нативный переход браузера."
        />
        <MetricCard label="Reset" value="DOM + state" hint={report.summary} tone="cool" />
      </div>

      <FormPitfallsLab />

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
