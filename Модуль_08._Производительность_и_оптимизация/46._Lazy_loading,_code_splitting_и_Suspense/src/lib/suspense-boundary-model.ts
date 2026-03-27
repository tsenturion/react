export type BoundaryMode = 'local' | 'global';

export function describeBoundaryScenario(input: { mode: BoundaryMode }) {
  if (input.mode === 'global') {
    return {
      headline: 'Глобальная boundary скрывает весь workspace',
      detail:
        'Это удобно как один быстрый safety net, но пользователь теряет контекст экрана, пока грузится только один тяжёлый блок.',
      fallbackScope: 'whole workspace',
      shellVisible: false,
    };
  }

  return {
    headline: 'Локальная boundary оставляет shell на месте',
    detail:
      'Сайдбар, summary и навигация продолжают жить, а в ожидании меняется только slot тяжёлого widget.',
    fallbackScope: 'widget slot only',
    shellVisible: true,
  };
}
