import type { PlanningTask } from './state-architecture-domain';

export type MinimalStateReport = {
  total: number;
  completed: number;
  visible: number;
  pendingEstimate: number;
  summary: string;
  snippet: string;
};

export function appendPlanningTask(tasks: PlanningTask[]): PlanningTask[] {
  const nextNumber = tasks.length + 1;

  return [
    ...tasks,
    {
      id: `task-${nextNumber}`,
      title: `Новый архитектурный шаг ${nextNumber}`,
      done: false,
      track: 'state',
      estimate: 1,
    },
  ];
}

export function togglePlanningTask(
  tasks: PlanningTask[],
  taskId: string,
): PlanningTask[] {
  return tasks.map((task) => (task.id === taskId ? { ...task, done: !task.done } : task));
}

export function getVisiblePlanningTasks(
  tasks: PlanningTask[],
  query: string,
  showDoneOnly: boolean,
): PlanningTask[] {
  const normalizedQuery = query.trim().toLowerCase();

  return tasks.filter((task) => {
    if (showDoneOnly && !task.done) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return task.title.toLowerCase().includes(normalizedQuery);
  });
}

export function buildMinimalStateReport(
  tasks: PlanningTask[],
  query: string,
  showDoneOnly: boolean,
): MinimalStateReport {
  const visibleTasks = getVisiblePlanningTasks(tasks, query, showDoneOnly);

  return {
    total: tasks.length,
    completed: tasks.filter((task) => task.done).length,
    visible: visibleTasks.length,
    pendingEstimate: tasks
      .filter((task) => !task.done)
      .reduce((sum, task) => sum + task.estimate, 0),
    summary:
      'В состоянии здесь хранятся только raw tasks, query и режим показа. visibleItems, counts и totals вычисляются на каждом рендере и не могут рассинхронизироваться.',
    snippet: [
      'const visibleTasks = tasks.filter((task) => {',
      '  if (showDoneOnly && !task.done) return false;',
      '  return task.title.toLowerCase().includes(query.toLowerCase());',
      '});',
      '',
      'const completed = tasks.filter((task) => task.done).length;',
    ].join('\n'),
  };
}
