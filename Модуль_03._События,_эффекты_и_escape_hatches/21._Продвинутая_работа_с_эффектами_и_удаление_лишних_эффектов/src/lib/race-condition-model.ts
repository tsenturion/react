import type { StatusTone } from './learning-model';

export type RaceMode = 'bad' | 'ignore' | 'abort';

type RaceReport = {
  title: string;
  tone: StatusTone;
  summary: string;
  snippet: string;
};

const reports: Record<RaceMode, RaceReport> = {
  bad: {
    title: 'Последний завершившийся запрос побеждает',
    tone: 'error',
    summary:
      'Без cleanup устаревший ответ может прийти позже и затереть результат для более свежего query.',
    snippet: [
      'useEffect(() => {',
      '  search(query).then(setResults);',
      '}, [query]);',
    ].join('\n'),
  },
  ignore: {
    title: 'Ignore stale responses',
    tone: 'warn',
    summary:
      'Локальный флаг не даёт устаревшему ответу попасть в state, но сам запрос всё равно дорабатывает до конца.',
    snippet: [
      'useEffect(() => {',
      '  let active = true;',
      '  search(query).then((data) => {',
      '    if (active) setResults(data);',
      '  });',
      '  return () => { active = false; };',
      '}, [query]);',
    ].join('\n'),
  },
  abort: {
    title: 'Abort stale request',
    tone: 'success',
    summary:
      'Abort одновременно защищает state от stale response и реально останавливает устаревший запрос.',
    snippet: [
      'useEffect(() => {',
      '  const controller = new AbortController();',
      '  search(query, controller.signal).then(setResults);',
      '  return () => controller.abort();',
      '}, [query]);',
    ].join('\n'),
  },
};

export function buildRaceReport(mode: RaceMode) {
  return reports[mode];
}

export function getExpectedRaceWinner(
  mode: RaceMode,
  latestQuery: string,
  slowQuery: string,
) {
  if (mode === 'bad') {
    return slowQuery;
  }

  return latestQuery;
}
