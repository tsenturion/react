import { getCourseById } from './course-domain';

export type DashboardPresetId = 'academy' | 'mentoring' | 'audit';

export type CompositionControls = {
  preset: DashboardPresetId;
  compact: boolean;
  showSidebar: boolean;
};

export type CompositionScenario = {
  eyebrow: string;
  title: string;
  announcement: string;
  statLabels: string[];
  courseIds: string[];
  sidebarNotes: string[];
  compact: boolean;
  showSidebar: boolean;
  reusedComponentCount: number;
  snippet: string;
};

export const defaultCompositionControls: CompositionControls = {
  preset: 'academy',
  compact: false,
  showSidebar: true,
};

export function buildCompositionScenario(
  controls: CompositionControls,
): CompositionScenario {
  switch (controls.preset) {
    case 'academy':
      return {
        eyebrow: 'academy preset',
        title: 'Академия компонентов',
        announcement:
          'Экран собирается из общих секций, карточек и callout-блоков без дублирования разметки.',
        statLabels: [
          '3 независимых секции',
          '2 повторно использованных карточки',
          '1 общий shell',
        ],
        courseIds: ['props-basics', 'children-slots'],
        sidebarNotes: [
          'Один SlotFrame используется и для контента, и для sidebar.',
          'CourseCard повторяется с разными props.',
        ],
        compact: controls.compact,
        showSidebar: controls.showSidebar,
        reusedComponentCount: controls.showSidebar ? 5 : 4,
        snippet: [
          '<SlotFrame title="Академия компонентов" aside={<Sidebar />}>',
          '  <StatsStrip />',
          '  <CourseCard ... />',
          '  <CourseCard ... />',
          '</SlotFrame>',
        ].join('\n'),
      };
    case 'mentoring':
      return {
        eyebrow: 'mentoring preset',
        title: 'Менторский обзор',
        announcement:
          'Те же строительные блоки собирают другой экран только через новые props и children.',
        statLabels: ['1 header shell', '1 checklist slot', '2 reused cards'],
        courseIds: ['api-design', 'props-basics'],
        sidebarNotes: [
          'Композиция меняет сценарий страницы без переписывания компонентов.',
          'Сайдбар остаётся необязательным расширением layout.',
        ],
        compact: controls.compact,
        showSidebar: controls.showSidebar,
        reusedComponentCount: controls.showSidebar ? 6 : 4,
        snippet: [
          '<ComposedDashboard preset="mentoring">',
          '  <CourseCard ... />',
          '  <Checklist />',
          '</ComposedDashboard>',
        ].join('\n'),
      };
    case 'audit':
      return {
        eyebrow: 'audit preset',
        title: 'Аудит компонентного API',
        announcement:
          'Композиция позволяет отключать или добавлять блоки без монолитного компонента на все случаи.',
        statLabels: [
          'Гибкий layout',
          'Sidebar optional',
          'Повторное использование без copy-paste',
        ],
        courseIds: ['component-testing', 'api-design'],
        sidebarNotes: [
          'Если sidebar выключен, главный layout не ломается.',
          'Компоненты остаются независимыми и переставляемыми.',
        ],
        compact: controls.compact,
        showSidebar: controls.showSidebar,
        reusedComponentCount: controls.showSidebar ? 5 : 3,
        snippet: [
          '<DashboardShell>',
          '  <MainColumn>',
          '    <SectionFrame><CourseCard ... /></SectionFrame>',
          '  </MainColumn>',
          '  {showSidebar ? <SidebarColumn /> : null}',
          '</DashboardShell>',
        ].join('\n'),
      };
  }
}

export function getScenarioCourses(courseIds: readonly string[]) {
  return courseIds.map((id) => getCourseById(id));
}
