export type SuspenseDecision = {
  primaryTool:
    | 'plain-spinner'
    | 'split-boundaries'
    | 'lazy-suspense'
    | 'use-promise'
    | 'server-streaming'
    | 'compose-tools';
  reason: string;
  risks: string[];
};

export type SuspenseScenario = {
  codeSplitNeeded: boolean;
  dataReadInRender: boolean;
  htmlNeededBeforeJs: boolean;
  screenRevealsInParts: boolean;
  oneSlowBlockShouldNotHideWholeScreen: boolean;
  serverCanStream: boolean;
};

export function chooseSuspenseStrategy(scenario: SuspenseScenario): SuspenseDecision {
  if (
    scenario.htmlNeededBeforeJs &&
    scenario.serverCanStream &&
    scenario.screenRevealsInParts
  ) {
    return {
      primaryTool: 'server-streaming',
      reason:
        'Когда shell должен прийти до JS и экран естественно раскрывается кусками, Suspense на сервере становится способом доставки HTML.',
      risks: [
        'Без продуманных boundaries потоковый ответ превратится в шумный каскад fallback-ов.',
        'Нужно понимать, что streaming ускоряет reveal HTML, но не отменяет hydration.',
      ],
    };
  }

  if (scenario.dataReadInRender && scenario.oneSlowBlockShouldNotHideWholeScreen) {
    return {
      primaryTool: 'compose-tools',
      reason:
        'Лучший результат даёт сочетание resource reading через use(Promise) и локальных Suspense boundaries.',
      risks: [
        'Не создавайте новый promise на каждый render: ресурс должен читаться через стабильный cache key.',
        'Границы должны проходить по реальным UX-разрывам, а не по случайным компонентным границам.',
      ],
    };
  }

  if (scenario.dataReadInRender) {
    return {
      primaryTool: 'use-promise',
      reason:
        'Если данные читаются как ресурс во время render, use(Promise) даёт честную Suspense-модель без ручного loading state.',
      risks: [
        'Нельзя строить promise заново на каждый render.',
        'Нужно явно понимать, где ресурс кэшируется и как инвалидируется.',
      ],
    };
  }

  if (scenario.codeSplitNeeded && scenario.oneSlowBlockShouldNotHideWholeScreen) {
    return {
      primaryTool: 'lazy-suspense',
      reason:
        'lazy + локальные Suspense boundaries позволяют догружать код частями, не скрывая весь уже видимый UI.',
      risks: [
        'Один общий fallback вокруг нескольких lazy chunks делает UX хрупким.',
        'После первой загрузки chunk кэшируется: повторное открытие уже ведёт себя иначе.',
      ],
    };
  }

  if (scenario.screenRevealsInParts || scenario.oneSlowBlockShouldNotHideWholeScreen) {
    return {
      primaryTool: 'split-boundaries',
      reason:
        'Экран должен раскрываться по частям, поэтому одна глобальная граница ожидания будет слишком грубой.',
      risks: ['Слишком мелкие boundaries дробят UI и усложняют чтение состояния экрана.'],
    };
  }

  return {
    primaryTool: 'plain-spinner',
    reason:
      'Если экран действительно маленький и ожидание не дробит UX на независимые части, отдельная Suspense-архитектура может быть избыточной.',
    risks: [
      'Не закрепляйтесь на этом решении, если экран вырастет и начнёт требовать частичного reveal.',
    ],
  };
}
