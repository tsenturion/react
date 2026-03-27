import type { StatusTone } from './learning-model';

export type DeliveryMode = 'props' | 'context';

export function describeDelivery(mode: DeliveryMode): {
  tone: StatusTone;
  headline: string;
  visibleIntermediaries: number;
  summary: string;
  risks: string[];
} {
  if (mode === 'props') {
    return {
      tone: 'warn',
      headline: 'Props проходят через три промежуточных уровня',
      visibleIntermediaries: 3,
      summary:
        'Prop drilling остаётся нормальным инструментом, пока дерево короткое и промежуточные компоненты действительно понимают, зачем они передают значение дальше.',
      risks: [
        'Чем глубже дерево, тем больше layout-компонентов знают о чужих props и callbacks.',
        'Переиспользование промежуточных уровней усложняется, потому что они тянут на себе лишний API.',
      ],
    };
  }

  return {
    tone: 'success',
    headline: 'Context убирает лишний delivery слой',
    visibleIntermediaries: 0,
    summary:
      'Context позволяет доставить данные глубоко в дерево там, где промежуточные компоненты не должны знать ни о значении, ни о setter-функции.',
    risks: [
      'Context не должен становиться оправданием для любого shared state.',
      'Если обернуть им всё подряд, область ответственности провайдера станет размытой.',
    ],
  };
}
