import { StaleClosureLab } from '../components/advanced-effects/StaleClosureLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import {
  buildStaleClosureReport,
  getExpectedCounter,
  getExpectedSetupCount,
} from '../lib/stale-closure-model';
import { getProjectStudy } from '../lib/project-study';

export function StaleClosurePage() {
  const stale = buildStaleClosureReport('stale');
  const deps = buildStaleClosureReport('deps');
  const functional = buildStaleClosureReport('functional');
  const study = getProjectStudy('closures');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="Stale closures и effect, который живёт на старом snapshot"
        copy="Effect создаётся на конкретном render и захватывает его данные. Если внешний процесс живёт дольше одного render-а, он может продолжать читать устаревшие значения. Здесь это видно на интервале и разных способах устранения stale closure."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Stale count after 5 ticks"
          value={String(getExpectedCounter('stale', 5))}
          hint={stale.summary}
          tone="accent"
        />
        <MetricCard
          label="Setups with [count]"
          value={String(getExpectedSetupCount('deps', 5))}
          hint={deps.summary}
          tone="cool"
        />
        <MetricCard
          label="Functional count after 5 ticks"
          value={String(getExpectedCounter('functional', 5))}
          hint={functional.summary}
          tone="dark"
        />
      </div>

      <StaleClosureLab />

      <Panel className="grid gap-4 xl:grid-cols-3">
        <CodeBlock label={stale.title} code={stale.snippet} />
        <CodeBlock label={deps.title} code={deps.snippet} />
        <CodeBlock label={functional.title} code={functional.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
