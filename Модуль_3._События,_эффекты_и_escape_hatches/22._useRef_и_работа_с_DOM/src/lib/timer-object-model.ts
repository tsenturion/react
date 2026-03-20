import type { StatusTone } from './learning-model';

export type TimerObjectCase = 'timer-ref' | 'external-object' | 'state-smell';

type TimerObjectReport = {
  title: string;
  tone: StatusTone;
  summary: string;
  snippet: string;
};

const reports: Record<TimerObjectCase, TimerObjectReport> = {
  'timer-ref': {
    title: 'Interval id in ref',
    tone: 'success',
    summary:
      'Идентификатор таймера нужен для остановки внешнего процесса, но не нужен в JSX. Это хороший кандидат для ref.',
    snippet: [
      'const intervalRef = useRef<number | null>(null);',
      'intervalRef.current = window.setInterval(tick, 1000);',
    ].join('\n'),
  },
  'external-object': {
    title: 'Imperative object in ref',
    tone: 'success',
    summary:
      'Экземпляр внешней библиотеки или собственный mutable object можно создать один раз и переиспользовать между render-ами.',
    snippet: [
      'if (consoleRef.current === null) {',
      '  consoleRef.current = createDemoConsole();',
      '}',
    ].join('\n'),
  },
  'state-smell': {
    title: 'Handle in state',
    tone: 'error',
    summary:
      'Если timer id хранится в state, любой start/stop делает лишний render, хотя сам handle интерфейс не описывает.',
    snippet: [
      'const [timerId, setTimerId] = useState<number | null>(null);',
      '// handle живёт в render-state без реальной пользы для JSX',
    ].join('\n'),
  },
};

export function buildTimerObjectReport(id: TimerObjectCase) {
  return reports[id];
}

export function formatElapsed(ms: number) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;
  return `${minutes}:${restSeconds.toString().padStart(2, '0')}`;
}
