export type LagSeverity = 'none' | 'noticeable' | 'high';
export type ComputationCost = 'trivial' | 'moderate' | 'heavy';
export type ChildBreadth = 'single' | 'section' | 'list';

export function evaluateMemoizationNeed(input: {
  lagSeverity: LagSeverity;
  computationCost: ComputationCost;
  childBreadth: ChildBreadth;
  unstableProps: boolean;
  dependencyRisk: boolean;
  alreadyMeasured: boolean;
}) {
  const score =
    (input.lagSeverity === 'high' ? 35 : input.lagSeverity === 'noticeable' ? 20 : 0) +
    (input.computationCost === 'heavy'
      ? 25
      : input.computationCost === 'moderate'
        ? 12
        : 0) +
    (input.childBreadth === 'list' ? 20 : input.childBreadth === 'section' ? 10 : 0) +
    (input.unstableProps ? 20 : 0) -
    (input.dependencyRisk ? 18 : 0) -
    (input.alreadyMeasured ? 0 : 15);

  if (score >= 55) {
    return {
      verdict: 'Мемоизация выглядит оправданной',
      nextMove:
        'Зафиксируйте измерение, сузьте dependencies и применяйте мемоизацию только на конкретной hot path.',
      antiPatterns: [
        'Не оборачивайте подряд весь компонентный слой только потому, что один список оказался тяжёлым.',
        'Не скрывайте за useMemo проблему placement state или лишней ширины props.',
      ],
    } as const;
  }

  if (score >= 25) {
    return {
      verdict: 'Сначала измерьте и упростите входные данные',
      nextMove:
        'Пока сигнал смешанный: возможно, больше пользы даст стабильный prop contract, чем сами memo-hooks.',
      antiPatterns: [
        'Не добавляйте useCallback к каждому обработчику без memo-child ниже по дереву.',
        'Не мемоизируйте тривиальные вычисления, если bottleneck ещё не подтверждён.',
      ],
    } as const;
  }

  return {
    verdict: 'Цена мемоизации выше ожидаемой пользы',
    nextMove:
      'Оставьте код прямым, пока нет измеренного лага, дорогого derived data или широкого списка, который реально страдает.',
    antiPatterns: [
      'Не превращайте useMemo в стиль кодирования по умолчанию.',
      'Не усложняйте dependencies там, где само вычисление почти бесплатное.',
    ],
  } as const;
}
