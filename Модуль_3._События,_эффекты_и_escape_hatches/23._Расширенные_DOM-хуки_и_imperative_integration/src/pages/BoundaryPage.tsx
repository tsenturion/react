import { OverengineeringLab } from '../components/dom-hooks/OverengineeringLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import {
  buildOverengineeringReport,
  getScenarioRecommendation,
} from '../lib/overengineering-model';
import { getProjectStudy } from '../lib/project-study';

export function BoundaryPage() {
  const removeReport = buildOverengineeringReport('remove');
  const measureReport = buildOverengineeringReport('measure');
  const handleReport = buildOverengineeringReport('handle');
  const derivedScenario = getScenarioRecommendation('derived-filter');
  const widgetScenario = getScenarioRecommendation('widget-bridge');
  const study = getProjectStudy('boundary');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Когда advanced DOM hooks действительно нужны"
        copy="Самая частая ошибка здесь не в синтаксисе hook-а, а в выборе инструмента. useLayoutEffect, useInsertionEffect и useImperativeHandle решают очень узкие задачи. Если задача проще, hook превращается в избыточное усложнение."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Derived state case"
          value={derivedScenario.recommended}
          hint={derivedScenario.why}
          tone="cool"
        />
        <MetricCard
          label="Measurement case"
          value="useLayoutEffect"
          hint={measureReport.summary}
          tone="accent"
        />
        <MetricCard
          label="Widget case"
          value={widgetScenario.recommended}
          hint={widgetScenario.why}
          tone="dark"
        />
      </div>

      <OverengineeringLab />

      <Panel className="grid gap-4 xl:grid-cols-3">
        <CodeBlock label={removeReport.title} code={removeReport.snippet} />
        <CodeBlock label={measureReport.title} code={measureReport.snippet} />
        <CodeBlock label={handleReport.title} code={handleReport.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
