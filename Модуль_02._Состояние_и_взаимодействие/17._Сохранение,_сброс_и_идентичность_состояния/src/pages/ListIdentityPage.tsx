import { ListIdentityLab } from '../components/state-identity/ListIdentityLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { analyzeListIdentity } from '../lib/list-identity-model';
import { getProjectStudy } from '../lib/project-study';

export function ListIdentityPage() {
  const stable = analyzeListIdentity('stable-id', 'reverse');
  const indexBased = analyzeListIdentity('index', 'reverse');
  const versioned = analyzeListIdentity('version', 'stable');
  const study = getProjectStudy('lists');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="В списке `key` решает, у какой сущности сохранится local state"
        copy="В списке состояние строки должно быть связано не с её визуальной позицией, а с самими данными. Именно поэтому стабильный `key` удерживает корректную identity после reorder и filter."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Stable id"
          value={`${stable.identityDriftCount} drift`}
          hint={stable.summary}
          tone="cool"
        />
        <MetricCard
          label="Index key"
          value={`${indexBased.identityDriftCount} drift`}
          hint={indexBased.summary}
        />
        <MetricCard
          label="Version key"
          value={`${versioned.mountedCount} remount`}
          hint={versioned.summary}
          tone="accent"
        />
      </div>

      <ListIdentityLab />

      <Panel className="grid gap-4 lg:grid-cols-2">
        <CodeBlock label="Stable list key" code={stable.snippet} />
        <CodeBlock label="Drifting list key" code={indexBased.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
