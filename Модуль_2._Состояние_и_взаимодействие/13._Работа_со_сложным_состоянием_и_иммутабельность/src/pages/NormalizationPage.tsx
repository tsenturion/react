import { NormalizedTaskBoard } from '../components/complex-state/NormalizedTaskBoard';
import {
  BeforeAfter,
  CodeBlock,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildNormalizationComparison } from '../lib/normalization-model';
import { getProjectStudy } from '../lib/project-study';

export function NormalizationPage() {
  const report = buildNormalizationComparison('move');
  const study = getProjectStudy('normalize');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Структурирование и нормализация данных"
        copy="Когда состояние начинает хранить связанные сущности, одна большая nested-структура быстро становится тяжёлой в обновлении. Нормализация не заменяет React, а делает состояние проще: задачи живут отдельно, порядок отдельно, а update затрагивает только действительно нужные ветки."
      />

      <div className="space-y-6">
        <div className="grid gap-3 md:grid-cols-3">
          <MetricCard
            label="Nested copies"
            value={String(report.nestedCopies)}
            hint="При move nested-схема копирует сразу несколько связанных веток."
            tone="accent"
          />
          <MetricCard
            label="Normalized copies"
            value={String(report.normalizedCopies)}
            hint="Нормализованный state меняет только storage и затронутые сущности."
            tone="cool"
          />
          <MetricCard
            label="Практический эффект"
            value="точечные updates"
            hint={report.summary}
          />
        </div>

        <BeforeAfter
          beforeTitle="Если хранить всё глубоко вложенным"
          before="Даже одно перемещение между колонками цепляет много соседних веток и делает update тяжелее для чтения и поддержки."
          afterTitle="Если разделить entities и order"
          after={report.summary}
        />

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <Panel className="space-y-4">
            <ListBlock title="Nested touched" items={report.nestedTouched} />
            <ListBlock title="Normalized touched" items={report.normalizedTouched} />
          </Panel>

          <div className="space-y-6">
            <NormalizedTaskBoard />
            <CodeBlock label="Normalized update" code={report.snippet} />
          </div>
        </div>
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
