export type OverviewFocus =
  | 'all'
  | 'contracts'
  | 'events'
  | 'refs'
  | 'states'
  | 'architecture';

export type OverviewCard = {
  readonly id: string;
  readonly focus: Exclude<OverviewFocus, 'all'>;
  readonly title: string;
  readonly blurb: string;
  readonly whyItMatters: string;
  readonly typicalFailure: string;
};

export const overviewCards: readonly OverviewCard[] = [
  {
    id: 'component-contracts',
    focus: 'contracts',
    title: 'Типы оформляют API компонента, а не просто подписывают props',
    blurb:
      'Хорошо типизированный компонент делает невозможными конфликтующие варианты использования ещё до запуска интерфейса.',
    whyItMatters:
      'Это превращает ошибки API-компонента из runtime-сюрприза в быстрый design feedback прямо в редакторе.',
    typicalFailure:
      'Props делают слишком широкими: `string | boolean | any`, а потом компоненты принимают несовместимые комбинации значений.',
  },
  {
    id: 'typed-events',
    focus: 'events',
    title:
      'Типизация событий помогает работать с реальным источником данных, а не с размытой event-структурой',
    blurb:
      'ChangeEvent, FormEvent и KeyboardEvent подсказывают, где брать `currentTarget`, как читать значение и как не терять форму данных.',
    whyItMatters:
      'UI-логика становится устойчивее: меньше случайной работы с `target`, меньше неявных преобразований и меньше сломанных форм.',
    typicalFailure:
      'Событие типизируют слишком слабо или через `any`, а затем читают из `target` не тот элемент и получают рассыпающийся submit flow.',
  },
  {
    id: 'typed-refs',
    focus: 'refs',
    title:
      'Refs и DOM-узлы без типов быстро превращаются в источник скрытых null и несовместимых вызовов',
    blurb:
      'TypeScript помогает явно оформлять ref к `HTMLInputElement`, `HTMLUListElement` или таймеру автосохранения.',
    whyItMatters:
      'Так imperatively управляемые части интерфейса перестают быть слепой зоной между React и DOM.',
    typicalFailure:
      'Ref оставляют без типа, потом вызывают DOM API не у того узла или забывают про `null` после unmount.',
  },
  {
    id: 'typed-ui-states',
    focus: 'states',
    title:
      'Discriminated unions делают loading/error/empty/ready состояния частью модели, а не набором флагов',
    blurb:
      'Вместо нескольких boolean-флагов экран получает явную state machine, где каждая ветка данных и UI описана отдельно.',
    whyItMatters:
      'Это резко снижает количество невозможных комбинаций вроде “loading=true и data уже есть, но error тоже висит”.',
    typicalFailure:
      'Состояние раскладывают по нескольким независимым флагам, а потом интерфейс оказывается сразу и пустым, и загруженным, и ошибочным.',
  },
  {
    id: 'architecture-feedback',
    focus: 'architecture',
    title:
      'Ошибки типов полезны не как формальность, а как сигнал плохой границы между данными, компонентом и UI',
    blurb:
      'Часто type error показывает не “надо добавить `as`”, а то, что API компонента слишком расплывчатый или модель состояния не оформлена.',
    whyItMatters:
      'Это позволяет использовать TypeScript как инструмент обучения правильной архитектуре, а не как набор препятствий на сборке.',
    typicalFailure:
      'Вместо пересмотра модели данных проблему “чинят” через `as any`, и весь смысл типизации исчезает.',
  },
] as const;

export function parseOverviewFocus(value: string | null): OverviewFocus {
  if (
    value === 'contracts' ||
    value === 'events' ||
    value === 'refs' ||
    value === 'states' ||
    value === 'architecture'
  ) {
    return value;
  }

  return 'all';
}

export function filterOverviewCardsByFocus(
  focus: OverviewFocus,
): readonly OverviewCard[] {
  if (focus === 'all') {
    return overviewCards;
  }

  return overviewCards.filter((card) => card.focus === focus);
}
