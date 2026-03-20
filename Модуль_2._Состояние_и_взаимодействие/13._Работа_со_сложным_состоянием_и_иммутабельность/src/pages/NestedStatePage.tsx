import { NestedBoardEditor } from '../components/complex-state/NestedBoardEditor';
import {
  BeforeAfter,
  CodeBlock,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { createNestedBoard } from '../lib/complex-state-domain';
import { buildNestedStateReport } from '../lib/nested-state-model';
import { getProjectStudy } from '../lib/project-study';

export function NestedStatePage() {
  const report = buildNestedStateReport(
    createNestedBoard(),
    'doing',
    'task-immutability',
  );
  const study = getProjectStudy('nested');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 3"
        title="Вложенные структуры: update leaf-узла без потери сигнала для React"
        copy="Чем глубже структура состояния, тем внимательнее нужно обновлять путь к изменяемому leaf-узлу. Здесь можно увидеть, как nested mutation прячется от React, и почему копировать приходится не только саму задачу, но и все контейнеры над ней."
      />

      <div className="space-y-6">
        <div className="grid gap-3 md:grid-cols-3">
          <MetricCard
            label="Target"
            value={report.targetLabel}
            hint="Меняется одна вложенная задача внутри board."
            tone="cool"
          />
          <MetricCard
            label="Скопированных слоёв"
            value={String(report.copiedLayers.length)}
            hint="Каждый уровень по пути к leaf-узлу получает новую ссылку."
          />
          <MetricCard
            label="Риск"
            value="nested mutation"
            hint={report.summary}
            tone="accent"
          />
        </div>

        <BeforeAfter
          beforeTitle="Если мутировать leaf-узел"
          before="points изменится в данных, но root board останется той же ссылкой и React может не показать новый UI."
          afterTitle="Если копировать путь до leaf"
          after="Каждый контейнер на пути к задаче получает новую ссылку, и следующий рендер строится предсказуемо."
        />

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <Panel className="space-y-4">
            <ListBlock title="Что приходится копировать" items={report.copiedLayers} />
          </Panel>

          <div className="space-y-6">
            <NestedBoardEditor />
            <CodeBlock label="Nested update" code={report.snippet} />
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
