export type OverviewFocus =
  | 'all'
  | 'children'
  | 'elements'
  | 'refs'
  | 'context'
  | 'migration';

export type LegacyApiCard = {
  id: string;
  focus: Exclude<OverviewFocus, 'all'>;
  title: string;
  blurb: string;
  whyItMatters: string;
  caution: string;
  modernAlternative: string;
};

const overviewCards: readonly LegacyApiCard[] = [
  {
    id: 'children',
    focus: 'children',
    title: 'Children API работает с opaque structure, а не с отрендеренным деревом',
    blurb:
      'Children.count, map и toArray видят только то, что реально передано как children, а не то, что потом нарендерят вложенные компоненты.',
    whyItMatters:
      'Это важно для compound-компонентов, slot APIs и любых старых children-паттернов.',
    caution:
      'Если ожидать доступ к финальному subtree, легко получить неверные count, broken slots и странные edge cases.',
    modernAlternative:
      'Предпочитайте явные props, arrays of data или context, когда children становятся слишком неявными.',
  },
  {
    id: 'clone-element',
    focus: 'elements',
    title: 'cloneElement меняет дочерний элемент неявно',
    blurb:
      'API позволяет внедрять props в уже созданный element и поверхностно модифицировать его поведение.',
    whyItMatters:
      'Это до сих пор встречается в старых toolbars, slot wrappers и design-system adapters.',
    caution:
      'cloneElement легко перезаписывает обработчики, refs и semantic contracts дочернего элемента.',
    modernAlternative:
      'Чаще безопаснее дать явный render API, context или прямые props на адаптер-компонент.',
  },
  {
    id: 'create-element',
    focus: 'elements',
    title: 'createElement показывает низкоуровневую модель под JSX',
    blurb:
      'JSX - это более удобная форма записи того же tree creation, который вручную строится через createElement.',
    whyItMatters:
      'Понимание createElement помогает читать старые factories, runtime registries и generated UI trees.',
    caution:
      'Вручную писать createElement там, где JSX проще и яснее, обычно только ухудшает читаемость.',
    modernAlternative:
      'Используйте JSX по умолчанию, а createElement оставляйте для динамических factories и внутренних adapters.',
  },
  {
    id: 'ref-migration',
    focus: 'refs',
    title: 'forwardRef больше не единственный путь для function components',
    blurb:
      'createRef и forwardRef долго были стандартной парой для imperative bridges, но React 19 добавил ref-as-prop.',
    whyItMatters:
      'Это меняет migration strategy для старых ref wrappers и уменьшает количество лишних обёрток.',
    caution:
      'Ref всё ещё остаётся escape hatch и не должен превращаться в скрытый канал передачи бизнес-данных.',
    modernAlternative:
      'Если компонент просто пробрасывает ref к DOM, в React 19 стоит рассматривать ref-as-prop.',
  },
  {
    id: 'context',
    focus: 'context',
    title: 'Context до hooks выглядел иначе',
    blurb:
      'Class components читали context через contextType или Consumer, а ещё раньше существовал legacy context API с childContextTypes.',
    whyItMatters: 'Этот код всё ещё живёт в долгоживущих приложениях и migration layers.',
    caution:
      'Старые context-подходы трудно отлаживать, если границы provider и потребителей неочевидны.',
    modernAlternative:
      'Сегодня useContext даёт более прямую и читаемую модель, но старые потребители нужно уметь читать.',
  },
  {
    id: 'migration',
    focus: 'migration',
    title: 'Legacy API требуют migration-first оптики, а не слепого запрета',
    blurb:
      'Часть API стоит оставить в адаптерных слоях, часть лучше заменить явной композицией, а часть нужно просто понимать при чтении кода.',
    whyItMatters:
      'Такой взгляд помогает поддерживать код без лишних переписываний и регрессий.',
    caution:
      'Полное “запретить всё legacy” часто приводит к более сложной и менее понятной миграции.',
    modernAlternative:
      'Сначала определяйте ответственность конкретного API, а уже потом выбирайте замену.',
  },
] as const;

export const legacyApiComparisonRows = [
  {
    legacy: 'Children.map / toArray',
    modern: 'явные props, arrays of data, context',
    note: 'Когда структура данных явная, reasoning проще, чем у opaque children.',
  },
  {
    legacy: 'cloneElement',
    modern: 'render props, slots, context, explicit wrapper props',
    note: 'Неявная модификация дочернего элемента часто проигрывает явному API.',
  },
  {
    legacy: 'createElement factory',
    modern: 'JSX + registry helpers',
    note: 'JSX лучше читается, если tree не создаётся из truly dynamic descriptors.',
  },
  {
    legacy: 'forwardRef',
    modern: 'ref-as-prop в React 19',
    note: 'Новый стиль уменьшает wrapper noise, но ref всё равно остаётся escape hatch.',
  },
  {
    legacy: 'contextType / Consumer',
    modern: 'useContext',
    note: 'Современная модель короче и лучше выражает data dependency.',
  },
] as const;

export function parseOverviewFocus(value: string | null): OverviewFocus {
  switch (value) {
    case 'children':
    case 'elements':
    case 'refs':
    case 'context':
    case 'migration':
      return value;
    default:
      return 'all';
  }
}

export function filterOverviewCardsByFocus(
  focus: OverviewFocus,
): readonly LegacyApiCard[] {
  if (focus === 'all') {
    return overviewCards;
  }

  return overviewCards.filter((card) => card.focus === focus);
}
