import type { StatusTone } from './common';

export type ScreenPresetId = 'catalog' | 'workspace' | 'inspector';
export type DecompositionStrategy = 'monolith' | 'balanced' | 'over-split';
export type BoundaryTone = 'default' | 'accent' | 'cool' | 'dark';
export type BoundaryArea =
  | 'header'
  | 'controls'
  | 'summary'
  | 'content-wide'
  | 'content-narrow'
  | 'aside';

export type BoundaryPart = {
  id: string;
  label: string;
  description: string;
  area: BoundaryArea;
  groupId: string;
};

export type BoundaryGroup = {
  id: string;
  label: string;
  note: string;
  tone: BoundaryTone;
};

export const screenPresets = [
  {
    id: 'catalog',
    label: 'Каталог знаний',
    description: 'Фильтры, summary, список секций, карточки и поясняющая aside-зона.',
  },
  {
    id: 'workspace',
    label: 'Рабочая панель',
    description: 'Toolbar, KPI-блок, основной feed и боковая панель контекста.',
  },
  {
    id: 'inspector',
    label: 'Инспектор дерева',
    description: 'Поиск, summary, дерево узлов, карточка детали и помощник справа.',
  },
] as const satisfies readonly {
  id: ScreenPresetId;
  label: string;
  description: string;
}[];

export const decompositionStrategies = [
  {
    id: 'monolith',
    label: 'Монолитный экран',
    description: 'Один крупный компонент держит почти всё дерево сразу.',
  },
  {
    id: 'balanced',
    label: 'Сбалансированные границы',
    description: 'Экран разбит на части по ответственности и данным.',
  },
  {
    id: 'over-split',
    label: 'Сверхдробление',
    description: 'Слишком много микрокомпонентов ради формального деления.',
  },
] as const satisfies readonly {
  id: DecompositionStrategy;
  label: string;
  description: string;
}[];

const presetParts: Record<ScreenPresetId, readonly Omit<BoundaryPart, 'groupId'>[]> = {
  catalog: [
    {
      id: 'header',
      label: 'Header',
      description: 'Название экрана и короткий контекст.',
      area: 'header',
    },
    {
      id: 'filters',
      label: 'FilterPanel',
      description: 'Поиск, category и mode switches.',
      area: 'controls',
    },
    {
      id: 'summary',
      label: 'SummaryStrip',
      description: 'Видимые карточки, active filters, short counters.',
      area: 'summary',
    },
    {
      id: 'list',
      label: 'SectionList',
      description: 'Группы карточек по категориям.',
      area: 'content-wide',
    },
    {
      id: 'card',
      label: 'Card',
      description: 'Повторяемый leaf-компонент внутри секции.',
      area: 'content-narrow',
    },
    {
      id: 'aside',
      label: 'GuidanceAside',
      description: 'Поясняющий блок и tips по теме.',
      area: 'aside',
    },
  ],
  workspace: [
    {
      id: 'header',
      label: 'WorkspaceHeader',
      description: 'Название панели и переключатели режима.',
      area: 'header',
    },
    {
      id: 'filters',
      label: 'Toolbar',
      description: 'Фильтры, search и actions.',
      area: 'controls',
    },
    {
      id: 'summary',
      label: 'KpiStrip',
      description: 'Главные показатели экрана.',
      area: 'summary',
    },
    {
      id: 'list',
      label: 'WidgetGrid',
      description: 'Основная рабочая зона с виджетами.',
      area: 'content-wide',
    },
    {
      id: 'card',
      label: 'WidgetCard',
      description: 'Повторяемый блок внутри сетки.',
      area: 'content-narrow',
    },
    {
      id: 'aside',
      label: 'InspectorAside',
      description: 'Контекст и вторичный контент.',
      area: 'aside',
    },
  ],
  inspector: [
    {
      id: 'header',
      label: 'TreeHeader',
      description: 'Название дерева и текущий узел.',
      area: 'header',
    },
    {
      id: 'filters',
      label: 'SearchBar',
      description: 'Поиск и режим отображения узлов.',
      area: 'controls',
    },
    {
      id: 'summary',
      label: 'SelectionSummary',
      description: 'Количество узлов и краткий итог.',
      area: 'summary',
    },
    {
      id: 'list',
      label: 'TreePane',
      description: 'Само дерево компонентов.',
      area: 'content-wide',
    },
    {
      id: 'card',
      label: 'NodeCard',
      description: 'Карточка выбранного узла.',
      area: 'content-narrow',
    },
    {
      id: 'aside',
      label: 'HelpAside',
      description: 'Подсказки и контекст.',
      area: 'aside',
    },
  ],
};

const strategyGroups: Record<
  DecompositionStrategy,
  {
    groups: readonly BoundaryGroup[];
    assignments: Record<string, string>;
    componentCount: string;
    propSurface: string;
    changeIsolation: string;
    wins: string[];
    risks: string[];
    componentList: string[];
    tone: StatusTone;
    before: string;
    after: string;
  }
