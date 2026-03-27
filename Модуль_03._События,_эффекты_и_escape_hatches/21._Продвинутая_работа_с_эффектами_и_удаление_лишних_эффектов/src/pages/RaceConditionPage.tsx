import { RaceConditionLab } from '../components/advanced-effects/RaceConditionLab';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildRaceReport, getExpectedRaceWinner } from '../lib/race-condition-model';
import { getProjectStudy } from '../lib/project-study';

export function RaceConditionPage() {
  const bad = buildRaceReport('bad');
  const ignore = buildRaceReport('ignore');
  const abort = buildRaceReport('abort');
  const study = getProjectStudy('race');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="Race conditions, stale responses и abort/cancel"
        copy="Когда query меняется быстрее, чем завершаются запросы, внешний мир перестаёт быть линейным. Здесь важно не просто дождаться любого ответа, а гарантировать, что в UI попадёт только актуальный результат."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Bad mode"
          value={getExpectedRaceWinner('bad', 'effect', 'async')}
          hint={bad.summary}
          tone="accent"
        />
        <MetricCard
          label="Ignore"
          value={getExpectedRaceWinner('ignore', 'effect', 'async')}
          hint={ignore.summary}
          tone="cool"
        />
        <MetricCard
          label="Abort"
          value={getExpectedRaceWinner('abort', 'effect', 'async')}
          hint={abort.summary}
          tone="dark"
        />
      </div>

      <RaceConditionLab />

      <BeforeAfter
        beforeTitle="Если оставить без cleanup"
        before="Последний завершившийся ответ побеждает, даже если он относится к уже устаревшему query."
        afterTitle="Если контролировать stale requests"
        after="UI остаётся связанным только с актуальным query, а устаревшие процессы либо игнорируются, либо отменяются."
      />

      <Panel className="grid gap-4 xl:grid-cols-3">
        <CodeBlock label={bad.title} code={bad.snippet} />
        <CodeBlock label={ignore.title} code={ignore.snippet} />
        <CodeBlock label={abort.title} code={abort.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
