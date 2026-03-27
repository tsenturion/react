import type { LessonLabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

const studyMap: Record<LessonLabId, StudyEntry> = {
  lifting: {
    files: [
      {
        path: 'src/components/shared-state/SharedDiscountWorkbench.tsx',
        note: 'Реальный parent-компонент владеет discount state и синхронизирует два независимых контролa.',
      },
      {
        path: 'src/lib/lifting-state-model.ts',
        note: 'Чистые функции переводят percent в net price и обратно, сохраняя единый источник истины.',
      },
      {
        path: 'src/pages/LiftingStatePage.tsx',
        note: 'Страница объясняет, зачем родителю владеть состоянием, которое влияет на несколько детей.',
      },
    ],
    snippets: [
      {
        label: 'Shared parent state',
        note: 'Оба дочерних поля читают одно и то же состояние и не могут рассинхронизироваться между собой.',
        code: [
          'const [discount, setDiscount] = useState(createDiscountState);',
          '<PercentField value={discount.discountPercent} onChange={...} />',
          '<NetField value={calculateNetPrice(discount)} onChange={...} />',
        ].join('\n'),
      },
      {
        label: 'Net from percent',
        note: 'Summary и второй контрол вычисляются из того же общего значения.',
        code: ['const netPrice = calculateNetPrice(discount);'].join('\n'),
      },
    ],
  },
  shared: {
    files: [
      {
        path: 'src/components/shared-state/SharedFilterDashboard.tsx',
        note: 'Один filter state влияет сразу на toolbar, список карточек и summary-блок.',
      },
      {
        path: 'src/lib/shared-dashboard-model.ts',
        note: 'Модель собирает visible items и summary из одного общего filter state.',
      },
      {
        path: 'src/pages/SharedStateDashboardPage.tsx',
        note: 'Страница показывает, как один source of truth управляет несколькими частями экрана.',
      },
    ],
    snippets: [
      {
        label: 'One filter state',
        note: 'query и track живут в одном владельце и одинаково влияют на все независимые панели.',
        code: [
          'const [filterState, setFilterState] = useState({ query: "", track: "all" });',
          'const visibleItems = getVisibleCatalogItems(items, filterState);',
        ].join('\n'),
      },
      {
        label: 'Summary from same source',
        note: 'Summary не хранит собственную копию фильтра и не синхронизируется вручную.',
        code: [
          'const totalDuration = visibleItems.reduce((sum, item) => sum + item.duration, 0);',
        ].join('\n'),
      },
    ],
  },
  drift: {
    files: [
      {
        path: 'src/components/shared-state/SiblingDriftLab.tsx',
        note: 'Компонент сравнивает siblings с локальными копиями выбора и siblings с одним lifted selectedId.',
      },
      {
        path: 'src/lib/sibling-sync-model.ts',
        note: 'Модель урока формулирует difference между drift и single source of truth.',
      },
      {
        path: 'src/pages/DriftPage.tsx',
        note: 'Страница связывает дублирование выбора и синхронизацию siblings через общий parent state.',
      },
    ],
    snippets: [
      {
        label: 'Lifted selection',
        note: 'Один selectedId делает toolbar и details согласованными.',
        code: [
          'const [selectedId, setSelectedId] = useState("alpha");',
          '<Toolbar selectedId={selectedId} onSelect={setSelectedId} />',
          '<Details selectedId={selectedId} />',
        ].join('\n'),
      },
      {
        label: 'Local drift',
        note: 'Если toolbar и details держат разные локальные selectedId, они расходятся уже после первого изменения.',
        code: [
          'const [toolbarSelectedId, setToolbarSelectedId] = useState("alpha");',
          'const [detailsSelectedId, setDetailsSelectedId] = useState("alpha");',
        ].join('\n'),
      },
    ],
  },
  flow: {
    files: [
      {
        path: 'src/components/shared-state/ChildParentFlowLab.tsx',
        note: 'В проекте есть реальная цепочка child -> parent -> sibling: контролы поднимают изменения наверх, summary читает их вниз по props.',
      },
      {
        path: 'src/lib/upward-flow-model.ts',
        note: 'Модель урока показывает, как seats и tier влияют на итоговый booking summary.',
      },
      {
        path: 'src/pages/UpwardFlowPage.tsx',
        note: 'Страница объясняет, как передача данных вверх и вниз синхронизирует независимые компоненты.',
      },
    ],
    snippets: [
      {
        label: 'Callbacks upward',
        note: 'Дочерний контрол не мутирует чужой UI напрямую, а сообщает об изменении владельцу состояния.',
        code: [
          '<SeatPicker value={seats} onChange={setSeats} />',
          '<TierPicker value={tier} onChange={setTier} />',
        ].join('\n'),
      },
      {
        label: 'Props downward',
        note: 'После обновления владелец раздаёт новое согласованное состояние вниз всем зависимым частям интерфейса.',
        code: ['<Summary seats={seats} tier={tier} />'].join('\n'),
      },
    ],
  },
  drilling: {
    files: [
      {
        path: 'src/components/shared-state/PropDrillingTraceLab.tsx',
        note: 'Компонент строит глубокую цепочку Shell -> Frame -> Column -> Leaf и показывает, какие props идут через каждое звено.',
      },
      {
        path: 'src/lib/prop-drilling-model.ts',
        note: 'Модель считает глубину и число forwarded props в цепочке.',
      },
      {
        path: 'src/pages/PropDrillingPage.tsx',
        note: 'Страница разбирает prop drilling как следствие структуры дерева, а не как абстрактную жалобу.',
      },
    ],
    snippets: [
      {
        label: 'Forwarded props',
        note: 'Промежуточные компоненты просто пропускают дальше value и callback.',
        code: [
          '<Shell selectedTrack={track} onTrackChange={setTrack}>',
          '  <SidebarFrame selectedTrack={track} onTrackChange={setTrack}>',
          '    <LeafCard selectedTrack={track} onTrackChange={setTrack} />',
          '  </SidebarFrame>',
          '</Shell>',
        ].join('\n'),
      },
      {
        label: 'Root owner',
        note: 'Всё prop drilling начинается с того, что владелец состояния стоит выше deep leaf-узла.',
        code: ['const [track, setTrack] = useState("state");'].join('\n'),
      },
    ],
  },
  owner: {
    files: [
      {
        path: 'src/components/shared-state/StateOwnerAdvisor.tsx',
        note: 'Интерактивный advisor переводит признаки использования в решение о владельце состояния.',
      },
      {
        path: 'src/lib/owner-model.ts',
        note: 'Здесь лежит decision model: local, shared parent или layout/route owner.',
      },
      {
        path: 'src/pages/OwnerPage.tsx',
        note: 'Страница показывает, как определить владельца состояния по фактическому влиянию на дерево компонентов.',
      },
    ],
    snippets: [
      {
        label: 'Shared owner decision',
        note: 'Если значение нужно siblings, владелец поднимается к их ближайшему общему parent.',
        code: [
          'if (scenario.usedBySiblings) {',
          '  return { target: "shared-parent" };',
          '}',
        ].join('\n'),
      },
      {
        label: 'Local owner decision',
        note: 'Leaf-only state не поднимается выше без реальной необходимости.',
        code: ['return { target: "local" };'].join('\n'),
      },
    ],
  },
};

export function getProjectStudy(id: LessonLabId) {
  return studyMap[id];
}
