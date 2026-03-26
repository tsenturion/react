import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { RouteContractsLab } from '../components/external-data-labs/RouteContractsLab';
import { projectStudyByLab } from '../lib/project-study';

export function RouteContractsPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Routes & full-stack"
        title="Route contracts: где выгоднее ловить schema mismatch, чтобы он не расползался по дереву интерфейса"
        copy="Маршрут управляет не только экраном, но и точкой входа данных. Поэтому loader parse, component parse и unsafe cast — это не равные варианты, а разные архитектурные решения с разной ценой для UX и отладки."
        aside={
          <div className="space-y-3">
            <StatusPill tone="error">Parse early</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Чем раньше маршрут блокирует mismatch, тем меньше downstream-кода зависит от
              сырого payload.
            </p>
          </div>
        }
      />

      <Panel>
        <RouteContractsLab />
      </Panel>

      <BeforeAfter
        beforeTitle="Parse inside leaf screen"
        before="Маршрут уже начал рендериться, часть дерева уже предполагает корректный контракт, а ошибка всплывает поздно и локально."
        afterTitle="Parse in loader boundary"
        after="Маршрут принимает решение раньше: либо данные проходят contract check, либо экран вообще не получает невалидный payload."
      />

      <ProjectStudy
        files={projectStudyByLab.routes.files}
        snippets={projectStudyByLab.routes.snippets}
      />
    </div>
  );
}
