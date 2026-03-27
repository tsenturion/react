export type ActivityMode = 'visible' | 'hidden';

export type DraftChecklistItem = {
  id: string;
  label: string;
};

export const draftChecklist: readonly DraftChecklistItem[] = [
  { id: 'draft-copy', label: 'Черновик текста готов' },
  { id: 'draft-links', label: 'Ссылки на файлы добавлены' },
  { id: 'draft-summary', label: 'Короткое пояснение для UI подготовлено' },
] as const;

export function describeActivityMode(mode: ActivityMode) {
  return mode === 'visible'
    ? 'Поддерево активно и видно пользователю.'
    : 'Поддерево скрыто, но его локальная работа не выбрасывается.';
}

export function compareVisibilityStrategies(mode: ActivityMode) {
  return {
    activity:
      mode === 'visible'
        ? 'Activity boundary показывает поддерево и сохраняет его локальный draft.'
        : 'Activity boundary скрывает поддерево, но draft восстановится при возврате.',
    conditional:
      mode === 'visible'
        ? 'Обычный conditional render заново монтирует скрытую ветку.'
        : 'При скрытии обычная условная ветка размонтируется и потеряет локальный state.',
  };
}
