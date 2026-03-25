export type SplitTarget = 'route' | 'modal' | 'analytics' | 'tiny-control';
export type PayloadWeight = 'light' | 'medium' | 'heavy';
export type VisitFrequency = 'rare' | 'sessional' | 'always';
export type FallbackScope = 'local' | 'page' | 'global';

export function evaluateSplitStrategy(input: {
  target: SplitTarget;
  payloadWeight: PayloadWeight;
  visitFrequency: VisitFrequency;
  fallbackScope: FallbackScope;
  needsInstantPaint: boolean;
  hasStablePlaceholder: boolean;
}) {
  const score =
    (input.payloadWeight === 'heavy' ? 34 : input.payloadWeight === 'medium' ? 18 : 4) +
    (input.visitFrequency === 'rare'
      ? 24
      : input.visitFrequency === 'sessional'
        ? 12
        : 0) +
    (input.target === 'route' || input.target === 'analytics' || input.target === 'modal'
      ? 12
      : -14) +
    (input.needsInstantPaint ? -18 : 0) +
    (input.hasStablePlaceholder ? 10 : -10) +
    (input.fallbackScope === 'local' ? 12 : input.fallbackScope === 'page' ? 4 : -12);

  if (score >= 38) {
    return {
      verdict: 'Split выглядит оправданным',
      guidance:
        'Цель тяжёлая или редкая, а граница fallback достаточно узкая, чтобы не ломать основной сценарий.',
      risks: [
        'Убедитесь, что fallback объясняет, что именно загружается.',
        'Если модуль открывается повторно, подумайте о prefetch после первого намерения.',
      ],
    };
  }

  if (score >= 16) {
    return {
      verdict: 'Split возможен, но требует аккуратной границы',
      guidance:
        'Польза есть, но она быстро исчезнет, если fallback окажется слишком широким или модуль используется почти в каждой сессии.',
      risks: [
        'Не разбивайте одну и ту же зону на слишком мелкие чанки.',
        'Проверьте, не дешевле ли оптимизировать сам heavy block.',
      ],
    };
  }

  return {
    verdict: 'Скорее сначала оставьте код рядом',
    guidance:
      'В этой конфигурации code splitting даёт мало пользы и легко превращается в сетевую дробность и loading-шум.',
    risks: [
      'Tiny-control и always-visible code редко окупают отдельный chunk.',
      'Глобальный fallback быстро разрушает ощущение устойчивости интерфейса.',
    ],
  };
}
