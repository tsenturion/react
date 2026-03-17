import pickRecommendedLesson, {
  describeLesson,
  lessonCards,
  moduleKinds,
  type ModuleKind,
} from './js-module-catalog';

export type ModuleGoal = ModuleKind;

export type ModulePlaygroundInput = {
  goal: ModuleGoal;
  readyOnly: boolean;
  limit: number;
};

export const moduleGoals = moduleKinds;

export const buildModulePlayground = ({
  goal,
  readyOnly,
  limit,
}: ModulePlaygroundInput) => {
  const filtered = lessonCards
    .filter((lesson) => (readyOnly ? lesson.ready : true))
    .slice(0, limit);

  const recommendedLesson = pickRecommendedLesson(filtered, goal) ?? null;
  const summary = filtered.map(describeLesson);
  const importPreview = `import pickRecommendedLesson, {
  describeLesson,
  lessonCards,
} from './lib/js-module-catalog';

const filtered = lessonCards.filter((lesson) => lesson.kind === '${goal}');
const recommended = pickRecommendedLesson(filtered, '${goal}');`;

  return {
    visibleLessons: filtered,
    recommendedLesson,
    summary,
    importPreview,
    moduleKinds: [...moduleKinds],
  };
};
