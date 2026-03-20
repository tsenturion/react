import type { LessonRecord } from './state-architecture-domain';
import type { StatusTone } from './learning-model';

export type BadSelectionState = {
  lessons: LessonRecord[];
  selectedId: string | null;
  selectedTitle: string | null;
  selectedMentor: string | null;
};

export type GoodSelectionState = {
  lessons: LessonRecord[];
  selectedId: string | null;
};

export type DuplicateStateReport = {
  tone: StatusTone;
  badLabel: string;
  goodLabel: string;
  summary: string;
  snippet: string;
};

export function createBadSelectionState(lessons: LessonRecord[]): BadSelectionState {
  const selected = lessons[0] ?? null;

  return {
    lessons,
    selectedId: selected?.id ?? null,
    selectedTitle: selected?.title ?? null,
    selectedMentor: selected?.mentor ?? null,
  };
}

export function createGoodSelectionState(lessons: LessonRecord[]): GoodSelectionState {
  return {
    lessons,
    selectedId: lessons[0]?.id ?? null,
  };
}

export function renameLesson(lessons: LessonRecord[], lessonId: string): LessonRecord[] {
  return lessons.map((lesson) =>
    lesson.id === lessonId ? { ...lesson, title: `${lesson.title} +` } : lesson,
  );
}

export function archiveLesson(lessons: LessonRecord[], lessonId: string): LessonRecord[] {
  return lessons.filter((lesson) => lesson.id !== lessonId);
}

export function deriveSelectedLesson(
  lessons: LessonRecord[],
  selectedId: string | null,
): LessonRecord | null {
  if (!selectedId) {
    return null;
  }

  return lessons.find((lesson) => lesson.id === selectedId) ?? null;
}

export function buildDuplicateStateReport(
  badState: BadSelectionState,
  goodState: GoodSelectionState,
): DuplicateStateReport {
  const goodSelected = deriveSelectedLesson(goodState.lessons, goodState.selectedId);
  const badSelected = deriveSelectedLesson(badState.lessons, badState.selectedId);
  const badLabel = badSelected?.title === badState.selectedTitle ? 'sync' : 'drift';

  return {
    tone: badLabel === 'drift' ? 'error' : 'success',
    badLabel,
    goodLabel: goodSelected ? goodSelected.title : 'ничего не выбрано',
    summary:
      'Если хранить selectedId и отдельную копию selectedTitle, архитектура вынуждает синхронизировать их вручную. Намного устойчивее хранить один id и каждый рендер производить выбранную сущность из списка.',
    snippet: [
      'const selectedLesson = lessons.find(',
      '  (lesson) => lesson.id === selectedId,',
      ');',
      '',
      'return <h3>{selectedLesson?.title ?? "ничего не выбрано"}</h3>;',
    ].join('\n'),
  };
}
