import type {
  DuplicatedDirectoryState,
  NormalizedDirectoryState,
} from './state-architecture-domain';
import type { StatusTone } from './learning-model';

export type NormalizationArchitectureReport = {
  tone: StatusTone;
  duplicatedConsistency: string;
  normalizedConsistency: string;
  summary: string;
  snippet: string;
};

export function renameTeacherInDuplicatedDirectory(
  state: DuplicatedDirectoryState,
  teacherId: string,
): DuplicatedDirectoryState {
  return {
    ...state,
    cards: state.cards.map((card) =>
      card.teacherId === teacherId
        ? { ...card, teacherName: `${card.teacherName} +` }
        : card,
    ),
  };
}

export function renameTeacherInNormalizedDirectory(
  state: NormalizedDirectoryState,
  teacherId: string,
): NormalizedDirectoryState {
  const teacher = state.teachersById[teacherId];

  return {
    ...state,
    teachersById: {
      ...state.teachersById,
      [teacherId]: {
        ...teacher,
        name: `${teacher.name} +`,
      },
    },
  };
}

export function buildNormalizationArchitectureReport(
  duplicated: DuplicatedDirectoryState,
  normalized: NormalizedDirectoryState,
): NormalizationArchitectureReport {
  const duplicatedCardName = duplicated.cards.find(
    (card) => card.teacherId === duplicated.spotlightTeacher.id,
  )?.teacherName;
  const normalizedName = normalized.teachersById[normalized.spotlightTeacherId]?.name;
  const duplicatedConsistency =
    duplicatedCardName === duplicated.spotlightTeacher.name ? 'sync' : 'drift';

  return {
    tone: duplicatedConsistency === 'drift' ? 'error' : 'success',
    duplicatedConsistency,
    normalizedConsistency: normalizedName ?? 'missing',
    summary:
      'Normalization здесь нужна не ради формы данных самой по себе, а ради архитектуры: одна сущность живёт в одном месте, а все представления читают её по id без дублирования копий.',
    snippet: [
      'setDirectory((current) => ({',
      '  ...current,',
      '  teachersById: {',
      '    ...current.teachersById,',
      '    [teacherId]: { ...current.teachersById[teacherId], name: nextName },',
      '  },',
      '}));',
    ].join('\n'),
  };
}
