export type CatchabilityCase = {
  id: 'render' | 'descendant' | 'event' | 'async' | 'boundary-self';
  label: string;
  caught: boolean;
  note: string;
};

export const boundaryCatchCases: readonly CatchabilityCase[] = [
  {
    id: 'render',
    label: 'Ошибка прямо в render потомка',
    caught: true,
    note: 'Boundary перехватывает такой сбой и заменяет сломанное поддерево на fallback UI.',
  },
  {
    id: 'descendant',
    label: 'Ошибка глубже в поддереве',
    caught: true,
    note: 'Для boundary не важно, насколько глубоко упал потомок, если ошибка произошла на render-пути.',
  },
  {
    id: 'event',
    label: 'Ошибка внутри event handler',
    caught: false,
    note: 'Event handler уже выполняется вне render-фазы. Boundary не оборачивает такой код автоматически.',
  },
  {
    id: 'async',
    label: 'Ошибка в таймере или promise callback',
    caught: false,
    note: 'Таймеры и async callbacks живут вне render-цикла, поэтому их нужно обрабатывать отдельно.',
  },
  {
    id: 'boundary-self',
    label: 'Ошибка внутри самого fallback или boundary',
    caught: false,
    note: 'Boundary не может спасти сам себя. Для этого нужен boundary уровнем выше.',
  },
] as const;

export const safeDegradationPrinciples = [
  'Локализуйте boundary как можно ближе к рискованной части, но не оборачивайте каждую мелочь без причины.',
  'Fallback должен сохранять контекст: что сломалось, что осталось рабочим и как попытаться восстановиться.',
  'Retry без исправления входных данных редко помогает. Если причина не устранена, boundary упадёт снова.',
  'Shell-level boundary полезен как последняя страховка, но не заменяет локальные boundaries для виджетов и маршрутов.',
] as const;
