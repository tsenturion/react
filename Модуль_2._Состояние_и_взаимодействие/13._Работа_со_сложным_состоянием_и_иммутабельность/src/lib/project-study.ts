import type { LessonLabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

const studyMap: Record<LessonLabId, StudyEntry> = {
  objects: {
    files: [
      {
        path: 'src/components/complex-state/ObjectMutationPanel.tsx',
        note: 'Реальный компонент урока показывает, как одна и та же ссылка ломает ожидаемый ререндер при update объекта.',
      },
      {
        path: 'src/lib/object-state-model.ts',
        note: 'Чистые функции урока переключают поля объекта и отдельно показывают mutable и immutable ветки.',
      },
      {
        path: 'src/pages/ObjectStatePage.tsx',
        note: 'Страница связывает живой сценарий, метрики и код обновления объекта.',
      },
    ],
    snippets: [
      {
        label: 'Immutable object update',
        note: 'React видит новый reference только тогда, когда объект действительно заменяется новой ссылкой.',
        code: [
          'setSettings((current) => ({',
          '  ...current,',
          "  theme: current.theme === 'light' ? 'dark' : 'light',",
          '}));',
        ].join('\n'),
      },
      {
        label: 'Mutable bug',
        note: 'Та же ссылка возвращается обратно в state, поэтому React может не сделать новый рендер.',
        code: [
          "settings.theme = settings.theme === 'light' ? 'dark' : 'light';",
          'setSettings(settings);',
        ].join('\n'),
      },
    ],
  },
  arrays: {
    files: [
      {
        path: 'src/components/complex-state/ArrayStateWorkshop.tsx',
        note: 'Компонент урока обновляет массив через spread, map, filter и slice.',
      },
      {
        path: 'src/lib/array-state-model.ts',
        note: 'Здесь лежат реальные immutable-операции для добавления, удаления, toggle и reorder.',
      },
      {
        path: 'src/pages/ArrayStatePage.tsx',
        note: 'Страница объясняет, какие array-методы безопасны для state, а какие нет.',
      },
    ],
    snippets: [
      {
        label: 'Array toggle',
        note: 'Обновление одного элемента массива строится через map и частичную замену только нужной записи.',
        code: [
          'setItems((current) =>',
          '  current.map((item) =>',
          '    item.id === targetId ? { ...item, done: !item.done } : item,',
          '  ),',
          ');',
        ].join('\n'),
      },
      {
        label: 'Remove by filter',
        note: 'Удаление строится через новый массив, а не через splice над исходным.',
        code: ['setItems((current) => current.filter((item) => !item.done));'].join('\n'),
      },
    ],
  },
  nested: {
    files: [
      {
        path: 'src/components/complex-state/NestedBoardEditor.tsx',
        note: 'Компонент воспроизводит nested update и показывает, как мутация leaf-узла прячется до следующего чужого рендера.',
      },
      {
        path: 'src/lib/nested-state-model.ts',
        note: 'Чистые функции обновляют одну вложенную задачу либо корректно, либо через прямую мутацию.',
      },
      {
        path: 'src/lib/complex-state-domain.ts',
        note: 'В доменной модели урока описана вложенная структура колонок и задач.',
      },
    ],
    snippets: [
      {
        label: 'Nested immutable update',
        note: 'При изменении leaf-узла копируется весь путь от корня до него.',
        code: [
          'setBoard((current) => ({',
          '  ...current,',
          '  columns: current.columns.map((column) =>',
          '    column.id === targetColumnId',
          '      ? {',
          '          ...column,',
          '          tasks: column.tasks.map((task) =>',
          '            task.id === targetTaskId ? { ...task, points: task.points + 1 } : task,',
          '          ),',
          '        }',
          '      : column,',
          '  ),',
          '}));',
        ].join('\n'),
      },
      {
        label: 'Nested mutation',
        note: 'Изменение leaf-узла без новой ссылки наверху ломает ожидаемую модель рендера.',
        code: ['task.points += 1;', 'setBoard(board);'].join('\n'),
      },
    ],
  },
  bugs: {
    files: [
      {
        path: 'src/components/complex-state/MutationHistoryLab.tsx',
        note: 'Компонент строит две параллельные истории: сломанную из-за мутации и корректную из immutable snapshots.',
      },
      {
        path: 'src/lib/mutation-history-model.ts',
        note: 'Модель урока наглядно различает append той же ссылки и append нового snapshot-объекта.',
      },
      {
        path: 'src/pages/MutationBugsPage.tsx',
        note: 'Страница связывает потерю истории, скрытые баги интерфейса и некорректную синхронность.',
      },
    ],
    snippets: [
      {
        label: 'Broken history append',
        note: 'Та же ссылка повторно кладётся в массив истории, поэтому прошлые версии стираются.',
        code: [
          'const last = current[current.length - 1];',
          "last.title = 'Черновик r2';",
          'return [...current, last];',
        ].join('\n'),
      },
      {
        label: 'Snapshot append',
        note: 'Новый объект сохраняет прошлое и делает историю честной.',
        code: [
          'const last = current[current.length - 1];',
          "const next = { ...last, title: 'Черновик r2' };",
          'return [...current, next];',
        ].join('\n'),
      },
    ],
  },
  normalize: {
    files: [
      {
        path: 'src/components/complex-state/NormalizedTaskBoard.tsx',
        note: 'Этот компонент реально хранит board в нормализованном виде: колонка отдельно, task entity отдельно.',
      },
      {
        path: 'src/lib/normalization-model.ts',
        note: 'Здесь лежат update-операции по `tasksById` и `columnsById`, а также сравнение nested и normalized копий.',
      },
      {
        path: 'src/lib/complex-state-domain.ts',
        note: 'Доменная модель показывает нормализованную схему состояния проекта.',
      },
    ],
    snippets: [
      {
        label: 'Normalized rename',
        note: 'Одна задача меняется точечно внутри entity storage.',
        code: [
          'setBoard((current) => ({',
          '  ...current,',
          '  tasksById: {',
          '    ...current.tasksById,',
          '    [taskId]: { ...current.tasksById[taskId], title: nextTitle },',
          '  },',
          '}));',
        ].join('\n'),
      },
      {
        label: 'Move by ids',
        note: 'Перемещение между колонками меняет только нужные массивы id.',
        code: [
          'columnsById: {',
          '  ...current.columnsById,',
          '  [from]: { ...current.columnsById[from], taskIds: current.columnsById[from].taskIds.filter((id) => id !== taskId) },',
          '  [to]: { ...current.columnsById[to], taskIds: [...current.columnsById[to].taskIds, taskId] },',
          '},',
        ].join('\n'),
      },
    ],
  },
  sharing: {
    files: [
      {
        path: 'src/components/complex-state/StructuralSharingSandbox.tsx',
        note: 'Компонент сравнивает точечное копирование и глубокое клонирование всех элементов на одном списке.',
      },
      {
        path: 'src/lib/structural-sharing-model.ts',
        note: 'Модель считает reused и recreated references после update.',
      },
      {
        path: 'src/pages/StructuralSharingPage.tsx',
        note: 'Страница связывает иммутабельность не только с корректностью, но и с производительностью.',
      },
    ],
    snippets: [
      {
        label: 'Targeted copy',
        note: 'Новый объект создаётся только для реально изменённой записи.',
        code: [
          'const next = items.map((item) =>',
          '  item.id === targetId ? { ...item, score: item.score + 1 } : item,',
          ');',
        ].join('\n'),
      },
      {
        label: 'Deep clone all',
        note: 'Корректно, но все ссылки становятся новыми даже без реального изменения данных.',
        code: [
          'const next = items.map((item) => ({',
          '  ...item,',
          '  owner: { ...item.owner },',
          '  score: item.id === targetId ? item.score + 1 : item.score,',
          '}));',
        ].join('\n'),
      },
    ],
  },
};

export function getProjectStudy(id: LessonLabId) {
  return studyMap[id];
}
