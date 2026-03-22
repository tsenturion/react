import type { ContainerFeatureId, StrategyScenario } from './context-domain';
import { containerFeatures } from './context-domain';
import type { StatusTone } from './learning-model';

export function recommendArchitecture(scenario: StrategyScenario): {
  primary:
    | 'local state + props'
    | 'lifting state up'
    | 'context'
    | 'useReducer'
    | 'context + reducer';
  tone: StatusTone;
  summary: string;
  reasons: string[];
  risks: string[];
} {
  const reasons: string[] = [];

  if (
    scenario.sharedScope === 'branch' &&
    !scenario.distantConsumers &&
    scenario.logicComplexity === 'simple'
  ) {
    reasons.push(
      'Состояние принадлежит одной ветке и логика переходов остаётся небольшой.',
    );

    return {
      primary: 'local state + props',
      tone: 'success',
      summary:
        'Здесь лучше оставить состояние рядом с компонентом и передать его props-ами без лишнего context-слоя.',
      reasons,
      risks: [
        'Если раньше времени добавить provider, появится лишняя глобальность без реальной необходимости.',
      ],
    };
  }

  if (
    scenario.logicComplexity === 'simple' &&
    !scenario.distantConsumers &&
    scenario.treeDepth <= 3
  ) {
    reasons.push('Логика простая, а дерево ещё достаточно короткое.');

    return {
      primary: 'lifting state up',
      tone: 'success',
      summary:
        'Поднимите состояние к ближайшему общему владельцу и продолжайте через props, пока drilling не начинает реально мешать.',
      reasons,
      risks: [
        'Если дерево вырастет, промежуточные компоненты начнут тащить на себе чужие props и callbacks.',
      ],
    };
  }

  if (scenario.logicComplexity === 'complex' && !scenario.distantConsumers) {
    reasons.push('Сложность находится в переходах состояния, а не в delivery по дереву.');

    return {
      primary: 'useReducer',
      tone: 'success',
      summary:
        'Reducer поможет собрать действия и переходы в одну модель, даже если context пока не нужен.',
      reasons,
      risks: [
        'Если одновременно добавить слишком широкий provider, reducer быстро превратится в глобальный контейнер для всего подряд.',
      ],
    };
  }

  if (scenario.distantConsumers && scenario.logicComplexity === 'simple') {
    reasons.push(
      'Данные нужны удалённым веткам, но набор переходов пока остаётся небольшим.',
    );

    return {
      primary: 'context',
      tone: scenario.providerEverywhere ? 'warn' : 'success',
      summary:
        'Context решает задачу доставки данных через дерево, когда lifting state up уже начинает засорять промежуточные компоненты.',
      reasons,
      risks: scenario.providerEverywhere
        ? [
            'Provider не должен оборачивать всё приложение, если значение нужно только одной секции.',
          ]
        : [
            'Если логика обновлений усложнится, context alone перестанет быть достаточно выразительным.',
          ],
    };
  }

  reasons.push(
    'Данные нужны удалённым веткам, а логика переходов уже состоит из множества действий.',
  );

  return {
    primary: 'context + reducer',
    tone:
      scenario.providerEverywhere && scenario.sharedScope !== 'app' ? 'warn' : 'success',
    summary:
      'Context доставляет state и dispatch через дерево, а reducer удерживает сложные переходы в одном предсказуемом месте.',
    reasons,
    risks:
      scenario.providerEverywhere && scenario.sharedScope !== 'app'
        ? [
            'Если растянуть provider на всё приложение, локальные детали начнут стекаться в один шумный контейнер.',
          ]
        : [
            'Даже эта схема требует границ: провайдер стоит держать только там, где состояние действительно общее.',
          ],
  };
}

export function evaluateGlobalContainer(
  selectedFeatures: readonly ContainerFeatureId[],
  consumerNeeds: readonly ContainerFeatureId[],
): {
  tone: StatusTone;
  headline: string;
  summary: string;
  overloadScore: number;
  irrelevantFeatures: ContainerFeatureId[];
  suggestions: string[];
} {
  const irrelevantFeatures = selectedFeatures.filter(
    (feature) => !consumerNeeds.includes(feature),
  );
  const localCount = selectedFeatures.filter(
    (feature) =>
      containerFeatures.find((item) => item.id === feature)?.recommendedOwner === 'local',
  ).length;
  const serverCount = selectedFeatures.filter(
    (feature) =>
      containerFeatures.find((item) => item.id === feature)?.recommendedOwner ===
      'server',
  ).length;
  const scopedCount = selectedFeatures.filter(
    (feature) =>
      containerFeatures.find((item) => item.id === feature)?.recommendedOwner ===
      'scoped-context',
  ).length;

  const overloadScore =
    irrelevantFeatures.length + localCount * 2 + serverCount * 3 + scopedCount;

  if (overloadScore <= 1) {
    return {
      tone: 'success',
      headline: 'Контекст остаётся сфокусированным',
      summary:
        'В контейнере лежат в основном shared concerns, которые действительно нужны нескольким веткам.',
      overloadScore,
      irrelevantFeatures,
      suggestions: [
        'Оставьте внутри only shared delivery data и не тяните сюда временные локальные детали.',
      ],
    };
  }

  if (overloadScore <= 4) {
    return {
      tone: 'warn',
      headline: 'Контекст начинает размываться',
      summary:
        'Внутрь уже попали локальные или scoped concerns. Provider всё ещё можно спасти, если быстро разделить ответственность.',
      overloadScore,
      irrelevantFeatures,
      suggestions: [
        'Локальные draft/hover state верните рядом с компонентами.',
        'Диалоги и похожие flow-слои лучше вынести в отдельный scoped provider.',
      ],
    };
  }

  return {
    tone: 'error',
    headline: 'Получается глобальный контейнер для всего подряд',
    summary:
      'Контекст смешивает shared delivery, локальные детали и даже server data. Такой слой трудно читать, тестировать и безопасно расширять.',
    overloadScore,
    irrelevantFeatures,
    suggestions: [
      'Server data вынесите в отдельный data layer.',
      'Эфемерные состояния верните в локальные компоненты.',
      'Оставьте в общем provider только действительно shared values и dispatch для общей секции.',
    ],
  };
}
