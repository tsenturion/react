import type { LoaderFunctionArgs } from 'react-router-dom';

import {
  filterGuidesByFocus,
  journeySpecs,
  type ReleaseScope,
  type RiskLevel,
  type TestLayer,
  type TestingFocus,
} from './testing-domain';

export type UnitStrategyInput = {
  pureLogic: boolean;
  branching: boolean;
  deterministic: boolean;
  uiFree: boolean;
  expensiveSetup: boolean;
  crossBrowser: boolean;
};

export type ReleasePlanInput = {
  scope: ReleaseScope;
  selectedChecks: readonly TestLayer[];
  hasUserVisibleRisk: boolean;
  usesNetwork: boolean;
};

export type E2EScopeInput = {
  touchesRouter: boolean;
  touchesNetwork: boolean;
  touchesBrowserApi: boolean;
  criticality: RiskLevel;
};

export type TestingArchitectureInput = {
  criticalFlows: boolean;
  denseUiStates: boolean;
  sharedState: boolean;
  browserDependent: boolean;
  teamGrowing: boolean;
  flakeBudgetLow: boolean;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stamp() {
  return new Date().toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function parseFocus(value: string | null): TestingFocus {
  return value === 'unit' ||
    value === 'component' ||
    value === 'integration' ||
    value === 'e2e' ||
    value === 'strategy'
    ? value
    : 'all';
}

export function recommendUnitStrategy(input: UnitStrategyInput) {
  if (input.crossBrowser) {
    return {
      model: 'Not unit-first',
      score: 28,
      rationale: [
        'Если сценарий зависит от реального браузерного поведения, unit-тест не даст главную уверенность.',
        'Лучше проверить чистую логику отдельно, а сам риск отдать на component/integration/E2E уровень.',
      ],
      antiPattern:
        'Не пытайтесь доказать browser-only поведение большим количеством unit-тестов.',
      assertionStyle:
        'Проверяйте pure parts отдельно, а поведение браузера переносите выше по тестовой пирамиде.',
    };
  }

  const positiveSignals = [
    input.pureLogic,
    input.branching,
    input.deterministic,
    input.uiFree,
    input.expensiveSetup,
  ].filter(Boolean).length;

  if (positiveSignals >= 4) {
    return {
      model: 'Unit-first',
      score: 93,
      rationale: [
        'Сценарий детерминирован, не привязан к UI и хорошо выражается как чистая функция.',
        'Именно здесь unit-тесты дают быстрый и дешёвый confidence.',
      ],
      antiPattern:
        'Не заворачивайте такую логику в искусственный DOM только ради “реалистичности”.',
      assertionStyle:
        'Проверяйте входы, выходы, граничные случаи и branching rules без знания внутренних деталей реализации.',
    };
  }

  return {
    model: 'Hybrid unit + behavior',
    score: 66,
    rationale: [
      'Часть сценария уже чистая, но важный смысл всё ещё связан с пользовательским состоянием компонента.',
      'Значит unit-тесты полезны, но не исчерпывают стратегию полностью.',
    ],
    antiPattern:
      'Не оставляйте только unit-покрытие там, где пользовательский переход важнее чистой формулы.',
    assertionStyle:
      'Вынесите pure logic в unit, а видимые переходы и доступный UI отдайте на component level.',
  };
}

export function assessReleasePlan(input: ReleasePlanInput) {
  const requiredChecks = new Set<TestLayer>();

  requiredChecks.add('unit');
  requiredChecks.add('component');

  if (input.scope !== 'visual' || input.usesNetwork) {
    requiredChecks.add('integration');
  }

  if (input.scope === 'critical' || (input.hasUserVisibleRisk && input.usesNetwork)) {
    requiredChecks.add('e2e');
  }

  const missingChecks = [...requiredChecks].filter(
    (check) => !input.selectedChecks.includes(check),
  );

  return {
    requiredChecks: [...requiredChecks],
    missingChecks,
    verdict: missingChecks.length === 0 ? 'ready' : 'incomplete',
    score: Math.max(0, 100 - missingChecks.length * 24),
    summary:
      missingChecks.length === 0
        ? 'Набор проверок покрывает основной риск этого релизного сценария.'
        : `Пока не хватает слоёв: ${missingChecks.join(', ')}.`,
  };
}

export function recommendE2EScope(input: E2EScopeInput) {
  const needsE2E =
    input.touchesRouter ||
    input.touchesBrowserApi ||
    (input.touchesNetwork && input.criticality !== 'low');

  if (!needsE2E) {
    return {
      model: 'No dedicated E2E yet',
      score: 34,
      rationale: [
        'Сценарий не пересекает ключевые браузерные и межэкранные границы.',
        'Здесь integration test часто даст лучшую цену уверенности.',
      ],
      journeys: [
        'Оставьте путь на уровне integration и проверяйте только действительно критичные browser flows.',
      ],
    };
  }

  const journeys = [
    input.touchesRouter && 'Проверить переходы между экранами и сохранение URL/маршрута.',
    input.touchesNetwork &&
      'Проверить критический пользовательский путь с реальными запросами или устойчивыми API-фикстурами.',
    input.touchesBrowserApi &&
      'Проверить browser-dependent взаимодействия: фокус, клавиатуру, clipboard или modal behavior.',
  ].filter(Boolean) as string[];

  return {
    model: 'Targeted E2E',
    score: input.criticality === 'high' ? 92 : 74,
    rationale: [
      'Сценарий пересекает границы, которые плохо видны ниже: роутинг, браузер, сеть или критический бизнес-flow.',
      'E2E здесь нужен точечно, а не как покрытие всей кодовой базы подряд.',
    ],
    journeys,
  };
}

export function recommendTestingArchitecture(input: TestingArchitectureInput) {
  if (input.browserDependent && input.criticalFlows) {
    return {
      model: 'Layered strategy with targeted E2E',
      score: 92,
      rationale: [
        'Критические пользовательские пути требуют E2E, но устойчивость всё равно начинается с unit/component/integration layers.',
        'Иначе стоимость и флаки быстро съедят доверие к тестам.',
      ],
      antiPattern:
        'Не пытайтесь закрыть всё только E2E, если приложение уже имеет богатую внутреннюю логику и плотный UI.',
    };
  }

  if (input.denseUiStates || input.sharedState) {
    return {
      model: 'Component + integration core',
      score: 83,
      rationale: [
        'Когда приложение насыщено состояниями и связями между компонентами, центр стратегии должен быть в behavior-level и integration-level тестах.',
        'Unit остаётся важным, но не является единственным источником уверенности.',
      ],
      antiPattern:
        'Не проверяйте только helper functions, если реальные сбои рождаются в связке экранов и состояний.',
    };
  }

  if (input.teamGrowing && input.flakeBudgetLow) {
    return {
      model: 'Fast feedback pyramid',
      score: 78,
      rationale: [
        'Растущей команде нужен быстрый feedback loop: больше дешёвых unit/component tests и очень точечные browser flows.',
        'Так стратегия остаётся поддерживаемой и не замедляет релизы.',
      ],
      antiPattern:
        'Не наращивайте дорогой слой медленных тестов быстрее, чем команда способна их поддерживать.',
    };
  }

  return {
    model: 'Balanced test mix',
    score: 68,
    rationale: [
      'Стратегия должна раскладывать риски по уровням, а не дублировать один и тот же сценарий на каждом слое.',
      'Главная цель не количество тестов, а качество обратной связи и предсказуемость изменений.',
    ],
    antiPattern: 'Не путайте “больше тестов” с “лучше распределённая уверенность”.',
  };
}

export async function lessonShellLoader() {
  await wait(60);

  return {
    loadedAt: stamp(),
    totalGuides: filterGuidesByFocus('all').length,
    implementedTestLayers: 4,
    realTestFiles: 4,
  };
}

export async function overviewLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const focus = parseFocus(url.searchParams.get('focus'));
  const cards = filterGuidesByFocus(focus);

  await wait(120);

  return {
    focus,
    cards,
    requestUrl: `${url.pathname}${url.search}`,
    loadedAt: stamp(),
  };
}

export async function e2eLoader() {
  await wait(100);

  return {
    loadedAt: stamp(),
    journeys: journeySpecs,
  };
}

export type LessonShellLoaderData = Awaited<ReturnType<typeof lessonShellLoader>>;
export type OverviewLoaderData = Awaited<ReturnType<typeof overviewLoader>>;
export type E2ELoaderData = Awaited<ReturnType<typeof e2eLoader>>;
