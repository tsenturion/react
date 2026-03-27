export type PlacementMode = 'lifted' | 'colocated';

export function describeStatePlacement(input: {
  mode: PlacementMode;
  shellCommits: number;
  listCommits: number;
  hasUnappliedDraft: boolean;
}) {
  if (input.mode === 'lifted') {
    return {
      blastRadius: 'wide',
      headline: 'Draft state лежит слишком высоко',
      detail:
        'Каждый символ сразу меняет state shell, а вместе с ним повторно рендерятся и фильтр, и список.',
      firstMove:
        'Переместите draft ближе к input и отправляйте наверх только применённое значение.',
    } as const;
  }

  if (input.hasUnappliedDraft) {
    return {
      blastRadius: 'contained',
      headline: 'Draft локализован рядом с input',
      detail:
        'Пока значение не применено, ререндерится только форма фильтра, а expensive list остаётся стабильным.',
      firstMove:
        'Сохраняйте наверх только то состояние, которое действительно нужно остальному дереву.',
    } as const;
  }

  return {
    blastRadius: input.listCommits > input.shellCommits ? 'wide' : 'contained',
    headline: 'Дерево синхронизировано по нажатию Apply',
    detail:
      'После применения фильтра shell и список ререндерятся осознанно: это полезный, а не случайный рендер.',
    firstMove:
      'Отделяйте draft state от applied state, если ввод часто меняется, а список дорогой.',
  } as const;
}
