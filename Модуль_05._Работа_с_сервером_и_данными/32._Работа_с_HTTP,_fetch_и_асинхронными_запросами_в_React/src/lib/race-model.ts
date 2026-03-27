export type RaceMode = 'unsafe' | 'safe';

export function getRaceDelay(query: string) {
  return Math.max(180, 980 - query.trim().length * 160);
}

export function raceModeSummary(mode: RaceMode) {
  return mode === 'unsafe'
    ? 'Без abort и stale-guard поздний ответ может перезаписать более новый результат.'
    : 'Abort и проверка актуальности не дают устаревшему ответу попасть в UI.';
}
