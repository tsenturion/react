import { Panel, ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { RenderCausesLab } from '../components/performance/RenderCausesLab';
import { renderCauseCards } from '../lib/performance-domain';
import { projectStudyByLab } from '../lib/project-study';

export function RenderCausesPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Render causes"
        title="Ререндер начинается не с «плохо», а с конкретной причины"
        copy="Один и тот же визуальный результат может ререндериться по разным причинам: meaningful prop change, local state, parent state или новый object prop. Сначала нужно назвать причину, а уже потом решать, стоит ли её сужать."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">referential equality matters</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Memo-грань полезна только тогда, когда ей не пробрасывают новый object prop
              без реальной причины.
            </p>
          </div>
        }
      />

      <RenderCausesLab />

      <Panel className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          Четыре типовые причины
        </h3>
        <ul className="space-y-2 text-sm leading-6 text-slate-700">
          {renderCauseCards.map((item) => (
            <li
              key={item}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              {item}
            </li>
          ))}
        </ul>
      </Panel>

      <ProjectStudy {...projectStudyByLab['render-causes']} />
    </div>
  );
}
