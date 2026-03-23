import type { LoaderFunctionArgs } from 'react-router-dom';

import {
  filterGuidesByFocus,
  queryTargets,
  smellCards,
  type OverviewFocus,
  type QueryTargetId,
} from './rtl-domain';

const focusValues = new Set<OverviewFocus>([
  'all',
  'queries',
  'interactions',
  'forms',
  'providers',
  'strategy',
]);

function stamp() {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date());
}

export type QueryRecommendation = {
  method: string;
  reason: string;
  antiPattern: string;
};

export type InteractionScenarioInput = {
  multiStep: boolean;
  asyncUi: boolean;
  changesFocus: boolean;
  textEntry: boolean;
};

export type FormCoverageInput = {
  validatesBeforeSubmit: boolean;
  showsFieldErrors: boolean;
  showsSuccessState: boolean;
  keepsAccessibleRoles: boolean;
  resetsOnlyOnSuccess: boolean;
};

export type CustomRenderInput = {
  needsRouter: boolean;
  needsProvider: boolean;
  repeatedSetup: boolean;
  mixesUserPaths: boolean;
};

export type SmellInput = {
  readsInternalState: boolean;
  mocksSetState: boolean;
  queriesByClassName: boolean;
  assertsVisibleResult: boolean;
  hidesProviderNoise: boolean;
};

export type LessonShellLoaderData = {
  loadedAt: string;
  totalGuides: number;
  realRtlSuites: number;
  helperFiles: number;
  realTestFiles: number;
};

export type OverviewLoaderData = {
  focus: OverviewFocus;
  cards: ReturnType<typeof filterGuidesByFocus>;
  requestUrl: string;
  loadedAt: string;
};

export function parseFocus(value: string | null): OverviewFocus {
  return focusValues.has(value as OverviewFocus) ? (value as OverviewFocus) : 'all';
}

export function lessonShellLoader(): LessonShellLoaderData {
  return {
    loadedAt: stamp(),
    totalGuides: 5,
    realRtlSuites: 4,
    helperFiles: 1,
    realTestFiles: 5,
  };
}

export function overviewLoader({ request }: LoaderFunctionArgs): OverviewLoaderData {
  const url = new URL(request.url);
  const focus = parseFocus(url.searchParams.get('focus'));

  return {
    focus,
    cards: filterGuidesByFocus(focus),
    requestUrl: `${url.pathname}${url.search}`,
    loadedAt: stamp(),
  };
}

export function recommendPrimaryQuery(targetId: QueryTargetId): QueryRecommendation {
  const target = queryTargets.find((item) => item.id === targetId) ?? queryTargets[0];

  return {
    method: target.recommendedQuery,
    reason: target.why,
    antiPattern: target.avoid,
  };
}

export function recommendInteractionAssertion(input: InteractionScenarioInput) {
  const score =
    (input.multiStep ? 28 : 0) +
    (input.asyncUi ? 27 : 0) +
    (input.changesFocus ? 18 : 0) +
    (input.textEntry ? 17 : 0) +
    20;

  if (input.asyncUi || input.multiStep) {
    return {
      model: 'userEvent + async role assertion',
      score,
      recommendation:
        'Ведите сценарий через userEvent и ждите видимый результат через findByRole или findByText.',
      antiPattern:
        'Не вызывайте handler напрямую и не проверяйте промежуточный state вместо финального UI.',
    };
  }

  return {
    model: 'synchronous userEvent assertion',
    score,
    recommendation:
      'Здесь достаточно userEvent и обычной синхронной проверки по роли, тексту или disabled state.',
    antiPattern:
      'Не добавляйте лишний waitFor, если поведение уже синхронно и полностью видно в DOM.',
  };
}

export function evaluateFormCoverage(input: FormCoverageInput) {
  const missingStates: string[] = [];

  if (!input.validatesBeforeSubmit) {
    missingStates.push('валидация перед submit');
  }

  if (!input.showsFieldErrors) {
    missingStates.push('field errors');
  }

  if (!input.showsSuccessState) {
    missingStates.push('success-state');
  }

  if (!input.keepsAccessibleRoles) {
    missingStates.push('доступные роли ошибок и статусов');
  }

  if (!input.resetsOnlyOnSuccess) {
    missingStates.push('устойчивый reset flow');
  }

  const score = 100 - missingStates.length * 16;

  return {
    score,
    verdict: missingStates.length === 0 ? 'behavior-complete' : 'gaps-visible',
    missingStates,
    nextAssertion:
      missingStates.length === 0
        ? 'Форма уже проверяется как полноценный пользовательский сценарий.'
        : `Добавьте ещё: ${missingStates.join(', ')}.`,
  };
}

export function recommendCustomRender(input: CustomRenderInput) {
  const pressure =
    (input.needsRouter ? 1 : 0) +
    (input.needsProvider ? 1 : 0) +
    (input.repeatedSetup ? 1 : 0) +
    (input.mixesUserPaths ? 1 : 0);

  if (pressure >= 3) {
    return {
      model: 'Use a focused custom render helper',
      score: 91,
      rationale:
        'Компонент регулярно требует одни и те же provider/router обёртки, и helper убирает шум из теста.',
      caution:
        'Оставьте в helper только повторяемый setup, а не весь runtime приложения.',
    };
  }

  return {
    model: 'Keep render inline',
    score: 68,
    rationale:
      'Окружение пока слишком простое, и отдельный helper скорее скроет setup, чем сделает тест понятнее.',
    caution: 'Не выносите custom render раньше времени только ради абстракции.',
  };
}

export function evaluateTestingSmell(input: SmellInput) {
  const smellScore =
    (input.readsInternalState ? 30 : 0) +
    (input.mocksSetState ? 25 : 0) +
    (input.queriesByClassName ? 20 : 0) -
    (input.assertsVisibleResult ? 20 : 0) -
    (input.hidesProviderNoise ? 10 : 0);

  if (smellScore >= 35) {
    return {
      verdict: 'implementation-centric',
      score: 100 - smellScore,
      betterApproach:
        'Перестройте тест вокруг роли, текста, доступного имени и пользовательского действия.',
      why: smellCards.map((item) => item.title),
    };
  }

  return {
    verdict: 'behavior-oriented',
    score: 88,
    betterApproach:
      'Тест смотрит на пользовательский результат и не привязывается к лишним деталям реализации.',
    why: ['Проверяются видимые последствия', 'Лишние детали реализации не доминируют'],
  };
}
