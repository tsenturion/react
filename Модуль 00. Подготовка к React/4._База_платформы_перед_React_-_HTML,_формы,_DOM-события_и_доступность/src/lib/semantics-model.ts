export type PageKind = 'article' | 'checkout' | 'dashboard';
export type StructureMode = 'semantic' | 'generic';

type OutlineNode = {
  id: string;
  element: string;
  label: string;
  note: string;
};

export const pageKinds: PageKind[] = ['article', 'checkout', 'dashboard'];

const pagePresets: Record<
  PageKind,
  { title: string; primary: string; sections: string[]; heading: string }
> = {
  article: {
    title: 'Документация курса',
    primary: 'article',
    sections: ['Оглавление', 'Материал', 'Связанные ссылки'],
    heading: 'H1 -> H2 -> H3',
  },
  checkout: {
    title: 'Оформление заказа',
    primary: 'form',
    sections: ['Контакты', 'Доставка', 'Оплата'],
    heading: 'H1 -> H2',
  },
  dashboard: {
    title: 'Панель управления',
    primary: 'section',
    sections: ['Фильтры', 'Отчёты', 'Активность'],
    heading: 'H1 -> H2',
  },
};

export const buildSemanticScenario = ({
  pageKind,
  structureMode,
  includeComplementary,
}: {
  pageKind: PageKind;
  structureMode: StructureMode;
  includeComplementary: boolean;
}) => {
  const preset = pagePresets[pageKind];
  const elementFor = (semanticElement: string) =>
    structureMode === 'semantic' ? semanticElement : 'div';

  const outline: OutlineNode[] = [
    {
      id: 'banner',
      element: elementFor('header'),
      label: 'Верхняя часть страницы',
      note: 'Брендинг, заголовок и быстрые действия.',
    },
    {
      id: 'navigation',
      element: elementFor('nav'),
      label: 'Навигация',
      note: 'Ссылки по разделам и ориентация по документу.',
    },
    {
      id: 'main',
      element: elementFor('main'),
      label: preset.title,
      note: `Главная область задачи. Здесь основным контейнером должен быть ${preset.primary}.`,
    },
    {
      id: 'primary',
      element: elementFor(preset.primary),
      label: preset.sections.join(' / '),
      note: `Контентная структура страницы: ${preset.heading}.`,
    },
    ...(includeComplementary
      ? [
          {
            id: 'aside',
            element: elementFor('aside'),
            label: 'Дополнительный блок',
            note: 'Связанный, но не основной контент: подсказки, summary, справка.',
          },
        ]
      : []),
    {
      id: 'contentinfo',
      element: elementFor('footer'),
      label: 'Нижняя часть страницы',
      note: 'Авторство, служебные ссылки и служебный статус.',
    },
  ];

  const landmarkCount = outline.filter((item) =>
    ['header', 'nav', 'main', 'article', 'aside', 'footer', 'form', 'section'].includes(
      item.element,
    ),
  ).length;
  const warnings =
    structureMode === 'semantic'
      ? [
          'Landmarks разнесены по смыслу, поэтому screen reader и тесты по ролям получают устойчивую структуру.',
        ]
      : [
          'Все важные области схлопнулись в `div`, поэтому landmarks исчезли.',
          'По generic-структуре сложнее искать main region, navigation и complementary content.',
        ];

  const readerPath = outline.map((item) => `${item.element}:${item.label}`).join(' -> ');
  const codePreview = `<${elementFor('header')}>...</${elementFor('header')}>
<${elementFor('nav')}>...</${elementFor('nav')}>
<${elementFor('main')}>
  <${elementFor(preset.primary)}>
    <h1>${preset.title}</h1>
  </${elementFor(preset.primary)}>
</${elementFor('main')}>
${includeComplementary ? `<${elementFor('aside')}>...</${elementFor('aside')}>` : ''}
<${elementFor('footer')}>...</${elementFor('footer')}>`;

  return {
    preset,
    outline,
    warnings,
    landmarkCount,
    readerPath,
    semanticScore: structureMode === 'semantic' ? 92 : 41,
    codePreview,
  };
};
