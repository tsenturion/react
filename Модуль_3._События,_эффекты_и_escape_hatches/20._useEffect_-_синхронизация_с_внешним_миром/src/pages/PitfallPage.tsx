import { PitfallLab } from '../components/effects/PitfallLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildPitfallReport } from '../lib/effect-pitfall-model';
import { getProjectStudy } from '../lib/project-study';

export function PitfallPage() {
  const derived = buildPitfallReport('derived-in-effect');
  const unstable = buildPitfallReport('unstable-dependency');
  const loop = buildPitfallReport('loop-risk');
  const study = getProjectStudy('pitfalls');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Лишние effects, неверные dependencies и бесконечные циклы"
        copy="Большая часть проблем с useEffect начинается не в API самого хука, а в неправильной архитектуре: когда effect пытаются использовать для обычного вычисления, когда в dependencies попадает нестабильный object или когда effect меняет свою же зависимость."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Лишний effect"
          value="derived drift"
          hint={derived.summary}
          tone="accent"
        />
        <MetricCard label="Unstable dep" value="extra reruns" hint={unstable.summary} />
        <MetricCard
          label="Loop risk"
          value="render storm"
          hint={loop.summary}
          tone="dark"
        />
      </div>

      <PitfallLab />

      <Panel className="grid gap-4 xl:grid-cols-3">
        <CodeBlock label={derived.title} code={derived.badSnippet} />
        <CodeBlock label={unstable.title} code={unstable.badSnippet} />
        <CodeBlock label={loop.title} code={loop.badSnippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
