import type { StatusTone } from './learning-model';

export type LagSeverity = 'none' | 'slight' | 'obvious';
export type InteractionFrequency = 'rare' | 'regular' | 'constant';
export type SurfaceScope = 'leaf' | 'section' | 'screen';
export type SuspectedCause =
  | 'unknown'
  | 'wide-rerender'
  | 'heavy-derivation'
  | 'heavy-row';
export type MeasurementState = 'not-yet' | 'rough-signal' | 'measured';

export function evaluateOptimizationNeed(input: {
  lagSeverity: LagSeverity;
  frequency: InteractionFrequency;
  scope: SurfaceScope;
  suspectedCause: SuspectedCause;
  measurement: MeasurementState;
}) {
  if (input.lagSeverity === 'none' && input.measurement === 'not-yet') {
    return {
      tone: 'success' as StatusTone,
      verdict: 'Наблюдаемый bottleneck пока не подтверждён',
      nextMove:
        'Сначала соберите сигнал: где именно пользователь чувствует задержку и повторяется ли она.',
      dontDo: ['Не добавляйте memo заранее', 'Не переносите код в refs без причины'],
    };
  }

  if (input.measurement === 'not-yet') {
    return {
      tone: 'warn' as StatusTone,
      verdict: 'Сначала измерьте проблему',
      nextMove:
        'Определите, какой interaction медленный и какое поддерево реально задевается этим действием.',
      dontDo: [
        'Не лечите симптомы по ощущениям',
        'Не усложняйте код, пока причина не названа',
      ],
    };
  }

  if (input.suspectedCause === 'wide-rerender') {
    return {
      tone: 'error' as StatusTone,
      verdict: 'Начните с state placement',
      nextMove:
        'Сузьте blast radius: переместите draft state ниже или разделите expensive branch и control branch.',
      dontDo: [
        'Не начинайте с глобального memo everywhere',
        'Не прячьте wide render за ref-трюками',
      ],
    };
  }

  if (input.suspectedCause === 'heavy-derivation') {
    return {
      tone: 'warn' as StatusTone,
      verdict: 'Проблема похожа на дорогие вычисления',
      nextMove:
        'Посмотрите на форму данных, repeated filters/sorts и на то, не вычисляете ли вы одно и то же слишком высоко в дереве.',
      dontDo: [
        'Не храните всё как nested shape только из привычки',
        'Не дублируйте derived data в state',
      ],
    };
  }

  if (input.suspectedCause === 'heavy-row') {
    return {
      tone: 'warn' as StatusTone,
      verdict: 'Проблема похожа на тяжёлый leaf-компонент',
      nextMove:
        'Сначала уменьшите стоимость одной строки или карточки, а уже потом смотрите на secondary optimizations.',
      dontDo: [
        'Не лечите тяжёлую строку только переносом state',
        'Не игнорируйте реальную стоимость render work',
      ],
    };
  }

  return {
    tone:
      input.scope === 'screen' || input.frequency === 'constant'
        ? ('warn' as StatusTone)
        : ('success' as StatusTone),
    verdict: 'Оптимизация может подождать, если lag неустойчив',
    nextMove:
      'Если сигнал плавающий, держите код простым и повторно измерьте сценарий после следующего архитектурного изменения.',
    dontDo: [
      'Не делайте код хрупким ради гипотетической выгоды',
      'Не путайте maintenance cost и performance gain',
    ],
  };
}
