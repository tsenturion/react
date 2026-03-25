import type { DebugSymptom } from './workflow-playbook-model';

export const scenarioPresets: Record<
  DebugSymptom,
  {
    title: string;
    summary: string;
    query: string;
    area: 'all' | 'render' | 'routing' | 'network' | 'forms' | 'data';
  }
> = {
  'typing-lag': {
    title: 'Typing lag in search',
    summary:
      'Пользователь жалуется, что ввод запаздывает, когда рядом открыт тяжёлый result board.',
    query: 'search',
    area: 'data',
  },
  'navigation-stall': {
    title: 'Navigation stall',
    summary:
      'Переход между вкладками ощущается тяжёлым, хотя сеть уже почти не участвует.',
    query: 'route',
    area: 'routing',
  },
  'refresh-spike': {
    title: 'Refresh spike',
    summary:
      'После ручного refresh интерфейс замирает и трудно понять, виноват React или network waterfall.',
    query: 'refresh',
    area: 'network',
  },
  'mystery-rerender': {
    title: 'Mystery rerender',
    summary:
      'Непонятно, почему соседние виджеты обновляются даже при локальном действии внутри одного блока.',
    query: 'render',
    area: 'render',
  },
};
