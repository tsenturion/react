import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { ChildrenApiLab } from '../components/legacy-api-labs/ChildrenApiLab';
import { projectStudyByLab } from '../lib/project-study';

export function ChildrenPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Children API"
        title="Children как opaque structure: полезно для slot-like patterns, но опасно там, где вы начинаете ожидать финальное дерево"
        copy="Children API помогает нормализовать и проверять входной набор children, но не раскрывает subtree вложенных компонентов. Поэтому важно видеть границу: это инструмент для shape-checking и адаптации slots, а не способ анализировать то, что реально окажется в DOM после render."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">Opaque structure</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Самая частая ошибка в этой теме: ожидать, что `Children` знает больше, чем
              ему реально передали в `props.children`.
            </p>
          </div>
        }
      />

      <ChildrenApiLab />

      <Panel className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">
          Когда Children API уместен
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Хороший сценарий
            </p>
            <p className="mt-3 text-sm leading-6 text-emerald-950">
              Нормализовать children, проверить single-slot контракт или безопасно
              отфильтровать только валидные React elements.
            </p>
          </div>
          <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
              Плохой сценарий
            </p>
            <p className="mt-3 text-sm leading-6 text-rose-950">
              Пытаться через Children понять внутренний render composite children или
              строить сложную бизнес-логику вокруг неявной структуры descendants.
            </p>
          </div>
        </div>
      </Panel>

      <BeforeAfter
        beforeTitle="Неявный children-driven API"
        before="Компонент принимает произвольные children и пытается угадать структуру интерфейса по их форме."
        afterTitle="Явный API"
        after="Компонент получает slots, массив данных или context и поэтому выражает структуру и ответственность явно."
      />

      <ProjectStudy
        files={projectStudyByLab.children.files}
        snippets={projectStudyByLab.children.snippets}
      />
    </div>
  );
}
