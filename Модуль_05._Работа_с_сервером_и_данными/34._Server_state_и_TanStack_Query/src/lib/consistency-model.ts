import type { ConsistencyScope } from './server-state-domain';

export function evaluateConsistencyPlan(scope: ConsistencyScope) {
  if (scope === 'catalog-and-summary') {
    return {
      status: 'Safe invalidation scope',
      explanation:
        'После мутации обновляются и список, и summary query. Кэш остаётся согласованным между связанными виджетами.',
      antiPattern:
        'Не ограничивайте invalidation только тем query key, который первым бросается в глаза.',
    };
  }

  return {
    status: 'Risky invalidation scope',
    explanation:
      'Список обновится, но summary останется в старом кэше и начнёт противоречить уже подтверждённым данным.',
    antiPattern:
      'Не считайте, что успешная мутация автоматически синхронизирует все связанные query keys.',
  };
}
