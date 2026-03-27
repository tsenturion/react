import type { LabId } from './learning-model';

export type GuideFocus = 'unit' | 'component' | 'integration' | 'e2e' | 'strategy';
export type TestingFocus = 'all' | GuideFocus;
export type RiskLevel = 'low' | 'medium' | 'high';
export type ReleaseScope = 'visual' | 'flow' | 'critical';
export type TestLayer = 'unit' | 'component' | 'integration' | 'e2e';

export type TestingGuide = {
  id: string;
  title: string;
  focus: GuideFocus;
  summary: string;
  bestFor: string;
  avoidWhen: string;
  pitfalls: readonly string[];
};

export type JourneySpec = {
  id: string;
  title: string;
  touchesRouter: boolean;
  touchesNetwork: boolean;
  touchesBrowserApi: boolean;
  criticality: RiskLevel;
  whyE2E: string;
  commonMistake: string;
};

export type BehaviorPreset = {
  id: string;
  title: string;
  risk: RiskLevel;
  description: string;
};

export const testingGuides: readonly TestingGuide[] = [
  {
    id: 'unit-logic',
    title: 'Unit tests',
    focus: 'unit',
    summary:
      'Лучше всего подходят для чистых функций, вычислений, нормализации данных и business rules без UI.',
    bestFor:
      'Pure logic, deterministic branches, форматирование, маппинг состояний и вычисление derived values.',
    avoidWhen:
      'Если весь смысл сценария в реальном взаимодействии человека с компонентом или в связке нескольких слоёв.',
    pitfalls: [
      'Не превращайте unit-тест в псевдо-компонентный тест с кучей моков.',
      'Не проверяйте внутренние переменные вместо результата, который реально важен.',
    ],
  },
  {
    id: 'component-behavior',
    title: 'Component tests',
    focus: 'component',
    summary:
      'Проверяют поведение одного компонента через доступный UI, роли, лейблы и взаимодействия.',
    bestFor:
      'Form states, disabled/enabled transitions, banners, validation, conditional rendering и accessibility contracts.',
    avoidWhen:
      'Если нужно проверить сквозной путь через несколько экранов, URL, сеть и browser-level интеграции.',
    pitfalls: [
      'Не тестируйте private methods, props drilling и внутренний state напрямую.',
      'Не привязывайте assertions к classname и implementation details без реальной причины.',
    ],
  },
  {
    id: 'integration-workflows',
    title: 'Integration tests',
    focus: 'integration',
    summary:
      'Проверяют связку нескольких компонентов и слоёв внутри одного пользовательского сценария.',
    bestFor:
      'Flows, где важны последовательность действий, shared state, derived banners и согласованность UI.',
    avoidWhen:
      'Если ценность сценария уже полностью покрывается unit или одиночным component test.',
    pitfalls: [
      'Не делайте integration test просто “большим unit-тестом” с моками на всё подряд.',
      'Не дублируйте один и тот же happy-path одновременно десятком тестов на соседних уровнях.',
    ],
  },
  {
    id: 'e2e-journeys',
    title: 'E2E tests',
    focus: 'e2e',
    summary:
      'Проверяют браузерный путь пользователя на уровне всего приложения: маршруты, реальные страницы и критические переходы.',
    bestFor:
      'Auth flows, checkout, publish flow, URL state, навигацию, критические бизнес-маршруты и browser-only интеграции.',
    avoidWhen:
      'Если сценарий не приносит новой уверенности по сравнению с integration test, но резко повышает стоимость и флаки.',
    pitfalls: [
      'Не пытайтесь покрыть E2E каждый мелкий if и каждый частный branch.',
      'Не используйте E2E как замену отсутствующей unit/component/integration стратегии.',
    ],
  },
  {
    id: 'strategy-growth',
    title: 'Test strategy as architecture',
    focus: 'strategy',
    summary:
      'Стратегия тестирования должна расти вместе с приложением, а не жить как случайный набор разрозненных проверок.',
    bestFor:
      'Распределение confidence по слоям, снижение дублей, контроль стоимости и поддержание поведения приложения устойчивым.',
    avoidWhen:
      'Если тесты пишутся без понимания, какую именно уверенность должен дать каждый уровень.',
    pitfalls: [
      'Не делайте ставку только на один слой, например только на E2E или только на unit.',
      'Не меряйте качество количеством тестов без связи с реальными рисками приложения.',
    ],
  },
] as const;

export const journeySpecs: readonly JourneySpec[] = [
  {
    id: 'login-publish',
    title: 'Вход -> черновик -> публикация',
    touchesRouter: true,
    touchesNetwork: true,
    touchesBrowserApi: false,
    criticality: 'high',
    whyE2E:
      'Сценарий пересекает маршруты, form flow и подтверждение результата на уровне всего пользовательского пути.',
    commonMistake:
      'Пытаться доказать эту связку только локальными unit-testами без реального маршрута и переходов.',
  },
  {
    id: 'filters-url',
    title: 'Фильтры и URL state',
    touchesRouter: true,
    touchesNetwork: false,
    touchesBrowserApi: false,
    criticality: 'medium',
    whyE2E:
      'Важно проверить, что фильтр, URL, back navigation и восстановление экрана действительно работают как единый путь.',
    commonMistake:
      'Тестировать только reducer фильтров и не проверять, как поведение выглядит в браузере.',
  },
  {
    id: 'editor-hotkeys',
    title: 'Редактор и browser APIs',
    touchesRouter: false,
    touchesNetwork: false,
    touchesBrowserApi: true,
    criticality: 'medium',
    whyE2E:
      'Когда сценарий зависит от фокуса, клавиатуры и browser-level поведения, E2E даёт то, что сложно честно воспроизвести ниже.',
    commonMistake:
      'Подменять browser API настолько сильно, что тест уже не показывает реальный пользовательский путь.',
  },
] as const;

export const behaviorPresets: readonly BehaviorPreset[] = [
  {
    id: 'tiny-copy',
    title: 'Короткий черновик',
    risk: 'low',
    description:
      'Нужно показать disabled state и минимальную валидацию без сетевой логики.',
  },
  {
    id: 'risky-flow',
    title: 'Рискованный сценарий',
    risk: 'high',
    description:
      'Нужно быстро увидеть, как компонент меняет предупреждения и CTA при росте риска.',
  },
  {
    id: 'balanced-note',
    title: 'Сбалансированная заметка',
    risk: 'medium',
    description: 'Нужен обычный пользовательский путь без лишних технических деталей.',
  },
] as const;

export function describeLabFromPath(pathname: string): LabId | null {
  if (pathname.startsWith('/testing-strategy-overview')) {
    return 'overview';
  }

  if (pathname.startsWith('/unit-strategy')) {
    return 'unit';
  }

  if (pathname.startsWith('/component-behavior')) {
    return 'component';
  }

  if (pathname.startsWith('/integration-workflow')) {
    return 'integration';
  }

  if (pathname.startsWith('/e2e-journeys')) {
    return 'e2e';
  }

  if (pathname.startsWith('/testing-architecture')) {
    return 'architecture';
  }

  return null;
}

export function filterGuidesByFocus(focus: TestingFocus) {
  return focus === 'all'
    ? [...testingGuides]
    : testingGuides.filter((item) => item.focus === focus);
}
