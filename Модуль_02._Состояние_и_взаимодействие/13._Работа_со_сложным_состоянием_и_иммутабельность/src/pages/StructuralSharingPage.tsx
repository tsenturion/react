import { StructuralSharingSandbox } from '../components/complex-state/StructuralSharingSandbox';
import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { createReferenceItems } from '../lib/complex-state-domain';
import { getProjectStudy } from '../lib/project-study';
import {
  buildReferenceReuseReport,
  updateReferenceItemTargeted,
  updateReferenceItemsDeepClone,
} from '../lib/structural-sharing-model';

export function StructuralSharingPage() {
  const items = createReferenceItems();
  const targeted = buildReferenceReuseReport(
    items,
    updateReferenceItemTargeted(items, 'item-3'),
    'targeted',
  );
  const deepClone = buildReferenceReuseReport(
    items,
    updateReferenceItemsDeepClone(items, 'item-3'),
    'deep-clone',
  );
  const study = getProjectStudy('sharing');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Производительность и structural sharing"
        copy="Иммутабельность важна не только для корректности. Когда update делает новые ссылки только там, где данные реально изменились, React и memoized-поддеревья получают намного более чистую картину изменений."
      />

      <div className="space-y-6">
        <div className="grid gap-3 md:grid-cols-3">
          <MetricCard
            label="Targeted reused"
            value={String(targeted.reusedCount)}
            hint={targeted.summary}
            tone="cool"
          />
          <MetricCard
            label="Deep clone reused"
            value={String(deepClone.reusedCount)}
            hint={deepClone.summary}
            tone="accent"
          />
          <MetricCard
            label="Changed refs"
            value={`${targeted.recreatedCount} vs ${deepClone.recreatedCount}`}
            hint="Обе стратегии корректны, но их цена для reference diffing заметно различается."
          />
        </div>

        <BeforeAfter
          beforeTitle="Если клонировать всё дерево без нужды"
          before={deepClone.summary}
          afterTitle="Если копировать только изменённую ветку"
          after={targeted.summary}
        />

        <StructuralSharingSandbox />
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
