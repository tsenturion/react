export function describeCloneMode(composeHandlers: boolean): {
  title: string;
  note: string;
} {
  if (composeHandlers) {
    return {
      title: 'compose original handler + injected handler',
      note: 'Так toolbar сохраняет поведение ребёнка, но усложняет reasoning и последовательность эффектов.',
    };
  }

  return {
    title: 'override child handler',
    note: 'Так cloneElement становится особенно хрупким: родитель незаметно забирает контроль над дочерним поведением.',
  };
}

export const cloneElementRisks = [
  'cloneElement скрывает точку изменения props и затрудняет чтение data flow.',
  'Неосторожный cloneElement легко перезаписывает onClick, className, aria-атрибуты и refs.',
  'Если дочерний элемент невалиден или имеет неожиданный контракт, adapter быстро становится хрупким.',
  'Когда можно выразить то же через явные props, обычно это лучше, чем element cloning.',
] as const;
