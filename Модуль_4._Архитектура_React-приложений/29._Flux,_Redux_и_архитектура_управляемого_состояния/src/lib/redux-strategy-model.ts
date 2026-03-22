import type { StatusTone } from './learning-model';
import type { StoreConcernId, StrategyScenario } from './redux-domain';
import { storeConcerns } from './redux-domain';

export function recommendStateArchitecture(scenario: StrategyScenario): {
  primary: 'local state' | 'lifting state up' | 'context' | 'context + reducer' | 'redux';
  tone: StatusTone;
  summary: string;
  reasons: string[];
  risks: string[];
} {
  const reasons: string[] = [];

  if (
    scenario.sharedScope === 'branch' &&
    scenario.consumerSpread === 'near' &&
    scenario.transitions === 'simple'
  ) {
    reasons.push(
      'Состояние принадлежит небольшой ветке и не требует app-level coordination.',
    );

    return {
      primary: 'local state',
      tone: 'success',
      summary:
        'Здесь выгоднее оставить состояние рядом с компонентом и не тянуть поверх него глобальный store.',
      reasons,
      risks: [
        'Redux здесь добавит лишние файлы, actions и selectors без реального architectural payoff.',
      ],
    };
  }

  if (
    scenario.sharedScope !== 'app' &&
    scenario.consumerSpread === 'near' &&
    scenario.transitions === 'simple'
  ) {
    reasons.push('Потребители ещё достаточно близко, а transitions несложные.');

    return {
      primary: 'lifting state up',
      tone: 'success',
      summary:
        'Ближайший общий владелец и props ещё справляются с задачей без отдельного store.',
      reasons,
      risks: [
        'Если дерево вырастет, prop drilling начнёт засорять промежуточные layout-компоненты.',
      ],
    };
  }

  if (
    scenario.sharedScope === 'section' &&
    scenario.consumerSpread === 'distant' &&
    scenario.transitions === 'simple'
  ) {
    reasons.push('Проблема уже в delivery через дерево, а не в app-wide orchestration.');

    return {
      primary: 'context',
      tone: 'success',
      summary:
        'Context решает задачу доставки данных до глубоких веток секции, если логика переходов ещё невелика.',
      reasons,
      risks: [
        'Если transitions станут сложными, одного context без reducer станет недостаточно.',
      ],
    };
  }

  if (
    scenario.sharedScope === 'section' &&
    scenario.transitions === 'complex' &&
    !scenario.crossFeature
  ) {
    reasons.push(
      'Внутри секции уже есть сложные actions, но app-wide coordination ещё не нужна.',
    );

    return {
      primary: 'context + reducer',
      tone: 'success',
      summary:
        'Scoped context и reducer хорошо подходят для сложной feature-секции без полноценного приложения-level store.',
      reasons,
      risks: [
        'Если feature начнёт координироваться с другими модулями, общая картина может потребовать app-level store.',
      ],
    };
  }

  reasons.push(
    'Данные и actions координируют несколько feature-модулей на уровне приложения.',
  );
  if (scenario.debugNeed) {
    reasons.push(
      'Нужна более прозрачная картина dispatch → reducer → next state на уровне всего приложения.',
    );
  }

  return {
    primary: 'redux',
    tone: 'success',
    summary:
      'Redux оправдан, когда нужен единый app-level store, однонаправленный поток данных и предсказуемая координация между несколькими feature-ветками.',
    reasons,
    risks: [
      'Если вынести туда локальные черновики, hover state и URL concerns, centralized model превратится в overkill.',
    ],
  };
}

export function evaluateStoreSurface(
  selectedConcerns: readonly StoreConcernId[],
  consumerNeeds: readonly StoreConcernId[],
): {
  tone: StatusTone;
  headline: string;
  overloadScore: number;
  summary: string;
  irrelevantConcerns: StoreConcernId[];
  suggestions: string[];
} {
  const irrelevantConcerns = selectedConcerns.filter(
    (concern) => !consumerNeeds.includes(concern),
  );

  const localCount = selectedConcerns.filter(
    (concern) =>
      storeConcerns.find((item) => item.id === concern)?.recommendedOwner === 'local',
  ).length;
  const urlCount = selectedConcerns.filter(
    (concern) =>
      storeConcerns.find((item) => item.id === concern)?.recommendedOwner === 'url',
  ).length;
  const serverCount = selectedConcerns.filter(
    (concern) =>
      storeConcerns.find((item) => item.id === concern)?.recommendedOwner === 'server',
  ).length;
  const contextCount = selectedConcerns.filter(
    (concern) =>
      storeConcerns.find((item) => item.id === concern)?.recommendedOwner === 'context',
  ).length;

  const overloadScore =
    irrelevantConcerns.length +
    localCount * 2 +
    urlCount * 2 +
    serverCount * 3 +
    contextCount;

  if (overloadScore <= 1) {
    return {
      tone: 'success',
      headline: 'Store остаётся сфокусированным',
      overloadScore,
      summary:
        'Централизованный слой содержит в основном действительно shared app concerns и не забирает на себя чужие роли.',
      irrelevantConcerns,
      suggestions: [
        'Оставьте в store только data flow, который действительно координируется на уровне приложения.',
      ],
    };
  }

  if (overloadScore <= 4) {
    return {
      tone: 'warn',
      headline: 'Store начинает размываться',
      overloadScore,
      summary:
        'В centralized layer уже попали local, URL или context-level concerns. Пока это ещё можно отделить без полной переделки.',
      irrelevantConcerns,
      suggestions: [
        'Route filters верните в URL.',
        'Эфемерные local details держите рядом с компонентами.',
      ],
    };
  }

  return {
    tone: 'error',
    headline: 'Получается overkill store',
    overloadScore,
    summary:
      'Один глобальный store смешивает app-level coordination, local UI details, URL state и server data. Такая архитектура теряет ясность и усложняет отладку.',
    irrelevantConcerns,
    suggestions: [
      'Server data вынесите в data layer.',
      'Theme и похожие preferences можно оставить в context.',
      'Hover state и drafts верните в локальные компоненты.',
    ],
  };
}
