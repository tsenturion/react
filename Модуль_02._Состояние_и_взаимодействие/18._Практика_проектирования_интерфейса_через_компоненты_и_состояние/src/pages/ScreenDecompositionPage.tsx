import { ScreenDecompositionLab } from '../components/interface-practice/ScreenDecompositionLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildDecompositionPlan } from '../lib/decomposition-model';
import { getProjectStudy } from '../lib/project-study';

export function ScreenDecompositionPage() {
  const plan = buildDecompositionPlan('balanced');
  const study = getProjectStudy('decomposition');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 1"
        title="Как разложить экран на компоненты без хаоса"
        copy="Декомпозиция начинается не с мелких атомов, а с чтения boundaries: какие части экрана меняются независимо, какие отвечают за входные данные, а какие только отображают derived result."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Balanced plan"
          value={`${plan.componentCount} nodes`}
          hint={plan.summary}
          tone="cool"
        />
        <MetricCard
          label="Owner state"
          value="1 экранный owner"
          hint="query, selectedId и drafts живут выше sibling-компонентов."
        />
        <MetricCard
          label="Первый проход"
          value="boundaries first"
          hint="Сначала крупные зоны экрана, потом уточнение компонентов."
          tone="accent"
        />
      </div>

      <ScreenDecompositionLab />

      <Panel className="space-y-4">
        <CodeBlock label="Balanced screen split" code={plan.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
