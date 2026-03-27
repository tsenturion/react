import {
  getScenarioCourses,
  type CompositionScenario,
} from '../../lib/composition-model';
import {
  buildCourseCardViewModel,
  type ComponentPresetId,
} from '../../lib/component-props-model';
import { CourseCard } from './CourseCard';
import { SlotFrame } from './SlotFrame';

function StatsStrip({ labels }: { labels: readonly string[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {labels.map((item) => (
        <div
          key={item}
          className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700"
        >
          {item}
        </div>
      ))}
    </div>
  );
}

export function ComposedDashboard({ scenario }: { scenario: CompositionScenario }) {
  const cards = getScenarioCourses(scenario.courseIds).map((course) =>
    buildCourseCardViewModel(course.id as ComponentPresetId, {
      highlighted: false,
      compact: scenario.compact,
      showMentor: true,
    }),
  );

  return (
    <div className="space-y-6">
      <SlotFrame
        eyebrow={scenario.eyebrow}
        title={scenario.title}
        description={scenario.announcement}
        aside={
          scenario.showSidebar ? (
            <div className="space-y-3">
              <p className="font-semibold text-slate-900">Sidebar</p>
              {scenario.sidebarNotes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
          ) : undefined
        }
        footer={`Переиспользованных строительных блоков: ${scenario.reusedComponentCount}.`}
      >
        <StatsStrip labels={scenario.statLabels} />
        <div className="grid gap-4 lg:grid-cols-2">
          {cards.map((card) => (
            <CourseCard key={card.title} {...card}>
              <span>
                Этот footer slot передан снаружи и не зашит в сам компонент карточки.
              </span>
            </CourseCard>
          ))}
        </div>
      </SlotFrame>
    </div>
  );
}
