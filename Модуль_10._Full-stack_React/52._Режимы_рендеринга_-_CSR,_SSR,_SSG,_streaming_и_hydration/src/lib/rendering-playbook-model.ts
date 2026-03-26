import type { ModeId } from './render-mode-model';

export type RenderingScenario = {
  seoCritical: boolean;
  pageMostlyStatic: boolean;
  contentChangesPerRequest: boolean;
  personalizedAboveFold: boolean;
  fastShellMatters: boolean;
  heavyInteractiveWidgets: boolean;
  serverCanStream: boolean;
};

export type RenderingDecision = {
  primaryMode: ModeId;
  reason: string;
  risks: string[];
};

export function chooseRenderingStrategy(scenario: RenderingScenario): RenderingDecision {
  if (
    scenario.pageMostlyStatic &&
    scenario.seoCritical &&
    !scenario.contentChangesPerRequest
  ) {
    return {
      primaryMode: 'ssg',
      reason:
        'HTML можно подготовить заранее, а ценность дают SEO, CDN-кэш и минимальная стоимость на запрос.',
      risks: [
        'Следите, чтобы build-time данные не устаревали дольше, чем это терпимо для страницы.',
        'Не переносите в SSG то, что зависит от пользователя уже в первом экране.',
      ],
    };
  }

  if (
    scenario.serverCanStream &&
    scenario.fastShellMatters &&
    (scenario.personalizedAboveFold || scenario.contentChangesPerRequest)
  ) {
    return {
      primaryMode: 'streaming',
      reason:
        'Нужен ранний shell, но при этом часть данных готова позже или зависит от сервера на каждый запрос.',
      risks: [
        'Streaming без хороших Suspense boundaries превращается в каскад fallback-ов.',
        'Нужно дисциплинированно отслеживать hydration и mismatch в streamed секциях.',
      ],
    };
  }

  if (
    scenario.seoCritical ||
    scenario.personalizedAboveFold ||
    scenario.contentChangesPerRequest
  ) {
    return {
      primaryMode: 'ssr',
      reason:
        'Серверный HTML полезен уже на первом запросе, а данные слишком динамичны для build-time артефакта.',
      risks: [
        'SSR не отменяет hydration cost: клиент всё равно должен оживить серверный HTML.',
        'Per-request рендер повышает требования к инфраструктуре и кэш-стратегии.',
      ],
    };
  }

  return {
    primaryMode: 'csr',
    reason:
      'Экран в первую очередь клиентский, SEO вторичен, а данные и взаимодействия естественно живут после boot приложения.',
    risks: [
      'Не маскируйте пустой первый экран сложным skeleton UX, если HTML всё равно приходит слишком поздно.',
      'Если requirements изменятся в сторону SEO или indexable content, переход на SSR/SSG придётся проектировать заранее.',
    ],
  };
}
