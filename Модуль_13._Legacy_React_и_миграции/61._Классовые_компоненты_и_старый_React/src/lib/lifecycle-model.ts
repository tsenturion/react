export type LifecycleMethodCard = {
  method: 'componentDidMount' | 'componentDidUpdate' | 'componentWillUnmount';
  phase: 'mount' | 'update' | 'unmount';
  typicalUse: string;
  hookLens: string;
  pitfall: string;
};

export const lifecycleMethodCards: readonly LifecycleMethodCard[] = [
  {
    method: 'componentDidMount',
    phase: 'mount',
    typicalUse:
      'Подписка, начальный запрос, синхронизация с внешним API после первого paint.',
    hookLens: 'Сегодня чаще соответствует effect с пустым списком зависимостей.',
    pitfall:
      'Считать, что mount выполнится “ровно один раз навсегда” независимо от remount через key.',
  },
  {
    method: 'componentDidUpdate',
    phase: 'update',
    typicalUse:
      'Реакция на смену props или state, которая зависит от сравнения с предыдущим значением.',
    hookLens:
      'Современная оптика та же: effect тоже обязан понимать, на какую именно смену он реагирует.',
    pitfall:
      'Вызывать setState без guard по prevProps / prevState и получать бесконечный цикл.',
  },
  {
    method: 'componentWillUnmount',
    phase: 'unmount',
    typicalUse:
      'Cleanup подписок, таймеров и imperative интеграций перед удалением инстанса.',
    hookLens: 'Это та же cleanup-фаза, что и return внутри useEffect.',
    pitfall:
      'Забыть cleanup и оставить висящие подписки или DOM-интеграции после ухода компонента.',
  },
] as const;

export const lifecycleMaintenanceNotes = [
  'Сначала определите фазу: mount, update или unmount.',
  'Потом найдите источник изменения: props, local state или remount через key.',
  'Только после этого сравнивайте старую реализацию с hook-based эквивалентом.',
] as const;

export function describeLifecycleMethod(method: string): LifecycleMethodCard | null {
  return lifecycleMethodCards.find((entry) => entry.method === method) ?? null;
}
