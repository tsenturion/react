import { LegacyRefsLab } from '../components/legacy-react-labs/LegacyRefsLab';
import { Panel, ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { projectStudyByLab } from '../lib/project-study';

export function RefsPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="createRef and imperative DOM"
        title="Как старый React связывал компонент и DOM через createRef и почему ref не должен превращаться в скрытый state"
        copy="Refs в class components нужны там, где React говорит с DOM напрямую: фокус, скролл, uncontrolled input и сторонние imperative integrations. Это полезный bridge, но плохая замена состоянию."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">Ref is an escape hatch</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Как только ref начинает хранить бизнес-данные, интерфейс теряет явную связь
              между логикой и отображением.
            </p>
          </div>
        }
      />

      <LegacyRefsLab />

      <Panel className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-semibold text-slate-900">
            createRef в legacy code
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Обычно живёт как поле класса и обслуживает imperative мост к DOM или старому
            виджету.
          </p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-semibold text-slate-900">Современный эквивалент</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            `useRef` меняет форму API, но не отменяет главное правило: ref не описывает UI
            как state и props.
          </p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-semibold text-slate-900">Граница применения</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Чем больше логики уходит в ref и прямые DOM reads, тем сложнее тестировать и
            поддерживать экран.
          </p>
        </div>
      </Panel>

      <ProjectStudy
        files={projectStudyByLab.refs.files}
        snippets={projectStudyByLab.refs.snippets}
      />
    </div>
  );
}
