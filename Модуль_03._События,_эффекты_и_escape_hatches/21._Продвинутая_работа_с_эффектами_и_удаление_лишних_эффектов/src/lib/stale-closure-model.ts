import type { StatusTone } from './learning-model';

export type StaleClosureMode = 'stale' | 'deps' | 'functional';

type ClosureReport = {
  title: string;
  tone: StatusTone;
  summary: string;
  snippet: string;
};

const reports: Record<StaleClosureMode, ClosureReport> = {
  stale: {
    title: 'Snapshot застрял в interval',
    tone: 'error',
    summary:
      'Effect с пустыми dependencies читает `count` из первого render и затем многократно пишет одно и то же значение.',
    snippet: [
      'useEffect(() => {',
      '  const id = setInterval(() => {',
      '    setCount(count + 1);',
      '  }, 700);',
      '  return () => clearInterval(id);',
      '}, []);',
    ].join('\n'),
  },
  deps: {
    title: 'Реактивный fix через [count]',
    tone: 'warn',
    summary:
      'Значение корректное, но interval пересоздаётся на каждом tick. Это рабочий, но шумный способ борьбы со stale closure.',
    snippet: [
      'useEffect(() => {',
      '  const id = setInterval(() => setCount(count + 1), 700);',
      '  return () => clearInterval(id);',
      '}, [count]);',
    ].join('\n'),
  },
  functional: {
    title: 'Functional update',
    tone: 'success',
    summary:
      'Interval не зависит от snapshot `count`, потому что следующее значение вычисляется из актуального state внутри updater function.',
    snippet: [
      'useEffect(() => {',
      '  const id = setInterval(() => {',
      '    setCount((current) => current + 1);',
      '  }, 700);',
      '  return () => clearInterval(id);',
      '}, []);',
    ].join('\n'),
  },
};

export function buildStaleClosureReport(mode: StaleClosureMode) {
  return reports[mode];
}

export function getExpectedCounter(mode: StaleClosureMode, ticks: number) {
  if (ticks === 0) {
    return 0;
  }

  if (mode === 'stale') {
    return 1;
  }

  return ticks;
}

export function getExpectedSetupCount(mode: StaleClosureMode, ticks: number) {
  if (mode === 'deps') {
    return ticks + 1;
  }

  return ticks > 0 ? 1 : 0;
}
