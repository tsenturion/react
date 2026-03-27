import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { CreateElementLab } from '../components/legacy-api-labs/CreateElementLab';
import { projectStudyByLab } from '../lib/project-study';

export function CreateElementPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="createElement"
        title="createElement показывает низкоуровневую модель React: полезно для runtime factories, но редко выгоднее обычного JSX"
        copy="JSX скрывает под собой tree construction через createElement. В современном коде обычно лучше оставаться на уровне JSX, но понимание createElement помогает читать generated UI, registries и старые runtime factories. Поэтому здесь важно увидеть, что именно этот API делает, и почему он редко нужен вручную в everyday UI."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">Low-level API</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              createElement ценен как модель мышления и как инструмент для truly dynamic
              trees, а не как замена JSX по умолчанию.
            </p>
          </div>
        }
      />

      <CreateElementLab />

      <Panel className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          Когда createElement оправдан
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Оправданно
            </p>
            <p className="mt-3 text-sm leading-6 text-emerald-950">
              UI factory строится из descriptors, registry или code generation, где tree
              реально рождается на лету.
            </p>
          </div>
          <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
              Неоправданно
            </p>
            <p className="mt-3 text-sm leading-6 text-rose-950">
              Обычный предсказуемый экран переписан на createElement только ради
              “понимания React internals”, хотя JSX делает то же значительно яснее.
            </p>
          </div>
        </div>
      </Panel>

      <BeforeAfter
        beforeTitle="Низкоуровневая factory"
        before="Компонент собирает дерево вручную, и каждый узел приходится описывать через createElement."
        afterTitle="Обычный JSX"
        after="Когда структура заранее известна, JSX лучше выражает иерархию, семантику и намерение разработчика."
      />

      <ProjectStudy
        files={projectStudyByLab.create.files}
        snippets={projectStudyByLab.create.snippets}
      />
    </div>
  );
}
