export type ChildrenScenarioId = 'summary' | 'checklist' | 'split-view';

export type ChildrenScenario = {
  eyebrow: string;
  title: string;
  description: string;
  childCount: number;
  asideLabel: string;
  footerLabel: string;
  snippet: string;
};

export function buildChildrenScenario(
  scenarioId: ChildrenScenarioId,
  showAside: boolean,
  showFooter: boolean,
): ChildrenScenario {
  const commonFooter = showFooter ? 'Footer slot подключён.' : 'Footer slot выключен.';
  const commonAside = showAside ? 'Aside slot подключён.' : 'Aside slot выключен.';

  switch (scenarioId) {
    case 'summary':
      return {
        eyebrow: 'children slot',
        title: 'Краткая сводка',
        description:
          'Один и тот же контейнер оборачивает обычный текстовый контент без знания о его структуре.',
        childCount: 2,
        asideLabel: commonAside,
        footerLabel: commonFooter,
        snippet: [
          '<SlotFrame title="Краткая сводка" aside={<Badge />}>',
          '  <p>Компонент не знает заранее, что именно вы передадите внутрь.</p>',
          '  <p>Он просто рендерит props.children.</p>',
          '</SlotFrame>',
        ].join('\n'),
      };
    case 'checklist':
      return {
        eyebrow: 'children slot',
        title: 'Чеклист',
        description:
          'Тот же контейнер принимает уже список элементов, но API остаётся прежним.',
        childCount: 3,
        asideLabel: commonAside,
        footerLabel: commonFooter,
        snippet: [
          '<SlotFrame title="Чеклист">',
          '  <ul>',
          '    <li>Определить contract props</li>',
          '    <li>Добавить children slot</li>',
          '    <li>Сохранить переиспользование</li>',
          '  </ul>',
          '</SlotFrame>',
        ].join('\n'),
      };
    case 'split-view':
      return {
        eyebrow: 'children slot',
        title: 'Составной блок',
        description:
          'В children можно передать сразу несколько вложенных секций и собрать более сложный layout.',
        childCount: 4,
        asideLabel: commonAside,
        footerLabel: commonFooter,
        snippet: [
          '<SlotFrame title="Split view" aside={<AsideStats />}>',
          '  <div className="grid gap-4 md:grid-cols-2">',
          '    <Checklist />',
          '    <SummaryCard />',
          '  </div>',
          '</SlotFrame>',
        ].join('\n'),
      };
  }
}
