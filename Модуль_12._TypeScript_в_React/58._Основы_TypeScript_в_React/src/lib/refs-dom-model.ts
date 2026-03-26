export type RefScenario = {
  readonly id: 'input-ref' | 'list-ref' | 'timer-ref';
  readonly label: string;
  readonly nodeType: string;
  readonly risk: string;
  readonly safePattern: string;
};

export const refScenarios: readonly RefScenario[] = [
  {
    id: 'input-ref',
    label: 'Input ref',
    nodeType: 'HTMLInputElement | null',
    risk: 'Без типа легко забыть, какой именно DOM API у узла доступен.',
    safePattern: 'Проверяйте `current !== null` и только потом вызывайте `focus()`.',
  },
  {
    id: 'list-ref',
    label: 'List ref',
    nodeType: 'HTMLUListElement | null',
    risk: 'Ref к списку и ref к полю ввода имеют разные DOM-методы и не должны смешиваться.',
    safePattern:
      'Держите каждый ref под конкретный HTML-элемент, а не под абстрактный `Element`.',
  },
  {
    id: 'timer-ref',
    label: 'Timer ref',
    nodeType: 'ReturnType<typeof setTimeout> | null',
    risk: 'Без типа таймер легко перепутать с числом или DOM-узлом, особенно в браузерно-независимом коде.',
    safePattern:
      'Типизируйте handle через `ReturnType<typeof setTimeout>` и обнуляйте после cleanup.',
  },
] as const;
