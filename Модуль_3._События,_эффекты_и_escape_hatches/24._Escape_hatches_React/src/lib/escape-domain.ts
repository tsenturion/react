export const PORTAL_ROOT_ID = 'escape-hatches-root';

export type PortalRenderMode = 'inline' | 'portal';
export type BubbleMode = 'allow' | 'stop';
export type TooltipMode = 'inline' | 'portal';
export type FlushMode = 'normal' | 'flush';
export type BoundaryScenarioId =
  | 'modal-layer'
  | 'portal-bubbling'
  | 'scroll-after-add'
  | 'native-dialog'
  | 'derived-filter'
  | 'widget-command';

export const modalLayers = [
  {
    id: 'stage',
    title: 'Current page shell',
    summary: 'Обычный React UI внутри главного root.',
  },
  {
    id: 'overlay',
    title: 'Overlay layer',
    summary: 'Модальное дерево вынесено в отдельный DOM-узел через createPortal.',
  },
  {
    id: 'backdrop',
    title: 'Backdrop contract',
    summary:
      'Даже отдельный DOM host не отменяет связь с родительским state и событиями.',
  },
] as const;

export const layerCards = [
  {
    id: 'alpha',
    title: 'Floating note',
    summary: 'Эта карточка живёт в контейнере с overflow hidden.',
  },
  {
    id: 'beta',
    title: 'Inline clipping',
    summary: 'Tooltip внутри неё ограничен границами контейнера.',
  },
  {
    id: 'gamma',
    title: 'Portal escape',
    summary: 'Через portal tooltip выходит из clipping и z-index traps.',
  },
] as const;

export const boundaryScenarios = [
  {
    id: 'modal-layer',
    title: 'Модальное окно поверх page shell',
    prompt: 'Нужно вынести модалку над остальным DOM, не ломая связь с React state.',
  },
  {
    id: 'portal-bubbling',
    title: 'События внутри portal',
    prompt: 'Нужно понять, продолжит ли click из portal идти по React-дереву вверх.',
  },
  {
    id: 'scroll-after-add',
    title: 'Сразу прочитать DOM после add',
    prompt: 'После добавления элемента нужно синхронно измерить DOM и прокрутить список.',
  },
  {
    id: 'native-dialog',
    title: 'Нативный dialog API',
    prompt:
      'Есть imperative browser API showModal/close, который нужно согласовать с React state.',
  },
  {
    id: 'derived-filter',
    title: 'Фильтрация по query',
    prompt: 'Есть список и строка поиска. Нужно показать отфильтрованные элементы.',
  },
  {
    id: 'widget-command',
    title: 'Команда во внешний widget',
    prompt: 'Нужно точечно вызвать imperative метод внешней библиотеки.',
  },
] as const satisfies readonly {
  id: BoundaryScenarioId;
  title: string;
  prompt: string;
}[];
