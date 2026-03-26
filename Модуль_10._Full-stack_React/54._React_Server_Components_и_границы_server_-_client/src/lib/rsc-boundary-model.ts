export type ComponentLayer = 'server' | 'client';
export type BoundaryNodeId =
  | 'page-shell'
  | 'lesson-metrics'
  | 'filter-form'
  | 'live-search'
  | 'bookmark-toggle'
  | 'recommendation-grid';
export type BoundaryPresetId = 'server-first' | 'balanced-islands' | 'client-heavy';
export type BoundaryWorkspace = Record<BoundaryNodeId, ComponentLayer>;

export type BoundaryNode = {
  id: BoundaryNodeId;
  label: string;
  recommended: ComponentLayer;
  needsClientHooks: boolean;
  needsServerBridgeWhenClient: boolean;
  clientBundleKb: number;
  serverBenefit: string;
  clientBenefit: string;
  failureWhenMisplaced: string;
};

export const boundaryNodes: readonly BoundaryNode[] = [
  {
    id: 'page-shell',
    label: 'Page shell',
    recommended: 'server',
    needsClientHooks: false,
    needsServerBridgeWhenClient: false,
    clientBundleKb: 12,
    serverBenefit:
      'Статический каркас страницы не требует hydration и не раздувает bundle.',
    clientBenefit:
      'На клиенте можно держать локальные layout preferences, но это редко стоит целого shell boundary.',
    failureWhenMisplaced:
      'Целый layout попадает в client из-за одной маленькой interactive zone и тянет за собой соседние блоки.',
  },
  {
    id: 'lesson-metrics',
    label: 'Lesson metrics',
    recommended: 'server',
    needsClientHooks: false,
    needsServerBridgeWhenClient: true,
    clientBundleKb: 22,
    serverBenefit:
      'Метрики удобно читать рядом с приватными данными и отдавать уже готовым HTML без client fetch.',
    clientBenefit:
      'На клиенте можно добавить локальное сравнение диапазонов, но для этого появится bridge к серверным данным.',
    failureWhenMisplaced:
      'Приватные данные начинают требовать отдельный API bridge и повторный client fetch без заметной пользы.',
  },
  {
    id: 'filter-form',
    label: 'Filter form',
    recommended: 'server',
    needsClientHooks: false,
    needsServerBridgeWhenClient: false,
    clientBundleKb: 18,
    serverBenefit:
      'Фильтры могут жить как URL/form boundary и не обязаны превращать весь список в client tree.',
    clientBenefit:
      'Client-версия удобна только там, где нужен мгновенный локальный preview без roundtrip.',
    failureWhenMisplaced:
      'Фильтры автоматически уводят рядом стоящий data-heavy список в client, хотя могли остаться server-driven.',
  },
  {
    id: 'live-search',
    label: 'Live search',
    recommended: 'client',
    needsClientHooks: true,
    needsServerBridgeWhenClient: false,
    clientBundleKb: 16,
    serverBenefit:
      'Server placement полезен только для initial value, но не подходит для живого набора и отложенного поиска.',
    clientBenefit:
      'Client layer даёт controlled input, debounce и немедленную реакцию интерфейса на ввод.',
    failureWhenMisplaced:
      'Server placement ломает локальный ввод и заставляет симулировать клиентское поведение через неудобные обходы.',
  },
  {
    id: 'bookmark-toggle',
    label: 'Bookmark toggle',
    recommended: 'client',
    needsClientHooks: true,
    needsServerBridgeWhenClient: true,
    clientBundleKb: 10,
    serverBenefit:
      'Server placement годится только для статуса до клика, но само действие всё равно требует client island или form bridge.',
    clientBenefit:
      'Client island держит optimistic click-state локально и не делает весь surrounding tree интерактивным.',
    failureWhenMisplaced:
      'Кнопку пытаются оставить server-only, и потом вокруг неё вырастает случайная imperative обвязка.',
  },
  {
    id: 'recommendation-grid',
    label: 'Recommendation grid',
    recommended: 'server',
    needsClientHooks: false,
    needsServerBridgeWhenClient: true,
    clientBundleKb: 32,
    serverBenefit:
      'Тяжёлую сетку выгодно собирать на сервере рядом с данными и отправлять браузеру уже готовый markup.',
    clientBenefit:
      'Client grid оправдан только если в нём действительно нужна локальная сортировка, drag/drop или dense hover logic.',
    failureWhenMisplaced:
      'В браузер уезжает крупный список, хотя он почти не интерактивен и отлично работал бы как server output.',
  },
] as const;

