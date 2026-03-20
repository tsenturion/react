export type FocusFieldId = 'name' | 'email' | 'track';
export type ScrollBehaviorMode = 'auto' | 'smooth';
export type ScrollBlockMode = 'start' | 'center' | 'end' | 'nearest';
export type DemoTheme = 'calm' | 'alert';

export type FocusFormValues = {
  name: string;
  email: string;
  track: string;
};

export type ScrollLessonCard = {
  id: string;
  title: string;
  summary: string;
};

export type BoxMetrics = {
  clientWidth: number;
  clientHeight: number;
  rectWidth: number;
  rectHeight: number;
  scrollHeight: number;
};

export type DemoConsole = {
  id: number;
  pings: number;
  status: 'idle' | 'running' | 'stopped';
  ping: () => number;
  stop: () => void;
};

export const lessonCards: readonly ScrollLessonCard[] = [
  {
    id: 'refs-basics',
    title: 'Refs basics',
    summary:
      'Mutable значение живёт между render-ами и не создаёт новый UI snapshot само по себе.',
  },
  {
    id: 'focus-flow',
    title: 'Focus flow',
    summary:
      'Программный фокус нужен там, где браузерное поведение надо направить точнее.',
  },
  {
    id: 'scroll-sync',
    title: 'Scroll sync',
    summary:
      'scrollIntoView допустим, когда надо привести пользователя к уже существующему DOM-узлу.',
  },
  {
    id: 'measure-dom',
    title: 'Measure DOM',
    summary:
      'Реальный размер известен только после того, как DOM уже создан и раскрашен браузером.',
  },
  {
    id: 'external-handles',
    title: 'External handles',
    summary: 'Таймеры и внешние объекты обычно живут в ref, а не в render-state.',
  },
  {
    id: 'imperative-boundary',
    title: 'Imperative boundary',
    summary:
      'Ручное изменение DOM допустимо как escape hatch, но не как второй источник истины.',
  },
] as const;

export function formatPixels(value: number) {
  return `${value.toFixed(1)} px`;
}

export function readBoxMetrics(element: HTMLElement): BoxMetrics {
  const rect = element.getBoundingClientRect();

  return {
    clientWidth: element.clientWidth,
    clientHeight: element.clientHeight,
    rectWidth: rect.width,
    rectHeight: rect.height,
    scrollHeight: element.scrollHeight,
  };
}

let demoConsoleId = 0;

export function createDemoConsole(): DemoConsole {
  let status: DemoConsole['status'] = 'idle';
  let pings = 0;
  const id = ++demoConsoleId;

  return {
    id,
    get pings() {
      return pings;
    },
    get status() {
      return status;
    },
    ping() {
      status = 'running';
      pings += 1;
      return pings;
    },
    stop() {
      status = 'stopped';
    },
  };
}
