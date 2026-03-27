import { CacheConsistencyLab } from '../components/server-state/CacheConsistencyLab';
import {
  BeforeAfter,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function ConsistencyPage() {
  const study = projectStudies.consistency;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Кэш и согласованность связанных queries"
        copy="Одна мутация редко затрагивает только один query key. Здесь вы видите, как список и summary начинают расходиться, если invalidation scope выбран слишком узко."
      />

      <Panel>
        <CacheConsistencyLab />
      </Panel>

      <BeforeAfter
        beforeTitle="Слишком узкий invalidation scope"
        before="Список уже показывает новый серверный результат, а summary всё ещё смотрит на старый cache entry."
        afterTitle="Связанные queries обновляются вместе"
        after="Интерфейс остаётся согласованным между виджетами, потому что cache invalidation учитывает все затронутые ключи."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Related keys"
          value="Invalidate as a graph"
          hint="Мутация касается не одного виджета, а набора связанных query entries."
          tone="cool"
        />
        <MetricCard
          label="Mismatch"
          value="UI drift"
          hint="Даже при успешной мутации часть интерфейса может остаться в старом кэше."
        />
        <MetricCard
          label="Rule"
          value="Consistency first"
          hint="Server state слой ценен не кэшем сам по себе, а согласованностью между потребителями."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
