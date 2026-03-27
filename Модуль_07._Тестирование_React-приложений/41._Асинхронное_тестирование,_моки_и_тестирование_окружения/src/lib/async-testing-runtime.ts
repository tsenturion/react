import type { LoaderFunctionArgs } from 'react-router-dom';

import {
  demoRecords,
  filterGuidesByFocus,
  setupCards,
  type AsyncRecord,
  type AsyncScenario,
  type GuideFocus,
  type MockScope,
} from './async-testing-domain';

export type LessonShellLoaderData = {
  loadedAt: string;
  realAsyncSuites: number;
  mockUtilities: number;
  providerHelpers: number;
  environmentResets: number;
};

export type OverviewLoaderData = {
  focus: GuideFocus;
  guides: ReturnType<typeof filterGuidesByFocus>;
  setupCards: typeof setupCards;
};

export type WaitingStrategyInput = {
  coversLoading: boolean;
  coversError: boolean;
  coversEmpty: boolean;
  waitsForVisibleResult: boolean;
  usesFixedDelay: boolean;
};

export type MockingStrategyInput = {
  scope: MockScope;
  needsRetry: boolean;
  exercisesProviders: boolean;
  rerendersWithNewInput: boolean;
};

export type ProviderCoverageInput = {
  needsRouter: boolean;
  needsContext: boolean;
  needsSearchParams: boolean;
  hidesUserIntent: boolean;
};

export type EnvironmentSetupInput = {
  resetsMocks: boolean;
  resetsTimers: boolean;
  restoresGlobals: boolean;
  includesJestDom: boolean;
};

export type SmellInput = {
  usesSleep: boolean;
  assertsImplementation: boolean;
  leaksEnvironment: boolean;
  overMocks: boolean;
};

export type AsyncScenarioLoader = (
  scenario: AsyncScenario,
  resourceKey: string,
) => Promise<AsyncRecord[]>;

export function parseFocus(value: string | null): GuideFocus {
  switch (value) {
    case 'async-ui':
    case 'http-mocks':
    case 'providers':
    case 'environment':
    case 'anti-fragility':
      return value;
    default:
      return 'all';
  }
}

export function lessonShellLoader(): LessonShellLoaderData {
  return {
    loadedAt: new Intl.DateTimeFormat('ru-RU', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date()),
    realAsyncSuites: 4,
    mockUtilities: 2,
    providerHelpers: 1,
    environmentResets: 3,
  };
}

export function overviewLoader({ request }: LoaderFunctionArgs): OverviewLoaderData {
  const url = new URL(request.url);
  const focus = parseFocus(url.searchParams.get('focus'));

  return {
    focus,
    guides: filterGuidesByFocus(focus),
    setupCards,
  };
}

export function evaluateWaitingStrategy(input: WaitingStrategyInput) {
  const score =
    Number(input.coversLoading) +
    Number(input.coversError) +
    Number(input.coversEmpty) +
    Number(input.waitsForVisibleResult) -
    Number(input.usesFixedDelay);

  const risks = [
    !input.coversLoading &&
      'Loading-state не зафиксирован, поэтому test flow пропускает начало запроса.',
    !input.coversError &&
      'Ошибки не проверяются, значит retry и alert-contract остаются вне контроля.',
    !input.coversEmpty &&
      'Empty-state не покрыт, поэтому интерфейс может молча деградировать при пустом ответе.',
    !input.waitsForVisibleResult &&
      'Ожидание завязано не на DOM-result, а на косвенные сигналы или внутренние вызовы.',
    input.usesFixedDelay &&
      'Фиксированная пауза делает тест медленным и увеличивает риск flaky-падений.',
  ].filter(Boolean) as string[];

  return {
    score,
    verdict:
      score >= 4
        ? 'Стратегия устойчива'
        : score >= 2
          ? 'Стратегия частично закрывает async UI'
          : 'Стратегия хрупкая',
    nextAssertion: input.waitsForVisibleResult
      ? 'Используйте `findBy*` или `waitFor` только вокруг видимого результата.'
      : 'Сначала зафиксируйте доступный loading/error/success DOM-result.',
    recommendedTools: [
      input.coversLoading && 'Проверка `role="status"` или loading copy',
      input.coversError && 'Проверка `role="alert"` и retry UX',
      input.coversEmpty && 'Проверка empty-state copy или placeholder',
      input.waitsForVisibleResult &&
        '`findByRole` / `findByText` по наблюдаемому контракту',
      !input.usesFixedDelay && 'Отказ от sleep в пользу синхронизации по DOM',
    ].filter(Boolean) as string[],
    risks,
  };
}

