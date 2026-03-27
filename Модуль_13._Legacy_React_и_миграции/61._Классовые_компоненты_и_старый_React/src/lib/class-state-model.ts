export type DoubleIncrementPreview = {
  objectFormResult: number;
  updaterFormResult: number;
  explanation: readonly string[];
};

export function previewDoubleIncrement(current: number): DoubleIncrementPreview {
  return {
    objectFormResult: current + 1,
    updaterFormResult: current + 2,
    explanation: [
      'object-form setState читает snapshot в момент вызова и не знает про соседнее обновление в очереди;',
      'updater-form получает актуальное prevState после каждого queued шага;',
      'поэтому безопасная форма для зависимого от прошлого значения state - updater function.',
    ],
  };
}

export function normalizeLegacyTag(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function describeCommitCallback(tag: string, totalTags: number): string {
  return `Callback выполнился после commit: тег "${tag}" уже в this.state, всего тегов ${totalTags}.`;
}

export const classStateTakeaways = [
  'Если следующее значение зависит от предыдущего, используйте updater-form setState.',
  'Object-form setState остаётся уместным только для независимых присваиваний.',
  'Callback после setState нужен для действий после commit, а не для вычисления следующего state.',
  'Чтение this.state сразу после setState внутри handler показывает старый snapshot, а не финальный commit.',
] as const;
