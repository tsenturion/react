import {
  createBlueprintPresets,
  type BlueprintPresetId,
} from './interface-practice-domain';

export type BlueprintPlan = {
  title: string;
  brief: string;
  components: readonly string[];
  state: readonly string[];
  derived: readonly string[];
  events: readonly string[];
  summary: string;
  snippet: string;
};

export function buildBlueprintPlan(id: BlueprintPresetId): BlueprintPlan {
  const preset = createBlueprintPresets().find((item) => item.id === id);

  if (!preset) {
    throw new Error(`Неизвестный preset: ${id}`);
  }

  if (id === 'course-console') {
    return {
      title: preset.title,
      brief: preset.brief,
      components: [
        'CourseWorkbench',
        'WorkbenchToolbar',
        'TrackTabs',
        'SummaryStrip',
        'LessonGrid',
        'LessonDetails',
      ],
      state: ['query', 'activeTrack', 'selectedId', 'draftsById'],
      derived: ['visibleLessons', 'selectedLesson', 'summary'],
      events: ['onQueryChange', 'onTrackChange', 'onSelectLesson', 'onDraftChange'],
      summary:
        'Этот preset почти совпадает с текущим проектом: один экран, общий owner state и несколько sibling-компонентов, читающих derived values.',
      snippet: [
        '<CourseWorkbench>',
        '  <WorkbenchToolbar />',
        '  <LessonGrid />',
        '  <LessonDetails />',
        '</CourseWorkbench>',
      ].join('\n'),
    };
  }

  if (id === 'review-desk') {
    return {
      title: preset.title,
      brief: preset.brief,
      components: [
        'ReviewDesk',
        'QueueSummary',
        'ReviewQueue',
        'RequestDetails',
        'DecisionLog',
      ],
      state: ['selectedRequestId', 'activeTab'],
      derived: ['queueCounters', 'selectedRequest'],
      events: ['onSelectRequest', 'onApprove', 'onReject'],
      summary:
        'Здесь уже важно отделить state выбора и события решений от derived counters и activity feed.',
      snippet: [
        '<ReviewDesk>',
        '  <QueueSummary />',
        '  <ReviewQueue />',
        '  <RequestDetails />',
        '  <DecisionLog />',
        '</ReviewDesk>',
      ].join('\n'),
    };
  }

  return {
    title: preset.title,
    brief: preset.brief,
    components: [
      'ProgressBoard',
      'ModuleFilter',
      'LaneColumn',
      'LessonCard',
      'AnalyticsPanel',
    ],
    state: ['activeModule'],
    derived: ['plannedItems', 'activeItems', 'doneItems', 'analytics'],
    events: ['onFilterModule', 'onMoveCard'],
    summary:
      'Текстовый макет сразу подсказывает, что колонки и аналитика не обязаны быть самостоятельным state: они строятся из одной коллекции карточек.',
    snippet: [
      '<ProgressBoard>',
      '  <ModuleFilter />',
      '  <LaneColumn status="planned" />',
      '  <LaneColumn status="active" />',
      '  <LaneColumn status="done" />',
      '  <AnalyticsPanel />',
      '</ProgressBoard>',
    ].join('\n'),
  };
}
