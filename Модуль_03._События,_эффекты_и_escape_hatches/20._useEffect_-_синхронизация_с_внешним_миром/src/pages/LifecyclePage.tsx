import { LifecycleLab } from '../components/effects/LifecycleLab';
import {
  CodeBlock,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildLifecycleReport } from '../lib/effect-lifecycle-model';
import { getProjectStudy } from '../lib/project-study';

export function LifecyclePage() {
  const complete = buildLifecycleReport('complete');
  const missing = buildLifecycleReport('missing-room');
  const study = getProjectStudy('lifecycle');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="Dependencies и lifecycle эффекта задают границы синхронизации"
        copy="Effect запускается на mount, затем перед каждым повторным setup сначала выполняет cleanup старой версии, и только потом подключает новую. Всё это полностью зависит от того, какие dependencies вы указали."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Mount"
          value="setup"
          hint="Первое подключение effect происходит после появления компонента в дереве."
          tone="cool"
        />
        <MetricCard
          label="Rerun"
          value="cleanup → setup"
          hint="При изменении зависимости React сначала снимает старую синхронизацию, затем создаёт новую."
        />
        <MetricCard
          label="Missing dep"
          value="stale sync"
          hint={missing.summary}
          tone="accent"
        />
      </div>

      <LifecycleLab />

      <Panel className="grid gap-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <ListBlock title="Как читать lifecycle" items={complete.consequences} />
        <CodeBlock label={missing.title} code={missing.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
