import type { StatusTone } from './learning-model';

export type ClassificationChoices = {
  filteredInState: boolean;
  summaryInState: boolean;
  selectedObjectInState: boolean;
};

export type ConcernRow = {
  name: string;
  kind: 'data' | 'state' | 'derived' | 'event' | 'duplicated';
  note: string;
};

export type DataFlowReport = {
  tone: StatusTone;
  summary: string;
  riskCount: number;
  rows: ConcernRow[];
  snippet: string;
};

export function buildDataFlowReport(choices: ClassificationChoices): DataFlowReport {
  const rows: ConcernRow[] = [
    {
      name: 'lessons',
      kind: 'data',
      note: 'Исходная коллекция экрана.',
    },
    {
      name: 'query',
      kind: 'state',
      note: 'Меняется от пользовательского ввода.',
    },
    {
      name: 'activeTrack',
      kind: 'state',
      note: 'Меняется от пользовательского выбора.',
    },
    choices.selectedObjectInState
      ? {
          name: 'selectedLesson',
          kind: 'duplicated',
          note: 'Лучше хранить selectedId, а объект находить по данным.',
        }
      : {
          name: 'selectedId',
          kind: 'state',
          note: 'Минимальный state для текущего выбора.',
        },
    choices.filteredInState
      ? {
          name: 'filteredLessons',
          kind: 'duplicated',
          note: 'Это derived collection, она уже вычисляется из lessons + query + activeTrack.',
        }
      : {
          name: 'filteredLessons',
          kind: 'derived',
          note: 'Коллекция вычисляется при render, а не хранится отдельно.',
        },
    choices.summaryInState
      ? {
          name: 'summaryCounters',
          kind: 'duplicated',
          note: 'Сводку лучше строить из текущей коллекции, иначе она быстро дрейфует.',
        }
      : {
          name: 'summaryCounters',
          kind: 'derived',
          note: 'Сводка вычисляется из lessons и filteredLessons.',
        },
    {
      name: 'toggleFavorite',
      kind: 'event',
      note: 'Событие, которое меняет lessons state.',
    },
  ];

  const riskCount = rows.filter((row) => row.kind === 'duplicated').length;

  return {
    tone: riskCount === 0 ? 'success' : riskCount === 1 ? 'warn' : 'error',
    summary:
      riskCount === 0
        ? 'Структура экрана минимальна: state хранит только то, что нельзя восстановить из других данных.'
        : 'Часть значений хранится как state, хотя это уже производные вычисления. Такой экран быстрее начинает расходиться.',
    riskCount,
    rows,
    snippet: [
      'const visibleLessons = filterLessons(lessons, query, activeTrack);',
      'const selectedLesson = lessons.find((lesson) => lesson.id === selectedId) ?? null;',
      'const summary = buildWorkbenchSummary(lessons, visibleLessons, selectedId);',
    ].join('\n'),
  };
}
