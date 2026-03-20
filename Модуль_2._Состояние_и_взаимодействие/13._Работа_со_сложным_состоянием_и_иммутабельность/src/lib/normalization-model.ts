import type { NormalizedBoardState, NormalizedTask } from './complex-state-domain';

export type NormalizationScenario = 'rename' | 'toggle' | 'move';

export type NormalizationComparison = {
  nestedCopies: number;
  normalizedCopies: number;
  nestedTouched: string[];
  normalizedTouched: string[];
  summary: string;
  snippet: string;
};

export type NormalizedColumnView = {
  id: string;
  title: string;
  tasks: NormalizedTask[];
};

export function buildNormalizedColumns(
  board: NormalizedBoardState,
): NormalizedColumnView[] {
  return board.columnOrder.map((columnId) => {
    const column = board.columnsById[columnId];

    return {
      id: column.id,
      title: column.title,
      tasks: column.taskIds.map((taskId) => board.tasksById[taskId]),
    };
  });
}

export function findTaskColumnId(
  board: NormalizedBoardState,
  taskId: string,
): string | null {
  const entry = board.columnOrder.find((columnId) =>
    board.columnsById[columnId].taskIds.includes(taskId),
  );

  return entry ?? null;
}

export function renameNormalizedTask(
  board: NormalizedBoardState,
  taskId: string,
): NormalizedBoardState {
  const task = board.tasksById[taskId];

  if (!task) {
    return board;
  }

  return {
    ...board,
    tasksById: {
      ...board.tasksById,
      [taskId]: {
        ...task,
        title: `${task.title} +`,
      },
    },
  };
}

export function toggleNormalizedTask(
  board: NormalizedBoardState,
  taskId: string,
): NormalizedBoardState {
  const task = board.tasksById[taskId];

  if (!task) {
    return board;
  }

  return {
    ...board,
    tasksById: {
      ...board.tasksById,
      [taskId]: {
        ...task,
        done: !task.done,
      },
    },
  };
}

export function moveNormalizedTaskToNextColumn(
  board: NormalizedBoardState,
  taskId: string,
): NormalizedBoardState {
  const currentColumnId = findTaskColumnId(board, taskId);

  if (!currentColumnId) {
    return board;
  }

  const currentIndex = board.columnOrder.indexOf(currentColumnId);
  const nextColumnId = board.columnOrder[(currentIndex + 1) % board.columnOrder.length];

  if (!nextColumnId || nextColumnId === currentColumnId) {
    return board;
  }

  return {
    ...board,
    columnsById: {
      ...board.columnsById,
      [currentColumnId]: {
        ...board.columnsById[currentColumnId],
        taskIds: board.columnsById[currentColumnId].taskIds.filter(
          (item) => item !== taskId,
        ),
      },
      [nextColumnId]: {
        ...board.columnsById[nextColumnId],
        taskIds: [...board.columnsById[nextColumnId].taskIds, taskId],
      },
    },
  };
}

export function buildNormalizationComparison(
  scenario: NormalizationScenario,
): NormalizationComparison {
  if (scenario === 'rename') {
    return {
      nestedCopies: 5,
      normalizedCopies: 3,
      nestedTouched: ['board', 'columns[]', 'column', 'tasks[]', 'task'],
      normalizedTouched: ['board', 'tasksById', 'task'],
      summary:
        'При переименовании одной задачи нормализованная схема меняет только entity storage и нужную сущность, без прохода по всему дереву колонок.',
      snippet: [
        'setBoard((current) => ({',
        '  ...current,',
        '  tasksById: {',
        '    ...current.tasksById,',
        '    [taskId]: { ...current.tasksById[taskId], title: nextTitle },',
        '  },',
        '}));',
      ].join('\n'),
    };
  }

  if (scenario === 'toggle') {
    return {
      nestedCopies: 5,
      normalizedCopies: 3,
      nestedTouched: ['board', 'columns[]', 'column', 'tasks[]', 'task'],
      normalizedTouched: ['board', 'tasksById', 'task'],
      summary:
        'Даже флаг `done` меняется точечно: нормализованный state не заставляет заново копировать массивы колонок и их соседей.',
      snippet: [
        'setBoard((current) => ({',
        '  ...current,',
        '  tasksById: {',
        '    ...current.tasksById,',
        '    [taskId]: { ...current.tasksById[taskId], done: !current.tasksById[taskId].done },',
        '  },',
        '}));',
      ].join('\n'),
    };
  }

  return {
    nestedCopies: 6,
    normalizedCopies: 4,
    nestedTouched: [
      'board',
      'columns[]',
      'source column',
      'source tasks[]',
      'target column',
      'target tasks[]',
    ],
    normalizedTouched: ['board', 'columnsById', 'source column', 'target column'],
    summary:
      'Перемещение между колонками в nested-дереве заставляет копировать несколько веток сразу. В нормализованной схеме меняются только два массива id и общая карта колонок.',
    snippet: [
      'setBoard((current) => ({',
      '  ...current,',
      '  columnsById: {',
      '    ...current.columnsById,',
      '    [from]: { ...current.columnsById[from], taskIds: current.columnsById[from].taskIds.filter((id) => id !== taskId) },',
      '    [to]: { ...current.columnsById[to], taskIds: [...current.columnsById[to].taskIds, taskId] },',
      '  },',
      '}));',
    ].join('\n'),
  };
}