export function recommendMockingStrategy(input: MockingStrategyInput) {
  const helpers = [
    input.scope === 'unit' && 'Инъекция client adapter или loader prop',
    input.scope === 'component' &&
      'Локальный `vi.stubGlobal("fetch", ...)` для fetch-границы',
    input.scope === 'integration' && 'Общий mocked transport + provider harness',
    input.needsRetry && 'Сценарий с ошибкой первого ответа и повторной попыткой',
    input.rerendersWithNewInput &&
      'Проверка повторного запроса после rerender или смены filter',
  ].filter(Boolean) as string[];

  return {
    primary:
      input.scope === 'unit'
        ? 'Подменяйте сам источник данных, не поднимая весь DOM-слой.'
        : input.scope === 'component'
          ? 'Мокайте fetch на границе HTTP, но оставляйте UI-поток реальным.'
          : 'Собирайте тест вокруг нескольких слоёв: router, provider и общий transport.',
    rationale:
      input.exercisesProviders || input.scope === 'integration'
        ? 'Здесь важно проверить, как сеть, provider и повторный рендер работают вместе.'
        : 'Можно изолировать только ту границу, которая отделяет компонент от внешнего мира.',
    caution:
      input.scope === 'unit'
        ? 'Не нужно тянуть router и контекст, если контракт ограничен одной pure async-границей.'
        : 'Не мокайте внутренние setState/callback-цепочки, иначе тест потеряет смысл пользовательского сценария.',
    helpers,
  };
}

export function summarizeProviderHarness(input: ProviderCoverageInput) {
  const neededLayers = [
    input.needsRouter && 'router',
    input.needsContext && 'context provider',
    input.needsSearchParams && 'search params',
  ].filter(Boolean) as string[];

  return {
    verdict:
      neededLayers.length >= 3
        ? 'Нужен focused custom render helper'
        : neededLayers.length >= 1
          ? 'Достаточно небольшого helper без лишней магии'
          : 'Provider helper здесь не обязателен',
    contract: neededLayers.length
      ? `Тестовый harness должен поднимать: ${neededLayers.join(', ')}.`
      : 'Компонент почти не зависит от окружения, поэтому helper можно не вводить.',
    helperShape: input.hidesUserIntent
      ? 'Helper сейчас слишком тяжёлый: пользовательский сценарий прячется за инфраструктурой.'
      : 'Helper остаётся прозрачным: он скрывает только повторяемые обёртки.',
    risks: [
      input.hidesUserIntent &&
        'Если helper делает слишком много, читатель теста перестаёт понимать исходные условия сценария.',
      !input.needsRouter &&
        input.needsContext &&
        'Можно ограничиться provider и не подтягивать MemoryRouter без необходимости.',
      input.needsSearchParams &&
        'URL-параметры должны быть частью initial route, а не неявной мутацией после render.',
    ].filter(Boolean) as string[],
  };
}

export function evaluateEnvironmentSetup(input: EnvironmentSetupInput) {
  const completeness =
    Number(input.resetsMocks) +
    Number(input.resetsTimers) +
    Number(input.restoresGlobals) +
    Number(input.includesJestDom);

  return {
    completeness,
    verdict:
      completeness === 4
        ? 'Окружение собрано устойчиво'
        : completeness >= 2
          ? 'Окружение частично защищает suite'
          : 'Окружение хрупкое',
    nextStep: !input.resetsTimers
      ? 'Добавьте возврат к real timers после каждого теста.'
      : !input.restoresGlobals
        ? 'Сбрасывайте глобальные stub после теста, особенно для fetch.'
        : 'Поддерживайте setup минимальным и прозрачным.',
    checklist: [
      input.includesJestDom && '`@testing-library/jest-dom` подключён в общем setup',
      input.resetsMocks && 'Моки восстанавливаются после каждого теста',
      input.resetsTimers && 'Fake timers не протекают между тестами',
      input.restoresGlobals && 'Глобальные stub и fetch не остаются висеть после suite',
    ].filter(Boolean) as string[],
  };
}

export function evaluateTestingSmell(input: SmellInput) {
  const issues = [
    input.usesSleep && 'Тест ждёт время, а не результат.',
    input.assertsImplementation &&
      'Тест фиксирует детали реализации вместо пользовательского сценария.',
    input.leaksEnvironment && 'Моки или таймеры протекают между тестами.',
    input.overMocks && 'Моки перекрывают слишком много слоёв приложения.',
  ].filter(Boolean) as string[];

  return {
    severity:
      issues.length >= 3
        ? 'Высокая хрупкость'
        : issues.length >= 2
          ? 'Средняя хрупкость'
          : 'Граница под контролем',
    recommendation:
      issues.length === 0
        ? 'Стратегия близка к устойчивой: проверяется поведение, а окружение контролируется явно.'
        : 'Уберите лишние sleep/implementation details и сузьте mock до внешней границы.',
    issues,
  };
}

export const defaultAsyncScenarioLoader: AsyncScenarioLoader = (scenario, resourceKey) =>
  new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (scenario === 'error') {
        reject(new Error(`Сценарий ${resourceKey} вернул контролируемую ошибку.`));
        return;
      }

      resolve(
        demoRecords[scenario].map((record) => ({
          ...record,
          id: `${resourceKey}-${record.id}`,
        })),
      );
    }, 550);
  });
