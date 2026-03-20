import { ArrayStateWorkshop } from '../components/complex-state/ArrayStateWorkshop';
import {
  BeforeAfter,
  CodeBlock,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildArrayStateReport } from '../lib/array-state-model';
import { createChecklistItems } from '../lib/complex-state-domain';
import { getProjectStudy } from '../lib/project-study';

export function ArrayStatePage() {
  const report = buildArrayStateReport(createChecklistItems());
  const study = getProjectStudy('arrays');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="Массивы в state: map, filter, spread и порядок элементов"
        copy="С массивами в состоянии обычно работают через операции, которые создают новый контейнер: добавление, удаление, toggle, reorder. Здесь можно потрогать эти сценарии на живом списке и увидеть, как данные сразу меняют интерфейс."
      />

      <div className="space-y-6">
        <div className="grid gap-3 md:grid-cols-3">
          <MetricCard
            label="Всего элементов"
            value={String(report.total)}
            hint="Массив остаётся обычным JavaScript-массивом, но обновляется без мутации."
            tone="cool"
          />
          <MetricCard
            label="Готовых шагов"
            value={String(report.completed)}
            hint={report.summary}
          />
          <MetricCard
            label="Порядок"
            value="reorder"
            hint="Изменение порядка тоже должно создавать новый массив."
            tone="accent"
          />
        </div>

        <BeforeAfter
          beforeTitle="Методы, которых лучше избегать"
          before={report.avoidMethods.join(', ')}
          afterTitle="Методы для state"
          after={report.goodMethods.join(', ')}
        />

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <Panel className="space-y-4">
            <ListBlock title="Безопасные операции" items={report.goodMethods} />
            <ListBlock title="Частые источники мутации" items={report.avoidMethods} />
          </Panel>

          <div className="space-y-6">
            <ArrayStateWorkshop />
            <CodeBlock label="Array update" code={report.snippet} />
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
