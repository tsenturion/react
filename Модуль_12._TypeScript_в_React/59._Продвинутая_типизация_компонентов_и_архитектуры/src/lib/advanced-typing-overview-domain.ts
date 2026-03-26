export type OverviewFocus =
  | 'all'
  | 'reducers'
  | 'generics'
  | 'polymorphic'
  | 'design-system'
  | 'architecture';

export type OverviewCard = {
  id: string;
  focus: Exclude<OverviewFocus, 'all'>;
  title: string;
  blurb: string;
  whyItMatters: string;
  typicalFailure: string;
};

const overviewCards: readonly OverviewCard[] = [
  {
    id: 'reducer-branching',
    focus: 'reducers',
    title: 'Typed reducers превращают editor flow в конечную модель',
    blurb:
      'Discriminated unions связывают вид действия, ветку состояния и разрешённые переходы.',
    whyItMatters:
      'Вы раньше видите невозможные переходы и перестаёте держать сложный экран на связанных boolean-флагах.',
    typicalFailure:
      'Один loose reducer принимает `payload: any`, и через пару итераций одна ветка silently перестаёт поддерживать новую форму данных.',
  },
  {
    id: 'generic-abstractions',
    focus: 'generics',
    title: 'Generics полезны там, где у API есть повторяемая форма',
    blurb:
      'Generic component должен абстрагировать структуру взаимодействия, а не прятать предметный смысл за буквой `T`.',
    whyItMatters:
      'Так reusable API остаётся читаемым и переносится между сущностями без копирования целых компонентных деревьев.',
    typicalFailure:
      'Компонент делают generic “на всякий случай”, а потом половина props превращается в сложные callbacks и API становится сложнее, чем две отдельные реализации.',
  },
  {
    id: 'polymorphic-semantics',
    focus: 'polymorphic',
    title: 'Polymorphic components меняют не только тег, но и семантику',
    blurb:
      'С `as`-pattern компонент должен переносить role, keyboard behavior и допустимые props вместе с рендером.',
    whyItMatters:
      'Вы не теряете доступность и не размазываете ответственность между “универсальным” primitive и его вызывающим кодом.',
    typicalFailure:
      'Primitive умеет рендериться “кем угодно”, но контракт перестаёт подсказывать, когда нужен `href`, когда `onClick`, а когда элемент вообще не должен быть интерактивным.',
  },
  {
    id: 'design-system-recipes',
    focus: 'design-system',
    title: 'Design-system typing оформляет token layer как контракт, а не набор строк',
    blurb:
      'Варианты размера, тона и режима действия лучше держать в typed recipes и token maps.',
    whyItMatters:
      'Так primitive layer становится устойчивым: поддерживаемые варианты видны прямо в API и не расходятся с class maps.',
    typicalFailure:
      'Variant names живут строками в трёх местах сразу, и новый режим добавляется в JSX, но забывается в token maps и документации.',
  },
  {
    id: 'architecture-feedback',
    focus: 'architecture',
    title: 'Ошибка типа часто сигнализирует о слабой границе архитектуры',
    blurb:
      'Если reducer, generic API или primitive трудно типизировать, проблема нередко в самом контракте, а не в синтаксисе TypeScript.',
    whyItMatters:
      'Типы помогают проектировать выразительные компоненты и обнаруживать перегруженные abstraction layers раньше runtime.',
    typicalFailure:
      'Команда пытается “победить TypeScript”, хотя реальная проблема в том, что один компонент тянет и business rules, и transport details, и visual variants.',
  },
] as const;

export function parseOverviewFocus(value: string | null): OverviewFocus {
  switch (value) {
    case 'reducers':
    case 'generics':
    case 'polymorphic':
    case 'design-system':
    case 'architecture':
      return value;
    default:
      return 'all';
  }
}

export function filterOverviewCardsByFocus(
  focus: OverviewFocus,
): readonly OverviewCard[] {
  if (focus === 'all') {
    return overviewCards;
  }

  return overviewCards.filter((card) => card.focus === focus);
}
