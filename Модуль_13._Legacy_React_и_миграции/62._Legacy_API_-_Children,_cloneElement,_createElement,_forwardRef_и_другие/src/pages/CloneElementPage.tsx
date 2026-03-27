import {
  BeforeAfter,
  Panel,
  ProjectStudy,
  SectionIntro,
  StatusPill,
} from '../components/ui';
import { CloneElementLab } from '../components/legacy-api-labs/CloneElementLab';
import { projectStudyByLab } from '../lib/project-study';

export function CloneElementPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="cloneElement"
        title="cloneElement даёт мощный adapter-механизм, но цена почти всегда платится прозрачностью контракта"
        copy="Этот API позволяет модифицировать уже созданный React element: подмешивать props, переопределять обработчики и визуальные флаги. Проблема в том, что точка изменения становится неочевидной. Поэтому здесь важно не только увидеть, как cloneElement работает, но и в каких местах он начинает разрушать reasoning."
        aside={
          <div className="space-y-3">
            <StatusPill tone="error">Implicit injection</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Если поведение ребёнка меняется не через его API, а через внешний clone,
              отладка становится заметно дороже.
            </p>
          </div>
        }
      />

      <CloneElementLab />

      <Panel className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Граница уместности</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Где ещё встречается</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Старые toolbars, slot adapters, menu-item wrappers и design-system shells.
            </p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Что ломается первым</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Неявно перезаписываются `onClick`, `className`, `aria-*` и иногда refs.
            </p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Что обычно лучше</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Явные props, render props, context или выделенный wrapper с собственным API.
            </p>
          </div>
        </div>
      </Panel>

      <BeforeAfter
        beforeTitle="cloneElement adapter"
        before="Родитель незаметно меняет child element, и реальный контракт распределяется между двумя местами."
        afterTitle="Явный wrapper API"
        after="Новый компонент сам принимает параметры и решает, как передать их внутрь. Data flow и ownership читаются заметно проще."
      />

      <ProjectStudy
        files={projectStudyByLab.clone.files}
        snippets={projectStudyByLab.clone.snippets}
      />
    </div>
  );
}
