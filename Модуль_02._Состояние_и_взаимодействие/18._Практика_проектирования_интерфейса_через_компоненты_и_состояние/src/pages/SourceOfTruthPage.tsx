import { SourceOfTruthLab } from '../components/interface-practice/SourceOfTruthLab';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { getProjectStudy } from '../lib/project-study';
import { buildSourceTruthReport } from '../lib/source-truth-model';

export function SourceOfTruthPage() {
  const good = buildSourceTruthReport('root-owned');
  const bad = buildSourceTruthReport('duplicated-selection');
  const study = getProjectStudy('truth');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="Как найти источник истины и не получить drift между sibling-компонентами"
        copy="Если один и тот же смысл живёт в разных местах, экран начинает показывать две версии реальности. Устойчивый экран сначала находит owner state, а потом раздаёт данные и события вниз по дереву."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Good score"
          value={String(good.score)}
          hint={good.summary}
          tone="cool"
        />
        <MetricCard label="Bad score" value={String(bad.score)} hint={bad.summary} />
        <MetricCard
          label="Главный признак"
          value="одна truth boundary"
          hint="Список, details и summary должны читать общий state, а не копировать его."
          tone="accent"
        />
      </div>

      <SourceOfTruthLab />

      <BeforeAfter
        beforeTitle="При дублировании selection"
        before="Список и details показывают разные сущности, а исправление требует ручной синхронизации."
        afterTitle="При одном owner state"
        after="Событие выбора меняет одну точку истины, а остальные части экрана получают обновление естественно через render."
      />

      <Panel className="grid gap-4 lg:grid-cols-2">
        <CodeBlock label="Single source" code={good.snippet} />
        <CodeBlock label="Duplicated selection" code={bad.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
