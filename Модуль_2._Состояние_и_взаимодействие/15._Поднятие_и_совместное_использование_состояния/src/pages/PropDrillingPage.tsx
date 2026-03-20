import { PropDrillingTraceLab } from '../components/shared-state/PropDrillingTraceLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildPropDrillingReport } from '../lib/prop-drilling-model';
import { getProjectStudy } from '../lib/project-study';

export function PropDrillingPage() {
  const report = buildPropDrillingReport(3, ['selectedTrack', 'onTrackChange']);
  const study = getProjectStudy('drilling');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Prop drilling как следствие архитектуры дерева"
        copy="Если владелец состояния стоит высоко, а deep leaf-компоненту нужен и value, и callback, промежуточные уровни начинают прокидывать эти props дальше. Здесь цепочка видна буквально по уровням дерева."
      />

      <div className="space-y-6">
        <div className="grid gap-3 md:grid-cols-3">
          <MetricCard
            label="Depth"
            value={String(report.depth)}
            hint="Сколько промежуточных слоёв между owner и leaf."
            tone="cool"
          />
          <MetricCard
            label="Forwarded props"
            value={String(report.forwardedProps)}
            hint="Сколько value/callback комбинаций проходит через дерево."
          />
          <MetricCard
            label="Причина"
            value="high owner"
            hint={report.summary}
            tone="accent"
          />
        </div>

        <PropDrillingTraceLab />
        <CodeBlock label="Prop drilling chain" code={report.snippet} />
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
