import { SelectionDriftLab } from '../components/state-architecture/SelectionDriftLab';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import {
  buildDuplicateStateReport,
  createBadSelectionState,
  createGoodSelectionState,
} from '../lib/duplicate-state-model';
import { getProjectStudy } from '../lib/project-study';
import { createLessonRecords } from '../lib/state-architecture-domain';

export function DuplicateStatePage() {
  const report = buildDuplicateStateReport(
    createBadSelectionState(createLessonRecords()),
    createGoodSelectionState(createLessonRecords()),
  );
  const study = getProjectStudy('duplicate');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="Лишнее состояние и duplicated copies"
        copy="Состояние усложняется не только количеством полей, но и дублированием одной и той же сущности в разных формах. selectedId и selectedTitle рядом почти всегда значат лишнюю точку рассинхрона."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Bad architecture"
          value="id + title copy"
          hint="Одна выбранная сущность дублируется двумя независимыми полями."
          tone="accent"
        />
        <MetricCard
          label="Good architecture"
          value="id only"
          hint="Title и mentor каждый рендер производятся из lessons."
          tone="cool"
        />
        <MetricCard label="Результат" value="single truth" hint={report.summary} />
      </div>

      <BeforeAfter
        beforeTitle="Если хранить selectedTitle отдельно"
        before="Rename или archive начинают требовать ручной синхронизации нескольких полей сразу."
        afterTitle="Если хранить только selectedId"
        after="Выбранный объект остаётся производным, а структура state не дублирует один и тот же факт."
      />

      <SelectionDriftLab />

      <Panel className="space-y-4">
        <CodeBlock label="Derived selected entity" code={report.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
