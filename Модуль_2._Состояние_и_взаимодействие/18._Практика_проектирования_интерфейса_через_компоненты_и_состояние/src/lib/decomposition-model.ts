export type DecompositionLevel = 'coarse' | 'balanced' | 'fine';

export type ComponentNode = {
  label: string;
  role: string;
  children?: ComponentNode[];
};

export type DecompositionPlan = {
  nodes: ComponentNode[];
  componentCount: number;
  summary: string;
  snippet: string;
};

function countNodes(nodes: readonly ComponentNode[]): number {
  return nodes.reduce((total, node) => total + 1 + countNodes(node.children ?? []), 0);
}

export function buildDecompositionPlan(level: DecompositionLevel): DecompositionPlan {
  const nodes =
    level === 'coarse'
      ? [
          {
            label: 'CourseWorkbench',
            role: 'Главный экран и owner state',
            children: [
              { label: 'Toolbar', role: 'Поиск, фильтры и summary' },
              { label: 'ContentArea', role: 'Список уроков и details рядом' },
            ],
          },
        ]
      : level === 'balanced'
        ? [
            {
              label: 'CourseWorkbench',
              role: 'Owner для query, activeTrack, selectedId и draftsById',
              children: [
                {
                  label: 'WorkbenchToolbar',
                  role: 'Поиск, TrackTabs и SummaryStrip',
                },
                {
                  label: 'WorkbenchBody',
                  role: 'Композиция списка и details',
                  children: [
                    { label: 'LessonGrid', role: 'Список карточек уроков' },
                    { label: 'LessonDetails', role: 'Выбранный урок и draft заметки' },
                  ],
                },
              ],
            },
          ]
        : [
            {
              label: 'CourseWorkbench',
              role: 'Owner state и orchestration',
              children: [
                {
                  label: 'WorkbenchToolbar',
                  role: 'Группирует входные controls и summary',
                  children: [
                    { label: 'SearchField', role: 'query state через props' },
                    { label: 'TrackTabs', role: 'activeTrack через props' },
                    { label: 'SummaryStrip', role: 'derived metrics' },
                  ],
                },
                {
                  label: 'WorkbenchBody',
                  role: 'Композиция content area',
                  children: [
                    {
                      label: 'LessonGrid',
                      role: 'Рендерит collection',
                      children: [{ label: 'LessonCard', role: 'Чистая карточка урока' }],
                    },
                    {
                      label: 'LessonDetails',
                      role: 'Показывает selected lesson',
                      children: [
                        { label: 'DetailsHeader', role: 'Meta и actions' },
                        { label: 'DraftEditor', role: 'Controlled textarea' },
                      ],
                    },
                  ],
                },
              ],
            },
          ];

  return {
    nodes,
    componentCount: countNodes(nodes),
    summary:
      level === 'coarse'
        ? 'Грубая декомпозиция полезна для первого прохода: видно только крупные boundaries и owner state.'
        : level === 'balanced'
          ? 'Сбалансированная декомпозиция обычно лучше всего подходит для первого React-экрана: компоненты уже независимы, но структура ещё легко читается.'
          : 'Мелкая декомпозиция полезна после того, как уже понятны boundaries и поток данных. Раньше времени она создаёт лишний шум.',
    snippet:
      level === 'coarse'
        ? [
            '<CourseWorkbench>',
            '  <Toolbar />',
            '  <ContentArea />',
            '</CourseWorkbench>',
          ].join('\n')
        : level === 'balanced'
          ? [
              '<CourseWorkbench>',
              '  <WorkbenchToolbar />',
              '  <WorkbenchBody>',
              '    <LessonGrid />',
              '    <LessonDetails />',
              '  </WorkbenchBody>',
              '</CourseWorkbench>',
            ].join('\n')
          : [
              '<CourseWorkbench>',
              '  <WorkbenchToolbar>',
              '    <SearchField />',
              '    <TrackTabs />',
              '    <SummaryStrip />',
              '  </WorkbenchToolbar>',
              '  <WorkbenchBody>',
              '    <LessonGrid>',
              '      <LessonCard />',
              '    </LessonGrid>',
              '    <LessonDetails>',
              '      <DetailsHeader />',
              '      <DraftEditor />',
              '    </LessonDetails>',
              '  </WorkbenchBody>',
              '</CourseWorkbench>',
            ].join('\n'),
  };
}
