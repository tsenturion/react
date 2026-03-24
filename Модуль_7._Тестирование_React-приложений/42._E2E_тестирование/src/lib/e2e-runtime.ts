import type { LoaderFunctionArgs } from 'react-router-dom';

import { filterGuidesByFocus, sanitizeIntentPath, type GuideFocus } from './e2e-domain';

export type LessonShellLoaderData = {
  loadedAt: string;
  realE2EScenarios: number;
  hiddenScreens: number;
  supportingVitestSuites: number;
};

export type OverviewLoaderData = {
  focus: GuideFocus;
  guides: ReturnType<typeof filterGuidesByFocus>;
  requestUrl: string;
};

export type RoutePlanningInput = {
  spansMultipleScreens: boolean;
  dependsOnUrl: boolean;
  needsRedirects: boolean;
  assertsImplementationDetails: boolean;
};

export type FormJourneyInput = {
  checksValidation: boolean;
  followsNavigation: boolean;
  verifiesReviewScreen: boolean;
  inspectsInternalState: boolean;
};

export type DataJourneyInput = {
  coversLoading: boolean;
  coversRetry: boolean;
  coversError: boolean;
  usesFixedWait: boolean;
};

export type BoundaryInput = {
  crossesRouting: boolean;
  crossesAuth: boolean;
  crossesData: boolean;
  alreadyCoveredLower: boolean;
};

function timestamp() {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

export function parseFocus(value: string | null): GuideFocus {
  if (
    value === 'routes' ||
    value === 'auth' ||
    value === 'forms' ||
    value === 'data' ||
    value === 'boundaries'
  ) {
    return value;
  }

  return 'all';
}

export async function lessonShellLoader(): Promise<LessonShellLoaderData> {
  return {
    loadedAt: timestamp(),
    realE2EScenarios: 3,
    hiddenScreens: 3,
    supportingVitestSuites: 3,
  };
}

export async function overviewLoader({
  request,
}: LoaderFunctionArgs): Promise<OverviewLoaderData> {
  const url = new URL(request.url);
  const focus = parseFocus(url.searchParams.get('focus'));

  return {
    focus,
    guides: filterGuidesByFocus(focus),
    requestUrl: `${url.pathname}${url.search}`,
  };
}

export function evaluateRoutePlanning(input: RoutePlanningInput) {
  const score =
    Number(input.spansMultipleScreens) * 30 +
    Number(input.dependsOnUrl) * 25 +
    Number(input.needsRedirects) * 25 -
    Number(input.assertsImplementationDetails) * 35;

  if (score >= 55) {
    return {
      model: 'E2E route journey оправдан',
      score,
      nextAssertion: 'Проверяйте URL, redirect и итоговый экран как один путь.',
    };
  }

  return {
    model: 'Ниже уровня браузерного сценария',
    score,
    nextAssertion:
      'Если экран один и URL не меняет смысл сценария, сначала ищите lower-level слой.',
  };
}

export function summarizeFormJourney(input: FormJourneyInput) {
  const score =
    Number(input.checksValidation) * 20 +
    Number(input.followsNavigation) * 30 +
    Number(input.verifiesReviewScreen) * 30 -
    Number(input.inspectsInternalState) * 35;

  return {
    score,
    verdict:
      score >= 45
        ? 'Форма выражена как полноценный journey'
        : 'Сценарий пока слишком похож на локальную проверку формы',
  };
}

export function summarizeDataJourney(input: DataJourneyInput) {
  const score =
    Number(input.coversLoading) * 20 +
    Number(input.coversRetry) * 25 +
    Number(input.coversError) * 25 -
    Number(input.usesFixedWait) * 35;

  return {
    score,
    verdict:
      score >= 45
        ? 'Покрывается реальное восстановление пользовательского пути'
        : 'Пока тест больше похож на хрупкий async smoke без ясной причины падения',
  };
}

export function evaluateBoundaryDecision(input: BoundaryInput) {
  const score =
    Number(input.crossesRouting) * 25 +
    Number(input.crossesAuth) * 25 +
    Number(input.crossesData) * 25 -
    Number(input.alreadyCoveredLower) * 20;

  return {
    score,
    verdict:
      score >= 50
        ? 'E2E нужен как системная страховка'
        : 'Лучше усилить component/integration слой и оставить E2E точечным',
  };
}

export { sanitizeIntentPath };
