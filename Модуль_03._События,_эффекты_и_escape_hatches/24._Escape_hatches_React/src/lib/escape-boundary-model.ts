import { boundaryScenarios, type BoundaryScenarioId } from './escape-domain';

type Recommendation = {
  recommended: string;
  avoid: string;
  why: string;
  before: string;
  after: string;
};

const recommendationMap: Record<BoundaryScenarioId, Recommendation> = {
  'modal-layer': {
    recommended: 'createPortal',
    avoid: 'держать modal DOM внутри случайного контейнера',
    why: 'Модалка должна жить в отдельном слое DOM, но оставаться частью React-дерева.',
    before:
      'Рендерить modal рядом с карточкой и бороться с overflow hidden, z-index и clipping на каждом уровне дерева.',
    after:
      'Вынести modal через createPortal в отдельный host и оставить управление открытием в обычном React state.',
  },
  'portal-bubbling': {
    recommended: 'учитывать React bubbling',
    avoid: 'думать только DOM-родителями',
    why: 'Portal меняет DOM-положение узла, но не отрывает его от React-предков.',
    before:
      'Считать, что click внутри portal больше не дойдёт до родителя, потому что DOM-узел вынесен в body.',
    after:
      'Рассматривать событие как часть React-дерева и точечно останавливать всплытие только там, где это действительно нужно.',
  },
  'scroll-after-add': {
    recommended: 'flushSync только для DOM read after update',
    avoid: 'делать flushSync стандартным способом setState',
    why: 'flushSync нужен, когда immediately after update нужно измерить уже обновлённый DOM.',
    before:
      'Ожидать, что listRef сразу увидит новый элемент после обычного setState в том же обработчике.',
    after:
      'Локально обернуть только критичный add-step в flushSync и сразу прочитать актуальный scrollHeight или children.length.',
  },
  'native-dialog': {
    recommended: 'effect bridge к imperative API',
    avoid: 'ручной showModal без синхронизации со state',
    why: 'Нативный dialog живёт через imperative API, поэтому его нужно согласовать с React state, а не обходить state стороной.',
    before:
      'Вызывать showModal() напрямую и оставлять React в неведении о том, открыт dialog или нет.',
    after:
      'Хранить isOpen в React и синхронизировать dialog.open через effect + слушатели close/cancel.',
  },
  'derived-filter': {
    recommended: 'обычное вычисление в render',
    avoid: 'escape hatch без нужды',
    why: 'Фильтрация списка не требует portal, flushSync или imperative API. Это чистое вычисление из текущих данных.',
    before:
      'Ставить effect или flushSync только потому, что задача кажется “динамической”.',
    after: 'Хранить только query и вычислять filteredItems прямо в render.',
  },
  'widget-command': {
    recommended: 'точечный imperative call',
    avoid: 'переписывать весь screen в imperative runtime',
    why: 'Если внешняя библиотека уже имеет собственный instance API, React должен вызывать только нужную команду и сохранять границы ответственности.',
    before:
      'Отдавать библиотеке большой кусок React-owned DOM и позволять ей менять всё подряд.',
    after:
      'Выделить отдельный host или stable instance и вызывать только нужный imperative метод в нужный момент.',
  },
};

export function getEscapeRecommendation(id: BoundaryScenarioId) {
  return recommendationMap[id];
}

export function getBoundaryScenarioTitle(id: BoundaryScenarioId) {
  return boundaryScenarios.find((item) => item.id === id)?.title ?? '';
}
