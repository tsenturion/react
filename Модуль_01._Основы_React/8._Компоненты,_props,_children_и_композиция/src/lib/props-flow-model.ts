import { courseCatalog, getTrackLabel, type TrackId } from './course-domain';

export type Density = 'comfortable' | 'compact';
export type Emphasis = 'availability' | 'mentor' | 'duration';
export type LastChanged = 'track' | 'density' | 'availability' | 'emphasis';

export type FlowState = {
  track: TrackId | 'all';
  density: Density;
  showOnlyOpen: boolean;
  emphasis: Emphasis;
};

export type FlowNode = {
  name: string;
  note: string;
  receivedProps: string[];
  children: FlowNode[];
};

export type FlowReport = {
  visibleLessonCount: number;
  affectedComponents: string[];
  summary: string;
  snippet: string;
  tree: FlowNode;
};

export const defaultFlowState: FlowState = {
  track: 'all',
  density: 'comfortable',
  showOnlyOpen: false,
  emphasis: 'availability',
};

export function buildFlowReport(state: FlowState, lastChanged: LastChanged): FlowReport {
  const visibleCourses = courseCatalog.filter((course) =>
    state.track === 'all' ? true : course.trackId === state.track,
  );

  const filteredCourses = visibleCourses.filter((course) =>
    state.showOnlyOpen ? course.seatsLeft > 0 : true,
  );

  const affectedByChange: Record<LastChanged, string[]> = {
    track: ['CurriculumWorkspace', 'TrackColumn', 'LessonEntry'],
    density: ['TrackColumn', 'LessonEntry'],
    availability: ['TrackColumn', 'LessonEntry'],
    emphasis: ['WorkspaceHeader', 'LessonEntry'],
  };

  return {
    visibleLessonCount: filteredCourses.length,
    affectedComponents: affectedByChange[lastChanged],
    summary:
      lastChanged === 'track'
        ? `Изменение track перестраивает всё поддерево выбранного направления: ${getTrackLabel(state.track)}.`
        : `Изменение ${lastChanged} затрагивает только те компоненты, которые реально получают этот prop.`,
    snippet: [
      '<CurriculumWorkspace',
      `  track="${state.track}"`,
      `  density="${state.density}"`,
      `  showOnlyOpen={${String(state.showOnlyOpen)}}`,
      `  emphasis="${state.emphasis}"`,
      '/>',
    ].join('\n'),
    tree: {
      name: 'CurriculumWorkspace',
      note: 'Верхний компонент владеет состоянием фильтрации и передаёт props дальше.',
      receivedProps: [
        `track: ${state.track}`,
        `density: ${state.density}`,
        `showOnlyOpen: ${String(state.showOnlyOpen)}`,
        `emphasis: ${state.emphasis}`,
      ],
      children: [
        {
          name: 'WorkspaceHeader',
          note: 'Показывает активный фильтр и summary.',
          receivedProps: [
            `trackLabel: ${getTrackLabel(state.track)}`,
            `emphasis: ${state.emphasis}`,
          ],
          children: [],
        },
        ...filteredCourses.map((course) => ({
          name: 'TrackColumn',
          note: 'Группирует данные для конкретного направления.',
          receivedProps: [
            `trackLabel: ${course.trackLabel}`,
            `density: ${state.density}`,
            `showOnlyOpen: ${String(state.showOnlyOpen)}`,
          ],
          children: [
            {
              name: 'LessonEntry',
              note: 'Локальный компонент получает уже конкретные данные карточки.',
              receivedProps: [
                `title: ${course.title}`,
                `mentor: ${course.mentor}`,
                `seatsLeft: ${course.seatsLeft}`,
                `emphasis: ${state.emphasis}`,
              ],
              children: [],
            },
          ],
        })),
      ],
    },
  };
}
