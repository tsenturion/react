import { DerivedStateDriftLab } from '../components/state-architecture/DerivedStateDriftLab';
import {
  BeforeAfter,
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import {
  buildDerivedStateReport,
  createBadPricingState,
} from '../lib/derived-state-model';
import { getProjectStudy } from '../lib/project-study';
import { createPricingLines } from '../lib/state-architecture-domain';

export function DerivedStatePage() {
  const report = buildDerivedStateReport(createBadPricingState(createPricingLines()));
  const study = getProjectStudy('derived');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 2"
        title="Derived state: когда данные лучше вычислять, а не хранить"
        copy="Totals, counts и filtered collections часто выглядят как “удобные поля”, но архитектурно это производные значения. Если сохранить их рядом с raw данными, каждый update превращается в ручную синхронизацию."
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Bad shape"
          value="lines + storedSubtotal"
          hint="Одна бизнес-сущность начинает жить в двух формах сразу."
          tone="accent"
        />
        <MetricCard
          label="Good shape"
          value="lines only"
          hint="Summary вычисляется из lines в момент рендера."
          tone="cool"
        />
        <MetricCard label="Цена ошибки" value="manual sync" hint={report.summary} />
      </div>

      <BeforeAfter
        beforeTitle="Если totals хранить в state"
        before="Каждый change lines обязан обновить и storedSubtotal, и storedLineCount. Любой пропущенный шаг создаёт рассинхрон."
        afterTitle="Если totals производить из lines"
        after="Достаточно обновить только source of truth. Все totals пересчитаются автоматически."
      />

      <DerivedStateDriftLab />

      <Panel className="space-y-4">
        <CodeBlock label="Derived summary" code={report.snippet} />
      </Panel>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
