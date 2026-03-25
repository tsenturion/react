export function describeDeferredValueScenario(input: {
  query: string;
  deferredQuery: string;
}) {
  const isLagging = input.query !== input.deferredQuery;

  return {
    isLagging,
    headline: isLagging
      ? 'Потребитель значения немного отстаёт от ввода'
      : 'Deferred consumer синхронизирован с input',
    detail: isLagging
      ? 'useDeferredValue держит быстрый ввод срочным, а тяжёлый subtree временно работает на более старом значении.'
      : 'Когда deferred value догнал текущее значение, expensive subtree снова синхронизирован.',
  };
}