export const boundaryPresets: Record<
  BoundaryPresetId,
  { label: string; description: string; workspace: BoundaryWorkspace }
> = {
  'server-first': {
    label: 'Server-first',
    description:
      'Максимум данных и статического каркаса остаётся на сервере, в клиент вынесены только реальные interactive islands.',
    workspace: {
      'page-shell': 'server',
      'lesson-metrics': 'server',
      'filter-form': 'server',
      'live-search': 'client',
      'bookmark-toggle': 'client',
      'recommendation-grid': 'server',
    },
  },
  'balanced-islands': {
    label: 'Balanced islands',
    description:
      'Сервер отвечает за data-heavy блоки, но фильтры и некоторые вторичные зоны уже вынесены в самостоятельные client islands.',
    workspace: {
      'page-shell': 'server',
      'lesson-metrics': 'server',
      'filter-form': 'client',
      'live-search': 'client',
      'bookmark-toggle': 'client',
      'recommendation-grid': 'server',
    },
  },
  'client-heavy': {
    label: 'Client-heavy',
    description:
      'Большая часть дерева уходит в браузер. Архитектура остаётся рабочей, но bundle и bridge-стоимость быстро растут.',
    workspace: {
      'page-shell': 'client',
      'lesson-metrics': 'client',
      'filter-form': 'client',
      'live-search': 'client',
      'bookmark-toggle': 'client',
      'recommendation-grid': 'client',
    },
  },
};

export function getBoundaryPreset(id: BoundaryPresetId): BoundaryWorkspace {
  return { ...boundaryPresets[id].workspace };
}

export function getBoundaryNode(id: BoundaryNodeId): BoundaryNode {
  return boundaryNodes.find((node) => node.id === id) ?? boundaryNodes[0];
}

export function analyzeBoundaryWorkspace(workspace: BoundaryWorkspace) {
  let clientBundleKb = 0;
  let hydrationUnits = 0;
  let bridgeCount = 0;
  let invalidCount = 0;

  const nodes = boundaryNodes.map((node) => {
    const layer = workspace[node.id];
    let tone: 'success' | 'warn' | 'error' = 'success';
    let explanation = layer === 'server' ? node.serverBenefit : node.clientBenefit;

    if (layer === 'client') {
      clientBundleKb += node.clientBundleKb;
      hydrationUnits += 1;

      if (node.needsServerBridgeWhenClient) {
        bridgeCount += 1;
        tone = node.recommended === 'client' ? 'warn' : 'warn';
        explanation += ' Для данных и мутаций потребуется bridge к серверной логике.';
      }

      if (node.recommended === 'server' && !node.needsClientHooks) {
        tone = 'warn';
        explanation +=
          ' Это допустимо, но браузер получит дополнительный JS без обязательной UX-пользы.';
      }
    }

    if (layer === 'server' && node.needsClientHooks) {
      invalidCount += 1;
      tone = 'error';
      explanation = `${node.failureWhenMisplaced} Этот блок требует client hooks и browser event loop.`;
    }

    return {
      ...node,
      layer,
      tone,
      explanation,
    };
  });

  const summary =
    invalidCount > 0
      ? 'В дереве есть узлы, которые не могут оставаться server без потери интерактивности.'
      : clientBundleKb <= 40
        ? 'Граница остаётся узкой: bundle и hydration сфокусированы вокруг реальных islands.'
        : clientBundleKb <= 80
          ? 'Компромисс рабочий, но client слой уже заметно расширился и требует дисциплины.'
          : 'Клиентская часть стала тяжёлой: bundle, bridge-запросы и hydration pressure начинают доминировать.';

  return {
    nodes,
    clientBundleKb,
    hydrationUnits,
    bridgeCount,
    invalidCount,
    summary,
  };
}
