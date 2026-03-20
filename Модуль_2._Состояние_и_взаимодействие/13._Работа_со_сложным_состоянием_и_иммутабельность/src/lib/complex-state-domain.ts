export type LessonSettings = {
  owner: string;
  theme: 'light' | 'dark';
  notifications: boolean;
  density: 'compact' | 'comfortable';
};

export function createLessonSettings(): LessonSettings {
  return {
    owner: 'Практикум по состоянию',
    theme: 'light',
    notifications: true,
    density: 'comfortable',
  };
}

export type ChecklistItem = {
  id: string;
  title: string;
  done: boolean;
};

export function createChecklistItems(): ChecklistItem[] {
  return [
    { id: 'step-1', title: 'Разобрать объект в state', done: true },
    { id: 'step-2', title: 'Переписать update массива через map', done: false },
    { id: 'step-3', title: 'Убрать прямую мутацию nested task', done: false },
  ];
}

export type BoardTask = {
  id: string;
  title: string;
  points: number;
  assignee: { name: string };
  tags: string[];
};

export type BoardColumn = {
  id: string;
  title: string;
  tasks: BoardTask[];
};

export type NestedBoardState = {
  title: string;
  columns: BoardColumn[];
};

export function createNestedBoard(): NestedBoardState {
  return {
    title: 'План переработки lesson board',
    columns: [
      {
        id: 'backlog',
        title: 'Backlog',
        tasks: [
          {
            id: 'task-schema',
            title: 'Нормализовать схему курса',
            points: 3,
            assignee: { name: 'Анна' },
            tags: ['entities', 'data'],
          },
        ],
      },
      {
        id: 'doing',
        title: 'In Progress',
        tasks: [
          {
            id: 'task-immutability',
            title: 'Исправить nested update',
            points: 2,
            assignee: { name: 'Лев' },
            tags: ['immutability', 'react'],
          },
          {
            id: 'task-sharing',
            title: 'Проверить reference reuse',
            points: 1,
            assignee: { name: 'Мира' },
            tags: ['perf'],
          },
        ],
      },
    ],
  };
}

export type HistorySnapshot = {
  id: string;
  title: string;
  revision: number;
  reviewers: number;
};

export function createHistorySnapshots(): HistorySnapshot[] {
  return [
    {
      id: 'snapshot-1',
      title: 'Черновик r1',
      revision: 1,
      reviewers: 1,
    },
  ];
}

export type NormalizedTask = {
  id: string;
  title: string;
  done: boolean;
  points: number;
};

export type NormalizedColumn = {
  id: string;
  title: string;
  taskIds: string[];
};

export type NormalizedBoardState = {
  columnOrder: string[];
  columnsById: Record<string, NormalizedColumn>;
  tasksById: Record<string, NormalizedTask>;
};

export function createNormalizedBoard(): NormalizedBoardState {
  return {
    columnOrder: ['backlog', 'doing', 'done'],
    columnsById: {
      backlog: { id: 'backlog', title: 'Backlog', taskIds: ['task-state'] },
      doing: { id: 'doing', title: 'Doing', taskIds: ['task-tree'] },
      done: { id: 'done', title: 'Done', taskIds: ['task-array'] },
    },
    tasksById: {
      'task-state': {
        id: 'task-state',
        title: 'Разделить сложный state на понятные сущности',
        done: false,
        points: 2,
      },
      'task-tree': {
        id: 'task-tree',
        title: 'Упростить update дерева компонентов',
        done: false,
        points: 3,
      },
      'task-array': {
        id: 'task-array',
        title: 'Переписать массив без splice',
        done: true,
        points: 1,
      },
    },
  };
}

export type ReferenceItem = {
  id: string;
  title: string;
  score: number;
  owner: { name: string };
};

export function createReferenceItems(): ReferenceItem[] {
  return [
    { id: 'item-1', title: 'Object update', score: 2, owner: { name: 'Анна' } },
    { id: 'item-2', title: 'Array toggle', score: 3, owner: { name: 'Борис' } },
    { id: 'item-3', title: 'Nested copy chain', score: 1, owner: { name: 'Вера' } },
    { id: 'item-4', title: 'History snapshots', score: 4, owner: { name: 'Глеб' } },
    { id: 'item-5', title: 'Normalized entities', score: 2, owner: { name: 'Дарья' } },
    { id: 'item-6', title: 'Structural sharing', score: 5, owner: { name: 'Егор' } },
  ];
}
