import type { BoundaryScenario } from './custom-hooks-domain';
import type { StatusTone } from './learning-model';

export function assessHookBoundary(scenario: BoundaryScenario): {
  decision: 'extract-hook' | 'keep-inline' | 'prefer-helper';
  label: string;
  tone: StatusTone;
  explanation: string;
  signals: string[];
} {
  const signals = [
    scenario.repetition === 'multiple'
      ? 'Логика повторяется в нескольких местах.'
      : 'Логика живёт только в одном месте.',
    scenario.sideEffects
      ? 'Есть синхронизация с внешним миром или browser API.'
      : 'Внешней синхронизации нет.',
    scenario.internalState
      ? 'Есть скрытое состояние и команды.'
      : 'Скрытого состояния нет, это почти чистое вычисление.',
    scenario.shareableAcrossComponents
      ? 'Поведение нужно нескольким веткам дерева.'
      : 'Поведение локально одной ветке.',
  ];

  if (!scenario.internalState && !scenario.sideEffects) {
    return {
      decision: 'prefer-helper',
      label: 'Оставьте pure helper',
      tone: 'warn',
      explanation:
        'Если состояния и синхронизации нет, custom hook только создаст ложное ожидание React-специфической логики. Здесь честнее выделить обычную функцию.',
      signals,
    };
  }

  if (
    scenario.repetition === 'single' &&
    scenario.complexity === 'tiny' &&
    !scenario.sideEffects
  ) {
    return {
      decision: 'keep-inline',
      label: 'Оставьте рядом с компонентом',
      tone: 'warn',
      explanation:
        'Локальный одноразовый toggle или пару обработчиков не нужно выносить в hook. Расстояние до смысла только вырастет.',
      signals,
    };
  }

  return {
    decision: 'extract-hook',
    label: 'Вынос в custom hook оправдан',
    tone: 'success',
    explanation:
      'Поведение повторяется, имеет собственный контракт и скрывает внутренние state/effect-детали. Hook здесь действительно упрощает экран.',
    signals,
  };
}
