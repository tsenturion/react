import { HandlerPitfallsLab } from '../components/react-events/HandlerPitfallsLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildPitfallReport } from '../lib/event-pitfall-model';
import { getProjectStudy } from '../lib/project-study';

export function HandlerPitfallsPage() {
  const targetReport = buildPitfallReport('target-vs-currentTarget');
  const invokeReport = buildPitfallReport('invoke-during-render');
  const argReport = buildPitfallReport('arg-wrapper');
  const study = getProjectStudy('pitfalls');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Типичные ошибки в обработчиках событий ломают логику раньше, чем кажется"
        copy="Здесь важны не только синтаксис и типы, но и семантика: какой элемент лежит в `target`, где нужен `currentTarget`, почему нельзя вызывать handler во время render и как безопасно передавать аргументы без скрытых сайд-эффектов."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Target trap"
          value="nested node"
          hint={targetReport.summary}
          tone="accent"
        />
        <MetricCard
          label="Render trap"
          value="immediate call"
          hint={invokeReport.summary}
        />
        <MetricCard
          label="Safe pattern"
          value="pass a function"
          hint={argReport.summary}
          tone="cool"
        />
      </div>

      <HandlerPitfallsLab />

      <Panel className="grid gap-4 xl:grid-cols-2">
        <CodeBlock label="Bad: target" code={targetReport.badSnippet} />
        <CodeBlock label="Good: currentTarget" code={targetReport.goodSnippet} />
        <CodeBlock label="Bad: invoke during render" code={invokeReport.badSnippet} />
        <CodeBlock label="Good: wrapper function" code={invokeReport.goodSnippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
