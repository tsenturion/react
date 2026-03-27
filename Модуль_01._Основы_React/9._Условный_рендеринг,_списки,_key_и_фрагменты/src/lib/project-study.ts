import type { LessonLabId } from './learning-model';

type StudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

const studyMap: Record<LessonLabId, StudyEntry> = {
  conditions: {
    files: [
      {
        path: 'src/lib/conditional-model.ts',
        note: 'Чистая модель условиями собирает итоговое состояние карточки и показывает, какие ветки реально попали в рендер.',
      },
      {
        path: 'src/components/lists/ConditionalLessonPanel.tsx',
        note: 'Компонент использует `if`, ternary и `&&` прямо в JSX и поэтому тема видна в текущем UI проекта.',
      },
      {
        path: 'src/pages/ConditionalRenderingPage.tsx',
        note: 'Страница связывает переключатели, итоговый интерфейс и snippet текущего ветвления.',
      },
    ],
    snippets: [
      {
        label: 'Loading branch',
        note: 'Ранний `return` через `if` удобен, когда при loading нужно заменить весь экран другой веткой.',
        code: [
          'if (controls.isLoading) {',
          '  return {',
          "    title: 'Идёт загрузка урока',",
          "    visibleBlocks: ['skeleton'],",
          "    snippet: 'if (isLoading) { return <LoadingCard />; }',",
          '  };',
          '}',
        ].join('\n'),
      },
      {
        label: 'Conditional JSX',
        note: 'Здесь на одном и том же фрагменте видны три главные формы условий: ternary, `&&` и `? : null`.',
        code: [
          'return (',
          '  <article>',
          '    {showReviewBadge ? <Badge /> : null}',
          '    <p>{seatsLeft > 0 ? `Осталось мест: ${seatsLeft}.` : "Мест нет."}</p>',
          '    {showMentor && <p>Ментор: Ирина</p>}',
          '    {isArchived ? <ArchiveNote /> : null}',
          '  </article>',
          ');',
        ].join('\n'),
      },
    ],
  },
  lists: {
    files: [
      {
        path: 'src/lib/lesson-data.ts',
        note: 'Исходный массив данных для лабораторий списка, ключей и diffing.',
      },
      {
        path: 'src/lib/list-model.ts',
        note: 'Фильтрация, сортировка и итоговая подготовка списка происходят в обычном JavaScript до JSX.',
      },
      {
        path: 'src/components/lists/LessonCatalogView.tsx',
        note: 'Список реально строится через `map(...)`, а пустое состояние обрабатывается отдельной веткой.',
      },
      {
        path: 'src/components/lists/LessonCard.tsx',
        note: 'Каждый элемент списка оформлен как отдельный компонент, который получает только данные одного урока.',
      },
    ],
    snippets: [
      {
        label: 'List pipeline',
        note: 'Сначала массив проходит через набор условий, и только потом каждая запись превращается в React element.',
        code: [
          'const items = lessonCatalog',
          '  .filter((lesson) => matchesQuery(lesson, state.query))',
          '  .filter((lesson) => matchesTrack(lesson, state.track))',
          '  .filter((lesson) => matchesStatus(lesson, state.status))',
          '  .slice()',
          '  .sort(sortLessons(state.sort));',
        ].join('\n'),
      },
      {
        label: 'map(...) in JSX',
        note: 'Рендер списка не создаёт карточки по одной вручную: JSX описывает отображение сразу для всей коллекции.',
        code: [
          '{surface.items.map((lesson) => (',
          '  <LessonCard key={lesson.id} lesson={lesson}>',
          '    {lesson.hasLiveReview ? "Есть live review." : "Только асинхронный формат."}',
          '  </LessonCard>',
          '))}',
        ].join('\n'),
      },
    ],
  },
  keys: {
    files: [
      {
        path: 'src/components/identity/KeyIdentitySandbox.tsx',
        note: 'Главный live sandbox темы: у каждой строки есть локальный state, поэтому неправильный `key` сразу даёт видимую ошибку.',
      },
      {
        path: 'src/lib/key-bug-model.ts',
        note: 'Модель кратко объясняет, почему одно и то же действие даёт разный результат при `stable-id`, `index` и `random`.',
      },
      {
        path: 'src/pages/KeyIdentityPage.tsx',
        note: 'Страница связывает стратегию ключей, sandbox и пояснение к роли `key` как идентичности, а не как технического поля.',
      },
    ],
    snippets: [
      {
        label: 'Key selection',
        note: 'Ключ выбирается не ради отсутствия warning, а ради сохранения связи между компонентом и конкретной записью данных.',
        code: [
          'const keyOf = (item, index) =>',
          '  strategy === "stable-id"',
          '    ? item.id',
          '    : strategy === "index"',
          '      ? String(index)',
          '      : `${item.id}-${renderVersion}`;',
        ].join('\n'),
      },
      {
        label: 'Local item state',
        note: 'Локальный `draft` и счётчик существуют специально, чтобы можно было увидеть неверную привязку состояния при плохом `key`.',
        code: [
          'function CounterRow({ item }) {',
          '  const [count, setCount] = useState(0);',
          '  const [draft, setDraft] = useState(item.title);',
          '  return <input value={draft} onChange={(event) => setDraft(event.target.value)} />;',
          '}',
        ].join('\n'),
      },
    ],
  },
  reconciliation: {
    files: [
      {
        path: 'src/lib/reconciliation-model.ts',
        note: 'Модель считает reuse, mount, remove и identity drift для разных операций над массивом.',
      },
      {
        path: 'src/pages/ReconciliationPage.tsx',
        note: 'Лаборатория переводит diff-логику в наглядный отчёт: старое дерево, новое дерево и метрики сравнения.',
      },
      {
        path: 'src/components/identity/KeyIdentitySandbox.tsx',
        note: 'Этот sandbox показывает, как вычисленные различия проявляются уже в поведении реальных компонентов.',
      },
    ],
    snippets: [
      {
        label: 'Identity drift',
        note: 'Самая важная проверка: reuse может сохраниться, но ключ уже указывает на другой объект данных.',
        code: [
          'const identityDriftCount = reusedKeys.filter(',
          '  (key) => beforeMap.get(key) !== afterMap.get(key),',
          ').length;',
        ].join('\n'),
      },
      {
        label: 'Before / after keys',
        note: 'Снимки дерева строятся отдельно для старого и нового массива, чтобы сравнение было прозрачным.',
        code: [
          'const before = withKeys(baseItems, strategy, "before");',
          'const after = withKeys(applyOperation(operation), strategy, "after");',
          'const beforeMap = new Map(before.map((item) => [item.key, item.id]));',
          'const afterMap = new Map(after.map((item) => [item.key, item.id]));',
        ].join('\n'),
      },
    ],
  },
  fragments: {
    files: [
      {
        path: 'src/components/lists/AuditTable.tsx',
        note: 'Фрагмент с `key` используется именно там, где одной записи соответствуют две строки таблицы.',
      },
      {
        path: 'src/lib/fragment-model.ts',
        note: 'Модель сравнивает wrapper, Fragment и shorthand с точки зрения структуры и лишних DOM-узлов.',
      },
      {
        path: 'src/pages/FragmentPage.tsx',
        note: 'Страница показывает и live preview, и инспекцию React elements для разных способов вернуть несколько siblings.',
      },
      {
        path: 'src/lib/element-inspector.ts',
        note: 'Инспектор позволяет увидеть React element tree до реального DOM и особенно полезен для объяснения fragment-структуры.',
      },
    ],
    snippets: [
      {
        label: 'Keyed Fragment in table',
        note: 'Полная форма `<Fragment key={...}>` нужна в списке, где сам фрагмент является корнем результата `map(...)`.',
        code: [
          '{entries.map((entry) => (',
          '  <Fragment key={entry.id}>',
          '    <tr>...</tr>',
          '    {expanded ? <tr>...</tr> : null}',
          '  </Fragment>',
          '))}',
        ].join('\n'),
      },
      {
        label: 'Invalid wrapper',
        note: 'Вот тот самый случай, где лишняя обёртка уже не stylistic issue, а поломка структуры таблицы.',
        code: [
          '<tbody>',
          '  {entries.map((entry) => (',
          '    <div key={entry.id}>',
          '      <tr>...</tr>',
          '      <tr>...</tr>',
          '    </div>',
          '  ))}',
          '</tbody>',
        ].join('\n'),
      },
    ],
  },
  'dynamic-ui': {
    files: [
      {
        path: 'src/components/identity/KeyIdentitySandbox.tsx',
        note: 'Тот же sandbox, но уже в сценарии фильтрации: ошибки становятся ближе к реальному UI с draft-полями и скрытием элементов.',
      },
      {
        path: 'src/lib/key-bug-model.ts',
        note: 'Диагностика формулирует итог: перенос состояния, сброс состояния или корректное поведение.',
      },
      {
        path: 'src/pages/DynamicUiPage.tsx',
        note: 'Страница связывает sandbox, ожидаемое поведение и практический сценарий "изменил поле, отфильтровал список".',
      },
    ],
    snippets: [
      {
        label: 'Filtered list',
        note: 'Список сначала зависит от данных и фильтра, а затем именно по этому результату строится новый набор элементов.',
        code: [
          'const visibleItems =',
          '  mode === "filter" && openOnly',
          '    ? items.filter((item) => item.open)',
          '    : items;',
        ].join('\n'),
      },
      {
        label: 'Bug diagnosis',
        note: 'Текст на странице тоже строится из модели: он зависит от стратегии `key` и от действия пользователя.',
        code: [
          'if (strategy === "index") {',
          '  return {',
          '    tone: "warn",',
          '    title: "Состояние сместилось вместе с позицией",',
          '  };',
          '}',
        ].join('\n'),
      },
    ],
  },
};

export function getProjectStudy(id: LessonLabId) {
  return studyMap[id];
}