> = {
  monolith: {
    groups: [
      {
        id: 'screen',
        label: 'HugeScreenComponent',
        note: 'Почти весь экран живёт в одном компоненте.',
        tone: 'dark',
      },
    ],
    assignments: {
      header: 'screen',
      filters: 'screen',
      summary: 'screen',
      list: 'screen',
      card: 'screen',
      aside: 'screen',
    },
    componentCount: '1 крупный экран + локальные helpers',
    propSurface: 'Низкая снаружи, но перегруженная внутри',
    changeIsolation: 'Слабая',
    wins: [
      'Быстрый старт для совсем маленького прототипа.',
      'Сразу видно весь экран в одном месте.',
    ],
    risks: [
      'Логика фильтров, summary и списка начинает переплетаться.',
      'Изменение одного участка заставляет перечитывать весь компонент.',
      'Переиспользование почти не появляется без копирования кода.',
    ],
    componentList: ['ScreenPage'],
    tone: 'warn',
    before:
      'Один большой компонент быстро становится местом, где и данные, и обработчики, и разметка смешиваются в один поток.',
    after:
      'Сбалансированное деление отделяет filters, summary, list и aside по ответственности и делает дерево читаемым.',
  },
  balanced: {
    groups: [
      {
        id: 'shell',
        label: 'PageShell',
        note: 'Держит только уровень экрана и его общую композицию.',
        tone: 'dark',
      },
      {
        id: 'controls',
        label: 'FilterPanel',
        note: 'Работает только с вводом и переключателями.',
        tone: 'accent',
      },
      {
        id: 'summary',
        label: 'SummaryStrip',
        note: 'Зависит от производных данных, а не от ручных DOM-команд.',
        tone: 'cool',
      },
      {
        id: 'content',
        label: 'CatalogSurface',
        note: 'Рисует секции и карточки из массива данных.',
        tone: 'default',
      },
      {
        id: 'aside',
        label: 'GuidanceAside',
        note: 'Изолирует вторичный контент от основного списка.',
        tone: 'accent',
      },
    ],
    assignments: {
      header: 'shell',
      filters: 'controls',
      summary: 'summary',
      list: 'content',
      card: 'content',
      aside: 'aside',
    },
    componentCount: '5-7 осмысленных компонентов',
    propSurface: 'Умеренная и читаемая',
    changeIsolation: 'Хорошая',
    wins: [
      'Каждый компонент обслуживает одну зону ответственности.',
      'Дерево можно расширять без переписывания всего экрана.',
      'Пропсы и данные проходят по предсказуемым границам.',
    ],
    risks: [
      'Нужно осознанно выбрать владельца состояния, иначе часть границ станет формальной.',
      'Слишком ранняя абстракция всё ещё может испортить хорошее деление.',
    ],
    componentList: [
      'PageShell',
      'FilterPanel',
      'SummaryStrip',
      'CatalogSurface',
      'CatalogSection',
      'CatalogCard',
      'GuidanceAside',
    ],
    tone: 'success',
    before:
      'Если держать экран монолитом, каждая новая ветка условий растягивает один и тот же render и делает дерево нечитабельным.',
    after:
      'Сбалансированная архитектура проводит границы там, где реально меняются данные, состояние и UI-ответственности.',
  },
  'over-split': {
    groups: [
      {
        id: 'header',
        label: 'HeaderAtom',
        note: 'Даже заголовок вынесен в отдельный tiny component.',
        tone: 'accent',
      },
      {
        id: 'filters',
        label: 'FiltersAtom',
        note: 'Панель уже не ощущается цельной.',
        tone: 'cool',
      },
      {
        id: 'summary',
        label: 'SummaryAtom',
        note: 'Каждая маленькая часть становится отдельным уровнем дерева.',
        tone: 'default',
      },
      {
        id: 'list',
        label: 'ListAtom',
        note: 'Список разбит слишком мелко.',
        tone: 'dark',
      },
      {
        id: 'card',
        label: 'CardAtom',
        note: 'Повторяемая leaf-часть дробится до лишних обёрток.',
        tone: 'accent',
      },
      {
        id: 'aside',
        label: 'AsideAtom',
        note: 'Даже вторичный контент тянет лишние props и уровни.',
        tone: 'cool',
      },
    ],
    assignments: {
      header: 'header',
      filters: 'filters',
      summary: 'summary',
      list: 'list',
      card: 'card',
      aside: 'aside',
    },
    componentCount: '10+ микрокомпонентов',
    propSurface: 'Избыточная',
    changeIsolation: 'Хрупкая',
    wins: [
      'Можно очень точечно переиспользовать tiny pieces, если для этого есть реальная причина.',
    ],
    risks: [
      'Tree depth растёт быстрее пользы.',
      'Пропсы начинают циркулировать между множеством микрослоёв.',
      'Становится трудно понять, где заканчивается ответственность одного узла и начинается другого.',
    ],
    componentList: [
      'HeaderAtom',
      'SearchLabel',
      'SearchInput',
      'FilterToggle',
      'SummaryCounter',
      'ListWrapper',
      'SectionHeading',
      'CardShell',
      'CardTitle',
      'AsideNote',
    ],
    tone: 'error',
    before:
      'Сверхдробление даёт красивую формальную иерархию файлов, но реальная ответственность компонентов распадается на пыль.',
    after:
      'Нужен не максимум компонентов, а разумные границы: enough structure without prop noise.',
  },
};

export function analyzeComponentArchitecture(
  presetId: ScreenPresetId,
  strategy: DecompositionStrategy,
) {
  const preset = screenPresets.find((item) => item.id === presetId) ?? screenPresets[0];
  const strategyDefinition = strategyGroups[strategy];
  const parts = presetParts[preset.id].map((part) => ({
    ...part,
    groupId: strategyDefinition.assignments[part.id] ?? 'screen',
  }));

  return {
    preset,
    tone: strategyDefinition.tone,
    parts,
    groups: strategyDefinition.groups,
    componentCount: strategyDefinition.componentCount,
    propSurface: strategyDefinition.propSurface,
    changeIsolation: strategyDefinition.changeIsolation,
    wins: strategyDefinition.wins,
    risks: strategyDefinition.risks,
    componentList: strategyDefinition.componentList,
    before: strategyDefinition.before,
    after: strategyDefinition.after,
  };
}
