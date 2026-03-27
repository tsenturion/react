import type { LabId } from './learning-model';

export type RequirementPresetId =
  | 'compound-workspace'
  | 'flexible-renderer'
  | 'legacy-wrapper'
  | 'child-decoration'
  | 'logic-only';
export type PatternChoice =
  | 'compound components'
  | 'render props'
  | 'higher-order components'
  | 'cloneElement + Children API'
  | 'custom hook + explicit slots';

export const compoundSections = [
  {
    id: 'overview',
    label: 'Overview',
    description:
      'Общий обзор surface API и причин, почему части компонента вообще должны знать друг о друге.',
    idealFor: 'Tabs, accordion, stepper, menu, form field groups.',
    caution: 'Если части почти не связаны, compound API быстро становится искусственным.',
  },
  {
    id: 'api',
    label: 'API',
    description:
      'Подкомпоненты договариваются через общий context и единый root-контракт.',
    idealFor:
      'Ситуации, где consumer собирает layout из знакомых частей в произвольном порядке.',
    caution:
      'Скрытый context-контракт усложняет чтение, если subcomponents работают и внутри, и вне root.',
  },
  {
    id: 'pitfalls',
    label: 'Pitfalls',
    description:
      'Compound components хороши, пока API остаётся небольшим и части действительно принадлежат одной surface-модели.',
    idealFor: 'Shared state и shared semantics внутри одного widget family.',
    caution:
      'Слишком много subcomponents превращают API в мини-фреймворк с неочевидными правилами.',
  },
] as const;

export const renderItems = [
  {
    id: 'compound',
    title: 'Compound components',
    summary: 'Root хранит общее состояние, а children собирают surface декларативно.',
    risk: 'API становится тяжелее, если частей слишком много.',
    examples: ['Tabs', 'Accordion', 'Menu'],
  },
  {
    id: 'render-props',
    title: 'Render props',
    summary:
      'Компонент инкапсулирует поведение, а render function решает, как показать результат.',
    risk: 'JSX становится шумным, если render functions слишком вложены.',
    examples: ['Data loader', 'Mouse position', 'Selection surface'],
  },
  {
    id: 'hoc',
    title: 'Higher-order components',
    summary:
      'Wrapper-компонент обогащает базовый component дополнительным поведением или данными.',
    risk: 'Wrapper nesting и неочевидный источник props усложняют отладку.',
    examples: ['Legacy analytics', 'Theming wrappers', 'Framework adapters'],
  },
] as const;

export const childModes = [
  {
    id: 'direct',
    label: 'Direct children',
    description:
      'Все children лежат прямо под root-компонентом и готовы принять injected props.',
  },
  {
    id: 'wrapped',
    label: 'Wrapped child',
    description:
      'Один child спрятан во внешний wrapper, и контракт direct child начинает ломаться.',
  },
  {
    id: 'mixed',
    label: 'Mixed content',
    description:
      'Внутри оказывается смесь подходящих children, wrapper-узлов и постороннего контента.',
  },
] as const;

export type PatternRequirements = {
  sharedSubparts: boolean;
  callerControlsMarkup: boolean;
  logicReuseOnly: boolean;
  needInjectIntoChildren: boolean;
  legacyInterop: boolean;
  strongTypingPriority: boolean;
};

export const requirementPresets: readonly (PatternRequirements & {
  id: RequirementPresetId;
  title: string;
})[] = [
  {
    id: 'compound-workspace',
    title: 'Связанный виджет из подкомпонентов',
    sharedSubparts: true,
    callerControlsMarkup: false,
    logicReuseOnly: false,
    needInjectIntoChildren: false,
    legacyInterop: false,
    strongTypingPriority: true,
  },
  {
    id: 'flexible-renderer',
    title: 'Одна логика, много способов визуализации',
    sharedSubparts: false,
    callerControlsMarkup: true,
    logicReuseOnly: false,
    needInjectIntoChildren: false,
    legacyInterop: false,
    strongTypingPriority: false,
  },
  {
    id: 'legacy-wrapper',
    title: 'Наследованный wrapper вокруг набора компонентов',
    sharedSubparts: false,
    callerControlsMarkup: false,
    logicReuseOnly: false,
    needInjectIntoChildren: false,
    legacyInterop: true,
    strongTypingPriority: false,
  },
  {
    id: 'child-decoration',
    title: 'Нужно обойти и украсить прямых детей',
    sharedSubparts: false,
    callerControlsMarkup: false,
    logicReuseOnly: false,
    needInjectIntoChildren: true,
    legacyInterop: false,
    strongTypingPriority: false,
  },
  {
    id: 'logic-only',
    title: 'Нужно переиспользовать только поведение',
    sharedSubparts: false,
    callerControlsMarkup: false,
    logicReuseOnly: true,
    needInjectIntoChildren: false,
    legacyInterop: false,
    strongTypingPriority: true,
  },
] as const;

