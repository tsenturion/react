import { LayerEscapeLab } from '../components/escape-hatches/LayerEscapeLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildLayeringReport, computeTooltipPlacement } from '../lib/layering-model';
import { getProjectStudy } from '../lib/project-study';

export function LayerEscapePage() {
  const inlineReport = buildLayeringReport('inline');
  const portalReport = buildLayeringReport('portal');
  const sample = computeTooltipPlacement(
    { top: 84, left: 16, width: 80, height: 30 },
    360,
    240,
    260,
    120,
  );
  const study = getProjectStudy('layering');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="Portal как способ выйти из clipping и stacking traps"
        copy="Часть overlay-проблем не решается простым z-index. Если tooltip или menu остаётся внутри контейнера с overflow hidden или локальным stacking context, он так и будет ограничен этим DOM-окружением. Portal позволяет вынести слой за пределы этой ловушки."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Sample left"
          value={`${sample.left}px`}
          hint={portalReport.summary}
          tone="cool"
        />
        <MetricCard
          label="Sample top"
          value={`${sample.top}px`}
          hint={inlineReport.summary}
          tone="accent"
        />
        <MetricCard
          label="Why portal wins"
          value="separate layer"
          hint="Portal особенно полезен там, где overlay должен выйти из локального layout-контекста."
          tone="dark"
        />
      </div>

      <LayerEscapeLab />

      <Panel className="grid gap-4 xl:grid-cols-2">
        <CodeBlock label={portalReport.title} code={portalReport.snippet} />
        <CodeBlock label={inlineReport.title} code={inlineReport.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
