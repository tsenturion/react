export const polymorphicExampleIds = ['button', 'anchor', 'label'] as const;
export type PolymorphicExampleId = (typeof polymorphicExampleIds)[number];

export type PolymorphicExample = {
  id: PolymorphicExampleId;
  title: string;
  renderedAs: 'button' | 'a' | 'label';
  blurb: string;
  runtimeEffect: string;
  risk: string;
};

export const polymorphicExamples: readonly PolymorphicExample[] = [
  {
    id: 'button',
    title: 'Action button',
    renderedAs: 'button',
    blurb:
      'Компонент остаётся интерактивной кнопкой и принимает click-behavior как основную семантику.',
    runtimeEffect: 'Нажатие увеличивает счётчик action activations.',
    risk: 'Если такой primitive типизировать loosely, можно потерять disabled и button semantics.',
  },
  {
    id: 'anchor',
    title: 'Navigation link',
    renderedAs: 'a',
    blurb:
      'Тот же visual primitive переносится на навигацию и начинает требовать `href` и link semantics.',
    runtimeEffect:
      'Клик пишет в log, что navigation intent был пойман без реального перехода.',
    risk: 'Если `href` не станет частью typed contract, компонент визуально выглядит как link, но ведёт себя как произвольный div.',
  },
  {
    id: 'label',
    title: 'Form label',
    renderedAs: 'label',
    blurb:
      'Polymorphic primitive может переключать связанную форму, но только если сохраняет соответствующую HTML-семантику.',
    runtimeEffect:
      'Клик меняет checkbox через `htmlFor`, а не через ручной imperative код.',
    risk: 'Слишком общий `as`-pattern быстро ломает доступность, если primitive не держит семантические ограничения.',
  },
] as const;

export function getPolymorphicExample(id: PolymorphicExampleId): PolymorphicExample {
  return polymorphicExamples.find((item) => item.id === id) ?? polymorphicExamples[0];
}

export function describePolymorphicSemantics(id: PolymorphicExampleId): string {
  switch (id) {
    case 'button':
      return 'urgent action';
    case 'anchor':
      return 'navigation intent';
    case 'label':
      return 'form toggle binding';
    default:
      return id satisfies never;
  }
}

export const polymorphicHelperSnippet = `type PolymorphicProps<T extends ElementType, OwnProps> =
  OwnProps & {
    as?: T;
  } & Omit<ComponentPropsWithoutRef<T>, keyof OwnProps | 'as'>;`;

export const looseAsSnippet = `function Primitive({ as, ...rest }: any) {
  const Comp = as || 'div';
  return <Comp {...rest} />;
}`;
