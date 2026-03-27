import { TreeMoveLab } from '../components/state-identity/TreeMoveLab';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { getProjectStudy } from '../lib/project-study';
import { buildTreeMoveReport } from '../lib/tree-move-model';

export function TreeMovePage() {
  const cssOrder = buildTreeMoveReport('css-order');
  const treeMove = buildTreeMoveReport('tree-move');
  const study = getProjectStudy('tree');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Перестройка дерева меняет lifecycle и поведение интерфейса"
        copy="Визуально похожие действия могут вести себя по-разному. Если меняется только layout через CSS, subtree живёт дальше. Если JSX переносится между слотами дерева, React создаёт новый экземпляр."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="CSS reorder"
          value="preserve"
          hint={cssOrder.summary}
          tone="cool"
        />
        <MetricCard label="Tree move" value="remount" hint={treeMove.summary} />
        <MetricCard
          label="Lifecycle"
          value="cleanup → mount"
          hint="Смена slot влияет не только на state, но и на эффекты, refs и фокус."
          tone="accent"
        />
      </div>

      <TreeMoveLab />

      <BeforeAfter
        beforeTitle="При переносе между слотами"
        before="Старый экземпляр удаляется, поэтому local draft и внутренние счётчики обнуляются."
        afterTitle="При смене только layout"
        after="Поддерево остаётся тем же, а значит React сохраняет и state, и refs."
      />

      <Panel className="grid gap-4 lg:grid-cols-2">
        <CodeBlock label="Layout only" code={cssOrder.snippet} />
        <CodeBlock label="Tree rebuild" code={treeMove.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
