import { MeasureLab } from '../components/dom-refs/MeasureLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildMeasureReport, summarizeArea } from '../lib/measure-model';
import { getProjectStudy } from '../lib/project-study';

export function MeasurePage() {
  const guess = buildMeasureReport('guess');
  const measure = buildMeasureReport('measure');
  const observer = buildMeasureReport('observer');
  const study = getProjectStudy('measure');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="Измерение DOM: где refs становятся мостом к реальному layout"
        copy="Ширина и высота итогового элемента появляются только после браузерного layout. Поэтому измерение — это не guess из props, а чтение реального DOM через ref и browser APIs."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard label="Guess" value="props only" hint={guess.summary} tone="accent" />
        <MetricCard
          label="Measured area example"
          value={summarizeArea(320, 180)}
          hint={measure.summary}
          tone="cool"
        />
        <MetricCard
          label="Live updates"
          value="ResizeObserver"
          hint={observer.summary}
          tone="dark"
        />
      </div>

      <MeasureLab />

      <Panel className="grid gap-4 xl:grid-cols-3">
        <CodeBlock label={guess.title} code={guess.snippet} />
        <CodeBlock label={measure.title} code={measure.snippet} />
        <CodeBlock label={observer.title} code={observer.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
