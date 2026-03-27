import type { StatusTone } from './learning-model';
import { formatDuration, getCourseById } from './course-domain';

export type ComponentPresetId =
  | 'props-basics'
  | 'children-slots'
  | 'api-design'
  | 'component-testing';

export type FunctionalCardControls = {
  primaryId: ComponentPresetId;
  secondaryId: ComponentPresetId;
  highlighted: boolean;
  compact: boolean;
  showMentor: boolean;
};

export type CourseCardViewModel = {
  title: string;
  trackLabel: string;
  levelLabel: string;
  durationLabel: string;
  summary: string;
  mentorLabel?: string;
  statusLabel: string;
  statusTone: StatusTone;
  highlighted: boolean;
  compact: boolean;
  footerNote: string;
};

export const defaultFunctionalCardControls: FunctionalCardControls = {
  primaryId: 'props-basics',
  secondaryId: 'api-design',
  highlighted: true,
  compact: false,
  showMentor: true,
};

export function buildCourseCardViewModel(
  courseId: ComponentPresetId,
  controls: Pick<FunctionalCardControls, 'highlighted' | 'compact' | 'showMentor'>,
): CourseCardViewModel {
  const course = getCourseById(courseId);

  return {
    title: course.title,
    trackLabel: course.trackLabel,
    levelLabel: course.level === 'base' ? 'Base' : 'Advanced',
    durationLabel: formatDuration(course.durationMinutes),
    summary: course.summary,
    mentorLabel: controls.showMentor ? `Ментор: ${course.mentor}` : undefined,
    statusLabel:
      course.seatsLeft > 10
        ? 'Набор открыт'
        : course.seatsLeft > 0
          ? 'Мест осталось мало'
          : 'Набор закрыт',
    statusTone:
      course.seatsLeft > 10 ? 'success' : course.seatsLeft > 0 ? 'warn' : 'error',
    highlighted: controls.highlighted,
    compact: controls.compact,
    footerNote: `Props управляют карточкой через входные данные, а не через скрытое состояние.`,
  };
}

export function compareCardViewModels(
  primary: CourseCardViewModel,
  secondary: CourseCardViewModel,
) {
  return [
    primary.title !== secondary.title ? 'title' : null,
    primary.trackLabel !== secondary.trackLabel ? 'trackLabel' : null,
    primary.levelLabel !== secondary.levelLabel ? 'levelLabel' : null,
    primary.durationLabel !== secondary.durationLabel ? 'durationLabel' : null,
    primary.summary !== secondary.summary ? 'summary' : null,
    primary.mentorLabel !== secondary.mentorLabel ? 'mentorLabel' : null,
  ].filter((item): item is string => item !== null);
}

export function buildFunctionalSnippet(
  primary: CourseCardViewModel,
  secondary: CourseCardViewModel,
) {
  return [
    '<CourseCard',
    `  title="${primary.title}"`,
    `  trackLabel="${primary.trackLabel}"`,
    `  levelLabel="${primary.levelLabel}"`,
    `  durationLabel="${primary.durationLabel}"`,
    '/>',
    '',
    '<CourseCard',
    `  title="${secondary.title}"`,
    `  trackLabel="${secondary.trackLabel}"`,
    `  levelLabel="${secondary.levelLabel}"`,
    `  durationLabel="${secondary.durationLabel}"`,
    '>',
    '  <span>Дополнительный footer slot</span>',
    '</CourseCard>',
  ].join('\n');
}
