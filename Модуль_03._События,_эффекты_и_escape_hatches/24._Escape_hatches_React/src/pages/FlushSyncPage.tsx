import { FlushSyncLab } from '../components/escape-hatches/FlushSyncLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildFlushSyncReport, simulateFlushSyncCounts } from '../lib/flush-sync-model';
import { getProjectStudy } from '../lib/project-study';

export function FlushSyncPage() {
  const rareReport = buildFlushSyncReport('rare');
  const staleReport = buildFlushSyncReport('scroll');
  const antiReport = buildFlushSyncReport('anti');
  const sample = simulateFlushSyncCounts(4);
  const study = getProjectStudy('flush');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="flushSync и редкие синхронные обновления"
        copy="flushSync не нужен для обычного интерфейсного потока. Его зона применения намного уже: сначала заставить React срочно закоммитить DOM, а потом immediately прочитать этот DOM в том же обработчике, например для измерения или scroll after append."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Normal immediate"
          value={String(sample.normalImmediateCount)}
          hint={staleReport.summary}
          tone="cool"
        />
        <MetricCard
          label="Flush immediate"
          value={String(sample.flushImmediateCount)}
          hint={rareReport.summary}
          tone="accent"
        />
        <MetricCard
          label="Architectural warning"
          value="not default"
          hint={antiReport.summary}
          tone="dark"
        />
      </div>

      <FlushSyncLab />

      <Panel className="grid gap-4 xl:grid-cols-3">
        <CodeBlock label={rareReport.title} code={rareReport.snippet} />
        <CodeBlock label={staleReport.title} code={staleReport.snippet} />
        <CodeBlock label={antiReport.title} code={antiReport.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
