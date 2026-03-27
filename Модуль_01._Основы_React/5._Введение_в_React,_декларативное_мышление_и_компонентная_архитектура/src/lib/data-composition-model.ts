import type { CatalogOptions } from './catalog-domain';
import { deriveCatalogView } from './catalog-domain';
import type { StatusTone } from './common';

export type CompositionLayout = 'stacked' | 'split';

export const compositionLayouts = [
  {
    id: 'stacked',
    label: 'Стопка блоков',
    description: 'Summary, main и aside идут друг за другом.',
  },
  {
    id: 'split',
    label: 'Двухколоночная композиция',
    description: 'Main и aside живут рядом и остаются независимыми зонами.',
  },
] as const satisfies readonly {
  id: CompositionLayout;
  label: string;
  description: string;
}[];

export function describeCompositionScenario(
  options: CatalogOptions & {
    layoutMode: CompositionLayout;
    showSummary: boolean;
    showAside: boolean;
  },
) {
  const view = deriveCatalogView(options);
  const dependencies = [
    {
      part: 'FilterPanel',
      dependsOn: ['query', 'category', 'onlyStable', 'sortMode', 'focusTag'],
      note: 'Этот блок отвечает только за ввод и переключатели.',
    },
    ...(options.showSummary
      ? [
          {
            part: 'CatalogSummaryPanel',
            dependsOn: [
              'view.visibleCount',
              'view.activeFilters',
              'view.sections.length',
            ],
            note: 'Summary не хранит свои числа отдельно: они производятся из `view`.',
          },
        ]
      : []),
    {
      part: 'CatalogSurface',
      dependsOn: ['view.sections', 'view.focusTag'],
      note: 'Главный контент получает уже вычисленные данные и только рендерит их.',
    },
    ...(options.showAside
      ? [
          {
            part: 'GuidanceAside',
            dependsOn: ['layoutMode', 'showAside'],
            note: 'Aside остаётся вторичным слоем и не смешивает в себя данные списка.',
          },
        ]
      : []),
  ];

  const tone: StatusTone =
    options.layoutMode === 'split' && options.showSummary ? 'success' : 'warn';

  return {
    tone,
    view,
    layoutLabel:
      options.layoutMode === 'split'
        ? 'Main и aside живут как соседние ветки одного дерева.'
        : 'Все блоки идут сверху вниз и сохраняют линейную композицию.',
    visibleBlocks: [
      'Header',
      'FilterPanel',
      ...(options.showSummary ? ['CatalogSummaryPanel'] : []),
      'CatalogSurface',
      ...(options.showAside ? ['GuidanceAside'] : []),
    ],
    dependencies,
    notes: [
      'Композиция отвечает на вопрос, как части экрана соединяются в один UI, а не как их вручную вставлять в DOM.',
      'Данные и состояние можно держать рядом с feature, а layout собирать из slot-подобных пропсов.',
      'Если aside выключен, дерево просто меняется декларативно. Никакого ручного append/remove кода не требуется.',
    ],
    before:
      'Императивное мышление требует помнить порядок вставки блоков, условное появление summary и очистку aside вручную.',
    after:
      'Композиционное мышление описывает экран как набор независимых частей: header, toolbar, summary, main и aside.',
  };
}
