import { NormalizedDirectoryLab } from '../components/state-architecture/NormalizedDirectoryLab';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { getProjectStudy } from '../lib/project-study';
import { buildNormalizationArchitectureReport } from '../lib/normalization-architecture-model';
import {
  createDuplicatedDirectory,
  createNormalizedDirectory,
} from '../lib/state-architecture-domain';

export function NormalizationArchitecturePage() {
  const report = buildNormalizationArchitectureReport(
    createDuplicatedDirectory(),
    createNormalizedDirectory(),
  );
  const study = getProjectStudy('normalize');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Нормализация как архитектурное решение"
        copy="Нормализация полезна не сама по себе, а тогда, когда одна и та же сущность начинает жить копиями в нескольких ветках состояния. Тогда структура state напрямую влияет на устойчивость UI: одна сущность — одно место хранения."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Duplicated branch"
          value={report.duplicatedConsistency}
          hint="cards и spotlight могут разойтись после одного rename."
          tone="accent"
        />
        <MetricCard
          label="Normalized branch"
          value="single entity"
          hint="Все представления читают teacher по id из одного storage."
          tone="cool"
        />
        <MetricCard
          label="Архитектурный эффект"
          value="no manual sync"
          hint={report.summary}
        />
      </div>

      <BeforeAfter
        beforeTitle="Если teacher хранится копиями"
        before="Каждое rename превращается в ручную синхронизацию cards, spotlight и других веток, где встречается тот же teacher."
        afterTitle="Если teacher живёт в entity storage"
        after="UI читает одну и ту же сущность по id, и архитектура не дублирует источник истины."
      />

      <NormalizedDirectoryLab />

      <Panel className="space-y-4">
        <CodeBlock label="Normalized entity update" code={report.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
