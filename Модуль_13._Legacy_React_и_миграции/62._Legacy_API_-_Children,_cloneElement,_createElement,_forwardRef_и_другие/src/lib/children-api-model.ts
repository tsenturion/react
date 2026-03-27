export type OnlyChildMode = 'single-element' | 'two-elements' | 'text-node';

export function describeOnlyChildMode(mode: OnlyChildMode): {
  title: string;
  expectation: string;
} {
  switch (mode) {
    case 'single-element':
      return {
        title: 'Children.only проходит успешно',
        expectation: 'В children находится ровно один валидный React element.',
      };
    case 'two-elements':
      return {
        title: 'Children.only выбросит ошибку',
        expectation: 'Два sibling elements нарушают контракт single child.',
      };
    case 'text-node':
      return {
        title: 'Children.only не принимает plain text',
        expectation: 'Text node не считается единственным React element для этого API.',
      };
    default:
      return {
        title: 'Неизвестный режим',
        expectation: 'Нужен один валидный element.',
      };
  }
}

export const childrenApiTakeaways = [
  'Children API работает с тем, что реально передано в props.children, а не с результатом render вложенных компонентов.',
  'isValidElement нужен, если вы хотите модифицировать или читать props только у настоящих React elements.',
  'Children.only подходит только для строгого single-slot контракта.',
  'Если children-pattern становится слишком неявным, лучше переходить к явному API.',
] as const;
