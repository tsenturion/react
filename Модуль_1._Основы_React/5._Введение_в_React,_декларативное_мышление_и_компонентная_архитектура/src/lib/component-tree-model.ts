import type { StatusTone } from './common';

export type StateOwner = 'page' | 'workbench' | 'section';
export type TreeNodeId =
  | 'app'
  | 'lesson-page'
  | 'workbench-layout'
  | 'filter-panel'
  | 'catalog-summary'
  | 'catalog-surface'
  | 'catalog-section'
  | 'catalog-card'
  | 'guidance-aside';

export type ComponentTreeNode = {
  id: TreeNodeId;
  label: string;
  role: string;
  receives: string[];
  sends: string[];
  children: ComponentTreeNode[];
  ownsState?: boolean;
};

export const stateOwners = [
  {
    id: 'page',
    label: 'LessonPage',
    description:
      'Состояние живёт на уровне страницы и управляет несколькими соседними зонами.',
  },
  {
    id: 'workbench',
    label: 'WorkbenchLayout',
    description:
      'Состояние локализовано внутри feature-поддерева и не поднимается выше нужного.',
  },
  {
    id: 'section',
    label: 'CatalogSection',
    description:
      'Состояние опущено слишком низко и уже не может координировать соседние ветки.',
  },
] as const satisfies readonly {
  id: StateOwner;
  label: string;
  description: string;
}[];

const treeBlueprint = {
  id: 'app',
  label: 'App',
  role: 'Переключает лаборатории и собирает верхний shell проекта.',
  receives: ['activeLabId'],
  sends: ['selectedLab'],
  children: [
    {
      id: 'lesson-page',
      label: 'DataCompositionPage',
      role: 'Держит сценарий лаборатории и соединяет модели с UI.',
      receives: ['query', 'category', 'layoutMode'],
      sends: ['view', 'layoutProps'],
      children: [
        {
          id: 'workbench-layout',
          label: 'WorkbenchLayout',
          role: 'Компонует header, toolbar, summary, main и aside как один экран.',
          receives: ['header', 'toolbar', 'summary', 'main', 'aside'],
          sends: ['slotProps'],
          children: [
            {
              id: 'filter-panel',
              label: 'FilterPanel',
              role: 'Собирает ввод пользователя и изменяет состояние фильтров.',
              receives: ['query', 'category', 'onlyStable'],
              sends: ['onQueryChange', 'onCategoryChange'],
              children: [],
            },
            {
              id: 'catalog-summary',
              label: 'CatalogSummaryPanel',
              role: 'Показывает производные данные: visibleCount, activeFilters, sections.',
              receives: ['view'],
              sends: ['summary text'],
              children: [],
            },
            {
              id: 'catalog-surface',
              label: 'CatalogSurface',
              role: 'Рендерит секции и карточки на основе вычисленного view.',
              receives: ['view', 'highlightedId'],
              sends: ['section props'],
              children: [
                {
                  id: 'catalog-section',
                  label: 'CatalogSection',
                  role: 'Выводит группу карточек одной категории.',
                  receives: ['category', 'items'],
                  sends: ['card props'],
                  children: [
                    {
                      id: 'catalog-card',
                      label: 'CatalogCard',
                      role: 'Leaf-компонент: читает только props карточки и рисует финальный блок.',
                      receives: ['item', 'highlighted'],
                      sends: ['rendered card'],
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              id: 'guidance-aside',
              label: 'GuidanceAside',
              role: 'Показывает вторичный контент и не вмешивается в данные списка.',
              receives: ['notes'],
              sends: ['aside copy'],
              children: [],
            },
          ],
        },
      ],
    },
  ],
} as const satisfies ComponentTreeNode;

const ownerNodeMap: Record<StateOwner, TreeNodeId> = {
  page: 'lesson-page',
  workbench: 'workbench-layout',
  section: 'catalog-section',
};

const cloneTree = (
  node: ComponentTreeNode,
  stateOwnerId: TreeNodeId,
): ComponentTreeNode => ({
  ...node,
  ownsState: node.id === stateOwnerId,
  children: node.children.map((child) => cloneTree(child, stateOwnerId)),
});

const findNode = (node: ComponentTreeNode, id: TreeNodeId): ComponentTreeNode | null => {
  if (node.id === id) {
    return node;
  }

  for (const child of node.children) {
    const match = findNode(child, id);

    if (match) {
      return match;
    }
  }

  return null;
};

const findPath = (
  node: ComponentTreeNode,
  id: TreeNodeId,
): ComponentTreeNode[] | null => {
  if (node.id === id) {
    return [node];
  }

  for (const child of node.children) {
    const path = findPath(child, id);

    if (path) {
      return [node, ...path];
    }
  }

  return null;
};

export function buildComponentTreeScenario(
  stateOwner: StateOwner,
  selectedNodeId: TreeNodeId,
) {
  const ownerId = ownerNodeMap[stateOwner];
  const tree = cloneTree(treeBlueprint, ownerId);
  const selectedNode = findNode(tree, selectedNodeId) ?? tree;
  const ownerPath = findPath(tree, ownerId) ?? [tree];
  const selectedPath = findPath(tree, selectedNode.id) ?? [tree];
  const propChain = selectedPath.map((node) => node.label);

  const ownerDefinition =
    stateOwners.find((item) => item.id === stateOwner) ?? stateOwners[1];

  const tone: StatusTone =
    stateOwner === 'workbench' ? 'success' : stateOwner === 'page' ? 'warn' : 'error';

  return {
    tone,
    tree,
    selectedNode,
    stateOwnerLabel: ownerDefinition.label,
    ownerReason: ownerDefinition.description,
    rerenderScope:
      stateOwner === 'page'
        ? 'Фильтры, summary, main и aside легко координируются, но при изменениях охватывается более широкий уровень страницы.'
        : stateOwner === 'workbench'
          ? 'Состояние остаётся рядом с feature-деревом и не утекает выше нужной границы.'
          : 'Состояние слишком низко: соседние ветки теряют общий источник истины.',
    updatePath: ownerPath.map((node) => node.label),
    propChain,
    risks:
      stateOwner === 'page'
        ? [
            'Если поднять состояние ещё выше, глобальный shell начнёт знать слишком много о локальном feature.',
          ]
        : stateOwner === 'workbench'
          ? [
              'Нужно следить, чтобы summary, filters и main оставались частью одного feature-поддерева.',
              'Если это дерево начнёт обслуживать несколько независимых сценариев, границу придётся пересмотреть.',
            ]
          : [
              'Section не может координировать toolbar и summary без обратных обходных путей.',
              'Часть данных начнёт дублироваться в соседних компонентах.',
            ],
  };
}
