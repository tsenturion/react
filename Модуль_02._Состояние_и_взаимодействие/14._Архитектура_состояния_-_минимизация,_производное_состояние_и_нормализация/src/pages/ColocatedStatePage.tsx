import { ColocatedStateWorkbench } from '../components/state-architecture/ColocatedStateWorkbench';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildColocationReport } from '../lib/colocated-state-model';
import { getProjectStudy } from '../lib/project-study';
import { createSectionCards } from '../lib/state-architecture-domain';

export function ColocatedStatePage() {
  const report = buildColocationReport(createSectionCards(), 'local', false, 0);
  const study = getProjectStudy('colocated');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="Colocated state и unnecessary hoisting"
        copy="Состояние лучше живёт рядом с местом использования, пока оно действительно нужно только этому leaf-компоненту. Поднимать его вверх стоит не “на всякий случай”, а только когда его знание нужно нескольким веткам или общему summary."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Local mode"
          value="0 root flags"
          hint="Родитель не хранит то, что относится только к карточке."
          tone="cool"
        />
        <MetricCard
          label="Hoisted mode"
          value="N root flags"
          hint="Родитель получает полный контроль, но и дополнительную сложность."
          tone="accent"
        />
        <MetricCard label="Правило" value="nearest owner" hint={report.summary} />
      </div>

      <BeforeAfter
        beforeTitle="Если поднимать state без причины"
        before="Root начинает хранить флаги leaf-компонентов и прокидывать лишние props через дерево."
        afterTitle="Если держать state рядом с местом использования"
        after="Компонентная архитектура остаётся компактной, а сложность поднимается только там, где это оправдано реальным shared knowledge."
      />

      <ColocatedStateWorkbench />

      <Panel className="space-y-4">
        <CodeBlock label="Colocation pattern" code={report.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
