import { PortalEventsLab } from '../components/escape-hatches/PortalEventsLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildPortalReport, describeBubbleSequence } from '../lib/portal-model';
import { getProjectStudy } from '../lib/project-study';

export function PortalEventsPage() {
  const bubbleReport = buildPortalReport('bubbling');
  const study = getProjectStudy('bubbling');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="Порталы и bubbling событий в React"
        copy="Portal меняет только место DOM-узла. С точки зрения React-событий этот узел остаётся в том же дереве компонентов, поэтому bubbling идёт по React-предкам, а не по случайным DOM-родителям вокруг host node."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Allow sequence"
          value={String(describeBubbleSequence('allow').length)}
          hint={bubbleReport.summary}
          tone="cool"
        />
        <MetricCard
          label="Stop sequence"
          value={String(describeBubbleSequence('stop').length)}
          hint="stopPropagation внутри portal работает точечно и не отменяет сам факт React bubbling-модели."
          tone="accent"
        />
        <MetricCard
          label="Common mistake"
          value="DOM-only mental model"
          hint="Если смотреть только на body-host, легко ошибиться с тем, куда реально дойдёт событие."
          tone="dark"
        />
      </div>

      <PortalEventsLab />

      <Panel className="grid gap-4 xl:grid-cols-2">
        <CodeBlock label={bubbleReport.title} code={bubbleReport.snippet} />
        <CodeBlock
          label="Portal bubbling order"
          code={describeBubbleSequence('allow').join('\n')}
        />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
