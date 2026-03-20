import type { NestedBoardState } from './complex-state-domain';
import type { StatusTone } from './learning-model';

export type NestedStateReport = {
  tone: StatusTone;
  targetLabel: string;
  copiedLayers: string[];
  summary: string;
  snippet: string;
};

export function increaseTaskPointsMutably(
  board: NestedBoardState,
  columnId: string,
  taskId: string,
  delta: number,
): NestedBoardState {
  const column = board.columns.find((item) => item.id === columnId);
  const task = column?.tasks.find((item) => item.id === taskId);

  if (!task) {
    return board;
  }

  task.points += delta;
  return board;
}

export function increaseTaskPointsImmutably(
  board: NestedBoardState,
  columnId: string,
  taskId: string,
  delta: number,
): NestedBoardState {
  return {
    ...board,
    columns: board.columns.map((column) =>
      column.id === columnId
        ? {
            ...column,
            tasks: column.tasks.map((task) =>
              task.id === taskId ? { ...task, points: task.points + delta } : task,
            ),
          }
        : column,
    ),
  };
}

export function getTaskPoints(board: NestedBoardState, columnId: string, taskId: string) {
  return (
    board.columns
      .find((column) => column.id === columnId)
      ?.tasks.find((task) => task.id === taskId)?.points ?? 0
  );
}

export function buildNestedStateReport(
  board: NestedBoardState,
  columnId: string,
  taskId: string,
): NestedStateReport {
  return {
    tone: 'warn',
    targetLabel: `points = ${getTaskPoints(board, columnId, taskId)}`,
    copiedLayers: ['board', 'columns[]', 'column', 'tasks[]', 'task'],
    summary:
      'Во вложенной структуре нужно копировать каждый уровень на пути к изменяемому leaf-узлу. Иначе ссылка наверху не меняется, а React теряет сигнал о корректном обновлении.',
    snippet: [
      'setBoard((current) => ({',
      '  ...current,',
      '  columns: current.columns.map((column) =>',
      '    column.id === targetColumnId',
      '      ? {',
      '          ...column,',
      '          tasks: column.tasks.map((task) =>',
      '            task.id === targetTaskId ? { ...task, points: task.points + 1 } : task,',
      '          ),',
      '        }',
      '      : column,',
      '  ),',
      '}));',
    ].join('\n'),
  };
}
