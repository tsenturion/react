import { PositionAnchorLab } from '../components/state-identity/PositionAnchorLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { getProjectStudy } from '../lib/project-study';
import { buildPositionBindingReport } from '../lib/state-position-model';

export function StatePositionPage() {
  const report = buildPositionBindingReport({
    sameComponentType: true,
    sameTreeSlot: true,
    keyChanged: false,
  });
  const study = getProjectStudy('position');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="State привязан к позиции компонента в дереве"
        copy="React связывает локальное состояние не с переменной props и не с визуальным видом, а с component type в конкретном slot дерева. Пока этот slot остаётся тем же, state живёт дальше."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="State anchor"
          value="type + slot"
          hint={report.summary}
          tone="cool"
        />
        <MetricCard
          label="Props change"
          value="без reset"
          hint="Новые props сами по себе не создают новый экземпляр компонента."
        />
        <MetricCard
          label="Скрытый риск"
          value="seed не пересчитается"
          hint="Initial state из props читается только на mount, а не на каждом следующем render."
          tone="accent"
        />
      </div>

      <PositionAnchorLab />

      <Panel className="space-y-4">
        <CodeBlock label="Binding rule" code={report.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
