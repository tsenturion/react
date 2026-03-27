import type { CatalogView } from './catalog-domain';
import type { StatusTone } from './common';

export const buildImperativeOperations = (
  view: CatalogView,
  selectedId: string | null,
) => {
  const operations = [
    'Очистить старый контейнер через replaceChildren().',
    `Создать summary-блок с числом карточек: ${view.visibleCount}.`,
  ];

  for (const section of view.sections) {
    operations.push(`Создать section для категории «${section.category}».`);

    for (const item of section.items) {
      operations.push(`Создать card для «${item.title}».`);
      operations.push(
        `Записать textContent и status для «${item.title}» отдельными DOM-операциями.`,
      );
    }
  }

  if (selectedId) {
    const selectedTitle =
      view.items.find((item) => item.id === selectedId)?.title ?? selectedId;
    operations.push(`Найти в DOM карточку «${selectedTitle}» и добавить ей выделение.`);
  }

  if (view.visibleCount === 0) {
    operations.push('Отдельно создать empty state и убрать прежние секции.');
  }

  return operations;
};

export function compareJsAndReact(view: CatalogView, selectedId: string | null) {
  const imperativeLog = buildImperativeOperations(view, selectedId);
  const reactLog = [
    'Держать filters и selectedId как данные внутри компонента.',
    'Получать `view` из pure function `deriveCatalogView(options)`.',
    'Передать `view` и `highlightedId` в `<CatalogSurface />`.',
    'Позволить React самому синхронизировать DOM с новым деревом элементов.',
  ];

  const tone: StatusTone = imperativeLog.length > reactLog.length * 2 ? 'error' : 'warn';

  return {
    tone,
    imperativeLog,
    reactLog,
    domOperationEstimate: String(imperativeLog.length),
    reactRuleCount: String(reactLog.length),
    risks: [
      'В обычном JS легко забыть вернуть карточку обратно после предыдущего фильтра.',
      'Summary, список и выделение требуют отдельной синхронизации, если DOM обновляется пошагово.',
      'React не убирает JavaScript из уравнения, но меняет вопрос с «как трогать DOM» на «какой UI должен получиться».',
    ],
    before:
      'Обычный JS заставляет шаг за шагом создавать, удалять и перестраивать DOM-узлы под каждое состояние.',
    after:
      'React позволяет держать состояние, вычислять дерево элементов и получать обновлённый интерфейс из этого описания.',
  };
}
