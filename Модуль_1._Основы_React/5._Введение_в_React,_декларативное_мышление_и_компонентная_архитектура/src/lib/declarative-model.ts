import type { CatalogOptions } from './catalog-domain';
import { deriveCatalogView } from './catalog-domain';
import type { StatusTone } from './common';

export function buildDeclarativeComparison(options: CatalogOptions) {
  const view = deriveCatalogView(options);

  const imperativeSteps = [
    'Считать текущее значение поля поиска и checkbox из DOM.',
    'Найти контейнер со списком и вручную очистить или перестроить его.',
    ...(options.query
      ? [`Скрыть карточки, которые не содержат «${options.query}».`]
      : ['Если поиск пустой, показать все карточки обратно.']),
    ...(options.category !== 'all'
      ? [`Скрыть секции, которые не относятся к категории «${options.category}».`]
      : ['Категории не ограничены: значит, секции тоже нужно вернуть вручную.']),
    ...(options.onlyStable
      ? ['Дополнительно убрать из DOM карточки со статусом draft.']
      : []),
    ...(options.sortMode === 'alphabetical'
      ? [
          'Пересобрать порядок карточек по алфавиту и заново вставить их в нужные контейнеры.',
        ]
      : ['Сохранить ручной приоритет карточек без дополнительного reordering.']),
    'Пересчитать summary, видимые категории и empty state отдельными командами.',
    'Проверить, не забыта ли подсветка карточек и не остались ли старые узлы после прошлого состояния.',
  ];

  const declarativeRules = [
    `Хранить filters как данные: query="${options.query || '∅'}", category="${options.category}".`,
    'Получать `visibleItems` и `sections` из одной pure function `deriveCatalogView`.',
    'Строить summary, empty state и список из одного и того же результата вычисления.',
    'Передавать в компоненты только нужные props, а не обходить DOM вручную.',
  ];

  const mistakes = [
    ...(options.query
      ? [
          'Легко забыть вернуть ранее скрытые карточки, если следующий запрос станет пустым.',
        ]
      : []),
    ...(options.category !== 'all'
      ? ['Можно убрать секцию визуально, но забыть обновить summary и счётчики.']
      : []),
    ...(options.onlyStable
      ? [
          'Через ручной DOM легко потерять источник истины: почему именно карточка исчезла из интерфейса.',
        ]
      : []),
    ...(view.visibleCount === 0
      ? [
          'Если список пуст, imperative code часто требует отдельного branch для placeholder и отдельного branch для восстановления карточек.',
        ]
      : [
          'Даже когда список не пуст, summary и список уже требуют синхронизации из одного набора данных.',
        ]),
  ];

  const tone: StatusTone =
    options.query || options.category !== 'all' || options.onlyStable
      ? imperativeSteps.length > 6
        ? 'error'
        : 'warn'
      : 'warn';

  return {
    tone,
    view,
    imperativeSteps,
    declarativeRules,
    mistakes,
    imperativeCount: String(
      imperativeSteps.length + view.visibleCount + view.sections.length,
    ),
    declarativeCount: String(declarativeRules.length),
    syncRisk:
      imperativeSteps.length > 7
        ? 'Высокий'
        : imperativeSteps.length > 5
          ? 'Средний'
          : 'Низкий',
    before:
      'Вы описываете каждое действие над DOM отдельно: что скрыть, что показать, как пересчитать summary и когда вернуть empty state.',
    after:
      'Вы описываете только текущее состояние фильтров и правила вычисления списка. Рендер становится следствием модели данных.',
  };
}
