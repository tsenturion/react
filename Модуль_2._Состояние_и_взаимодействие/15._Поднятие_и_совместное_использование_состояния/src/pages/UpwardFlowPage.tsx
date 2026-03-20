import { ChildParentFlowLab } from '../components/shared-state/ChildParentFlowLab';
import {
  CodeBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { buildBookingViewModel } from '../lib/upward-flow-model';
import { createBookingState } from '../lib/shared-state-domain';
import { getProjectStudy } from '../lib/project-study';

export function UpwardFlowPage() {
  const view = buildBookingViewModel(createBookingState());
  const study = getProjectStudy('flow');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 4"
        title="Передача данных вверх и вниз: child → parent → sibling"
        copy="Child-компоненты не синхронизируют соседей напрямую. Они поднимают изменение вверх через callbacks, а затем owner состояния передаёт новое согласованное значение вниз по props всем зависимым частям интерфейса."
      />

      <div className="space-y-6">
        <div className="grid gap-3 md:grid-cols-3">
          <MetricCard
            label="Seat price"
            value={String(view.seatPrice)}
            hint="Зависит от tier."
            tone="cool"
          />
          <MetricCard
            label="Total"
            value={String(view.totalPrice)}
            hint="Читает то же parent-owned state."
          />
          <MetricCard
            label="Action"
            value={view.actionLabel}
            hint={view.summary}
            tone="accent"
          />
        </div>

        <ChildParentFlowLab />
        <CodeBlock label="Callbacks and props" code={view.snippet} />
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
