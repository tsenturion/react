import { BranchIdentityLab } from '../components/state-identity/BranchIdentityLab';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildBranchIdentityReport } from '../lib/branch-identity-model';
import { getProjectStudy } from '../lib/project-study';

export function BranchIdentityPage() {
  const sameType = buildBranchIdentityReport('same-type');
  const differentType = buildBranchIdentityReport('different-type');
  const study = getProjectStudy('branches');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="Одинаковая ветка сохраняет state, новый type его сбрасывает"
        copy="При условном рендеринге решает не сам факт `if`, а то, какой component type остаётся в том же slot. Один и тот же type сохраняет экземпляр, другой type создаёт новый lifecycle."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Same type"
          value="state stays"
          hint={sameType.summary}
          tone="cool"
        />
        <MetricCard
          label="Different type"
          value="state resets"
          hint={differentType.summary}
        />
        <MetricCard
          label="Lifecycle"
          value="cleanup + mount"
          hint="Смена component type снимает старое поддерево и поднимает новое."
          tone="accent"
        />
      </div>

      <BranchIdentityLab />

      <BeforeAfter
        beforeTitle="Когда type меняется"
        before="Старый экземпляр очищается, а локальные заметки и счётчики начинаются заново."
        afterTitle="Когда type остаётся тем же"
        after="React обновляет props, но local state продолжает жить у того же экземпляра."
      />

      <Panel className="grid gap-4 lg:grid-cols-2">
        <CodeBlock label="Preserve branch" code={sameType.snippet} />
        <CodeBlock label="Reset branch" code={differentType.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
