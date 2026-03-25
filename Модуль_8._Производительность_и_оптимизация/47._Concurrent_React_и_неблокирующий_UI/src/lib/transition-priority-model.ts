export type TransitionMode = 'direct' | 'transition';
export type TransitionAction = 'typing' | 'track-change';

export function describeTransitionPriority(input: {
  mode: TransitionMode;
  action: TransitionAction;
  isPending: boolean;
}) {
  if (input.mode === 'direct') {
    return {
      headline: 'Срочное и тяжёлое обновление идут одним пакетом',
      detail:
        input.action === 'typing'
          ? 'Каждый символ сразу тащит за собой тяжёлую фильтрацию списка.'
          : 'Смена фильтра мгновенно запускает expensive projection без разграничения приоритетов.',
      urgentChannel: 'input и heavy list обновляются одинаково срочно',
      backgroundChannel: 'несрочный канал отсутствует',
    };
  }

  return {
    headline: input.isPending
      ? 'Тяжёлое обновление уже ушло в transition'
      : 'Срочный feedback отделён от фоновой перерисовки',
    detail:
      input.action === 'typing'
        ? 'Input обновляется как urgent state, а следующий expensive list render получает более низкий приоритет.'
        : 'Filter chip меняется сразу, а сам тяжёлый projection пересчитывается как transition.',
    urgentChannel: 'draft state и быстрый feedback остаются срочными',
    backgroundChannel: 'expensive subtree обновляется как non-urgent work',
  };
}