export type CostPatternId =
  | 'compound components'
  | 'render props'
  | 'higher-order components'
  | 'cloneElement + Children API'
  | 'custom hook + explicit slots';

export type CostScenario = {
  pattern: CostPatternId;
  thirdPartyChildren: boolean;
  wrapperLayers: number;
  implicitContract: boolean;
  typingPressure: 'low' | 'high';
  teamDiscoverability: 'high' | 'low';
};

export const costPatternOptions: readonly CostPatternId[] = [
  'compound components',
  'render props',
  'higher-order components',
  'cloneElement + Children API',
  'custom hook + explicit slots',
] as const;

export const architectureCodeMap: Record<
  LabId,
  readonly { label: string; path: string; note: string }[]
> = {
  compound: [
    {
      label: 'Lesson shell',
      path: 'src/App.tsx',
      note: 'Навигация всего урока собрана через compound tabs, так что паттерн работает и как предмет темы, и как реальный shell приложения.',
    },
    {
      label: 'Compound tabs primitive',
      path: 'src/components/composition-patterns/PatternTabs.tsx',
      note: 'Здесь лежат Root, List, Trigger и Panel с общим context-контрактом.',
    },
  ],
  'render-props': [
    {
      label: 'Render prop primitive',
      path: 'src/components/composition-patterns/SelectionLens.tsx',
      note: 'Компонент держит состояние и отдаёт наружу render function с данными и действиями.',
    },
    {
      label: 'Render props lab',
      path: 'src/components/composition-patterns/RenderPropsLab.tsx',
      note: 'Одна и та же логика рендерится несколькими разными способами через children function.',
    },
  ],
  hoc: [
    {
      label: 'HOC primitive',
      path: 'src/components/composition-patterns/withPatternStatus.tsx',
      note: 'Higher-order component добавляет injected props и фиксирует displayName wrapper-а.',
    },
    {
      label: 'HOC lab',
      path: 'src/components/composition-patterns/HocLab.tsx',
      note: 'Лаборатория показывает и пользу wrapper-подхода, и цену дополнительного слоя абстракции.',
    },
  ],
  children: [
    {
      label: 'Children API primitive',
      path: 'src/components/composition-patterns/ActionRail.tsx',
      note: 'Здесь живут Children.map, isValidElement и cloneElement с прямым child-контрактом.',
    },
    {
      label: 'Children lab',
      path: 'src/components/composition-patterns/ChildrenCloneLab.tsx',
      note: 'Лаборатория делает хрупкость direct child contracts видимой на живом примере.',
    },
  ],
  alternatives: [
    {
      label: 'Recommendation model',
      path: 'src/lib/pattern-recommendation-model.ts',
      note: 'Pure-model слой выбирает паттерн по требованиям сценария, а не по случайной моде.',
    },
    {
      label: 'Alternatives lab',
      path: 'src/components/composition-patterns/AlternativesLab.tsx',
      note: 'Здесь сравниваются паттерны и их современные альтернативы на одинаковых требованиях.',
    },
  ],
  tradeoffs: [
    {
      label: 'Cost model',
      path: 'src/lib/pattern-cost-model.ts',
      note: 'Модель считает риск по wrapper layers, hidden contracts и child fragility.',
    },
    {
      label: 'Trade-offs lab',
      path: 'src/components/composition-patterns/TradeoffsLab.tsx',
      note: 'Лаборатория показывает стоимость паттерна ещё до того, как он стал проблемой в проде.',
    },
  ],
};
