import { Panel, ProjectStudy, SectionIntro, StatusPill } from '../components/ui';
import { BottleneckLab } from '../components/performance/BottleneckLab';
import { bottleneckProfiles } from '../lib/performance-domain';
import { projectStudyByLab } from '../lib/project-study';

export function BottlenecksPage() {
  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Bottlenecks"
        title="Лаг создаёт не само действие, а действие плюс цена затронутого subtree"
        copy="Открыть небольшой inspector — дёшево. Открыть его так, чтобы заодно пересчитался большой slow grid, — уже совсем другая история. Сначала ищите дорогое место и только потом решайте, чем именно его лечить."
        aside={
          <div className="space-y-3">
            <StatusPill tone="warn">measure touched surface</StatusPill>
            <p className="text-sm leading-6 text-slate-600">
              Важно не просто видеть ререндер, а понимать, сколько expensive rows он
              задел.
            </p>
          </div>
        }
      />

      <BottleneckLab />

      <Panel className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          Типовые bottleneck-профили
        </h3>
        <div className="grid gap-4 xl:grid-cols-3">
          {bottleneckProfiles.map((item) => (
            <article
              key={item.title}
              className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
            >
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.summary}</p>
            </article>
          ))}
        </div>
      </Panel>

      <ProjectStudy {...projectStudyByLab.bottlenecks} />
    </div>
  );
}
