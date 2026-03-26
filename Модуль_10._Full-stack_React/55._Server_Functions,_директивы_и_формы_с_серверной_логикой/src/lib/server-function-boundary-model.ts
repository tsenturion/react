export type ComponentLayer = 'server' | 'client';
export type BoundaryNodeId =
  | 'page-shell'
  | 'analytics-feed'
  | 'lesson-form'
  | 'live-preview'
  | 'publish-controls'
  | 'history-timeline';
export type BoundaryPresetId = 'server-lean' | 'hybrid-forms' | 'client-heavy';
export type BoundaryWorkspace = Record<BoundaryNodeId, ComponentLayer>;

export type BoundaryNode = {
  id: BoundaryNodeId;
  label: string;
  recommended: ComponentLayer;
  needsBrowserHooks: boolean;
  benefitsFromServerAction: boolean;
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
    needsBrowserHooks: false,
    benefitsFromServerAction: false,
    clientBundleKb: 12,
    serverBenefit:
      'Каркас экрана не требует hydration и не должен расширять client graph.',
    clientBenefit:
      'Client shell оправдан только при действительно глобальном local UI state.',
    failureWhenMisplaced:
      'Весь экран уходит в client из-за одной формы, хотя остальная часть страницы почти статична.',
  },
  {
    id: 'analytics-feed',
    label: 'Analytics feed',
    recommended: 'server',
    needsBrowserHooks: false,
    benefitsFromServerAction: false,
    clientBundleKb: 24,
    serverBenefit: 'Серверный блок удобно читать рядом с приватными данными и кэшем.',
    clientBenefit:
      'Client placement нужен только если есть плотная локальная визуализация или drag interactions.',
    failureWhenMisplaced:
      'Приватные данные начинают требовать отдельный client fetch и раздувают browser bundle.',
  },
  {
    id: 'lesson-form',
    label: 'Lesson form',
    recommended: 'client',
    needsBrowserHooks: true,
    benefitsFromServerAction: true,
    clientBundleKb: 18,
    serverBenefit:
      'Сервер полезен для самой мутации и валидации, но не для набора текста внутри формы.',
    clientBenefit:
      'Форма и локальный pending UX естественно живут в client island и вызывают server logic через submit boundary.',
    failureWhenMisplaced:
      'Форму пытаются оставить server-only, и тогда теряется controlled input, pending UX и локальная реакция на ошибки.',
  },
  {
    id: 'live-preview',
    label: 'Live preview',
    recommended: 'client',
    needsBrowserHooks: true,
    benefitsFromServerAction: false,
    clientBundleKb: 20,
    serverBenefit:
      'Сервер может отдать initial snapshot, но не подходит для мгновенного onChange preview.',
    clientBenefit:
      'Client island даёт мгновенное обновление интерфейса при вводе и форматировании.',
    failureWhenMisplaced:
      'Preview пытаются повесить на server function, и каждый символ превращается в неудобный network-driven цикл.',
  },
  {
    id: 'publish-controls',
    label: 'Publish controls',
    recommended: 'client',
    needsBrowserHooks: true,
    benefitsFromServerAction: true,
    clientBundleKb: 10,
    serverBenefit:
      'Сама мутация публикации должна жить на сервере, особенно если есть права и бизнес-правила.',
    clientBenefit:
      'Кнопки и optimistic/pending feedback остаются на клиенте, не уводя туда весь surrounding tree.',
    failureWhenMisplaced:
      'Вся панель управления становится client-heavy, хотя на клиенте нужны только кнопки и короткая реакция на submit.',
  },
  {
    id: 'history-timeline',
    label: 'History timeline',
    recommended: 'server',
    needsBrowserHooks: false,
    benefitsFromServerAction: false,
    clientBundleKb: 14,
    serverBenefit:
      'История изменений отлично рендерится на сервере рядом с серверным журналом событий.',
    clientBenefit:
      'Client режим оправдан только если timeline должен иметь плотную локальную интерактивность.',
    failureWhenMisplaced:
      'Чисто информационный журнал зря попадает в hydrate graph и начинает конкурировать за bundle вместе с формой.',
  },
] as const;

export const boundaryPresets: Record<
  BoundaryPresetId,
  { label: string; description: string; workspace: BoundaryWorkspace }
> = {
  'server-lean': {
    label: 'Server-lean',
    description:
      'Данные и статические зоны остаются на сервере, а в клиент вынесены только форма, preview и кнопки вызова server actions.',
    workspace: {
      'page-shell': 'server',
      'analytics-feed': 'server',
      'lesson-form': 'client',
      'live-preview': 'client',
      'publish-controls': 'client',
      'history-timeline': 'server',
    },
  },
  'hybrid-forms': {
    label: 'Hybrid forms',
    description:
      'Форма и связанные панели живут на клиенте, но analytics и history остаются server-only.',
    workspace: {
      'page-shell': 'server',
      'analytics-feed': 'server',
      'lesson-form': 'client',
      'live-preview': 'client',
      'publish-controls': 'client',
      'history-timeline': 'client',
    },
  },
  'client-heavy': {
    label: 'Client-heavy',
    description:
      'Почти весь экран уходит в browser bundle. Это рабочий вариант, но цена за интерактивность становится слишком высокой.',
    workspace: {
      'page-shell': 'client',
      'analytics-feed': 'client',
      'lesson-form': 'client',
      'live-preview': 'client',
      'publish-controls': 'client',
      'history-timeline': 'client',
    },
  },
};

export function getBoundaryPreset(id: BoundaryPresetId): BoundaryWorkspace {
  return { ...boundaryPresets[id].workspace };
}

export function analyzeBoundaryWorkspace(workspace: BoundaryWorkspace) {
  let clientBundleKb = 0;
  let hydrationUnits = 0;
  let serverActionBridgeCount = 0;
  let invalidCount = 0;

  const nodes = boundaryNodes.map((node) => {
    const layer = workspace[node.id];
    let tone: 'success' | 'warn' | 'error' = 'success';
    let explanation = layer === 'server' ? node.serverBenefit : node.clientBenefit;

    if (layer === 'client') {
      clientBundleKb += node.clientBundleKb;
      hydrationUnits += 1;

      if (node.benefitsFromServerAction) {
        serverActionBridgeCount += 1;
        explanation +=
          ' Этот client island всё равно будет пересекать серверную границу во время submit.';
      }

      if (node.recommended === 'server' && !node.needsBrowserHooks) {
        tone = 'warn';
        explanation +=
          ' Это допустимо, но браузер получит лишний JS без обязательной пользы.';
      }
    }

    if (layer === 'server' && node.needsBrowserHooks) {
      invalidCount += 1;
      tone = 'error';
      explanation = `${node.failureWhenMisplaced} Этот узел требует client hooks и локальный browser event loop.`;
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
      ? 'В схеме есть узлы, которые нельзя оставлять server без потери интерактивности.'
      : clientBundleKb <= 50
        ? 'Граница остаётся узкой: клиент гидрирует только форму и действительно interactive islands.'
        : clientBundleKb <= 85
          ? 'Компромисс рабочий, но клиентская часть уже заметно давит на hydrate graph.'
          : 'Граница стала слишком клиентской: bundle, hydration и связующий код начинают доминировать.';

  return {
    nodes,
    clientBundleKb,
    hydrationUnits,
    serverActionBridgeCount,
    invalidCount,
    summary,
  };
}
