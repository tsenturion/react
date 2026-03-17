export const projectStudy = {
  syntax: {
    files: [
      {
        path: 'src/lib/syntax-model.ts',
        note: 'Pure functions со сборкой выражений, destructuring, spread/rest, optional chaining и nullish coalescing.',
      },
      {
        path: 'src/pages/SyntaxPage.tsx',
        note: 'React-страница, которая превращает выбранные параметры в видимый результат и не прячет вычисления в JSX.',
      },
      {
        path: 'src/App.tsx',
        note: 'Оболочка проекта тоже строится на `const`, массивах конфигурации и `map` для меню лабораторий.',
      },
    ],
    snippets: [
      {
        label: 'src/lib/syntax-model.ts',
        note: 'Здесь один и тот же вход проходит через destructuring, spread, optional chaining и nullish coalescing.',
        code: `const {
  title,
  meta: { city, mentor, caption },
  topics: [firstTopic, ...otherTopics],
} = course;

const safeMentor = mentor?.name ?? 'не назначен';
const captionWithOr = caption || 'react-ready';
const captionWithNullish = caption ?? 'react-ready';
const mergedTopics = [...course.topics, ...extraTopics];`,
      },
      {
        label: 'src/pages/SyntaxPage.tsx',
        note: 'Страница получает готовую модель из JS-модуля и только отображает её через JSX.',
        code: `const playground = buildSyntaxPlayground({
  bindingMode,
  captionState,
  includeMentor,
  city,
  extraTopics,
});

{playground.mergedTopics.map((topic) => (
  <span key={topic}>{topic}</span>
))}`,
      },
    ],
  },
  modules: {
    files: [
      {
        path: 'src/lib/js-module-catalog.ts',
        note: 'Модуль с данными и смешанным экспортом: named exports плюс default export.',
      },
      {
        path: 'src/lib/module-model.ts',
        note: 'Слой, который импортирует named и default exports и собирает результат для лаборатории.',
      },
      {
        path: 'src/pages/ModulesPage.tsx',
        note: 'Интерфейсно показывает, что import/export уже участвуют в реальном устройстве проекта.',
      },
    ],
    snippets: [
      {
        label: 'src/lib/module-model.ts',
        note: 'Так в проекте выражен mixed import: named exports для массива и helper-функций, default export для рекомендации.',
        code: `import pickRecommendedLesson, {
  describeLesson,
  lessonCards,
  moduleKinds,
} from './js-module-catalog';`,
      },
      {
        label: 'src/lib/js-module-catalog.ts',
        note: 'Модуль экспортирует и данные, и функции, чтобы import/export был не декорацией, а реальной архитектурой.',
        code: `export const lessonCards = [/* ... */];

export const describeLesson = (lesson) =>
  \`\${lesson.title} • \${lesson.tags.join(', ')}\`;

const pickRecommendedLesson = (items, goal) => /* ... */;

export default pickRecommendedLesson;`,
      },
    ],
  },
  collections: {
    files: [
      {
        path: 'src/lib/collection-model.ts',
        note: 'Центральное место темы про map/filter/reduce, объекты и массивы.',
      },
      {
        path: 'src/lib/js-module-catalog.ts',
        note: 'Исходный массив карточек, из которого коллекции строят видимый интерфейс.',
      },
      {
        path: 'src/pages/CollectionsPage.tsx',
        note: 'UI показывает, как фильтрация и сводка появляются из той же модели данных.',
      },
    ],
    snippets: [
      {
        label: 'src/lib/collection-model.ts',
        note: 'Эта цепочка превращает один массив уроков в список карточек, суммарную длительность и breakdown по уровням.',
        code: `const visibleLessons = lessonCards
  .filter(matchesLevel)
  .filter(matchesTag)
  .filter(matchesQuery);

const metrics = visibleLessons.reduce((acc, lesson) => ({
  totalVisible: acc.totalVisible + 1,
  totalDuration: acc.totalDuration + lesson.duration,
  readyCount: acc.readyCount + Number(lesson.ready),
}), { totalVisible: 0, totalDuration: 0, readyCount: 0 });`,
      },
      {
        label: 'src/pages/CollectionsPage.tsx',
        note: 'Рендер остаётся декларативным: готовые массивы и объекты просто мапятся в карточки и метрики.',
        code: `{view.visibleLessons.map((lesson) => (
  <article key={lesson.id}>
    <h3>{lesson.title}</h3>
    <p>{lesson.summary}</p>
  </article>
))}`,
      },
    ],
  },
  closures: {
    files: [
      {
        path: 'src/lib/closure-model.ts',
        note: 'Фабрика функций, которая создаёт action pack с замкнутыми значениями.',
      },
      {
        path: 'src/pages/ClosuresPage.tsx',
        note: 'Страница хранит сгенерированные обработчики в state, чтобы было видно, как closure удерживает старое значение.',
      },
      {
        path: 'src/lib/js-module-catalog.ts',
        note: 'Данные уроков входят в closure-пакет и дают реальное содержимое обработчикам.',
      },
    ],
    snippets: [
      {
        label: 'src/lib/closure-model.ts',
        note: 'Каждый `run` замыкает свой `capturedBonus`; после смены draft-значения старый набор это не забудет.',
        code: `return lessonCards.slice(0, 3).map((lesson, index) => {
  const capturedBonus = baseBonus + index * 2;

  return {
    id: lesson.id,
    label: lesson.title,
    capturedBonus,
    run: () => \`\${lesson.title}: \${lesson.duration + capturedBonus} мин\`,
  };
});`,
      },
      {
        label: 'src/pages/ClosuresPage.tsx',
        note: 'Набор функций хранится в state специально, чтобы не пересоздаваться на каждый рендер и демонстрировать момент захвата окружения.',
        code: `const [actions, setActions] = useState<ClosureAction[]>(() =>
  createClosureActionPack(draftBonus),
);

const regeneratePack = () => {
  setActions(createClosureActionPack(draftBonus));
};`,
      },
    ],
  },
  async: {
    files: [
      {
        path: 'src/lib/async-model.ts',
        note: 'Здесь сосредоточены `fetch`, async/await, разбор ответа и фильтрация удалённых данных.',
      },
      {
        path: 'public/data/js-react-catalog.json',
        note: 'Локальный JSON для реального запроса через `fetch` без внешней сети.',
      },
      {
        path: 'src/pages/AsyncPage.tsx',
        note: 'Страница показывает loading, success и error-состояния и держит асинхронный поток прозрачным.',
      },
    ],
    snippets: [
      {
        label: 'src/lib/async-model.ts',
        note: 'Запрос идёт через настоящий `fetch`, а задержка вынесена отдельно, чтобы loading можно было наблюдать явно.',
        code: `export const fetchCatalog = async (mode) => {
  if (mode === 'slow') {
    await wait(900);
  }

  const response = await fetch(resolveCatalogUrl(mode));

  if (!response.ok) {
    throw new Error(\`HTTP \${response.status}: каталог не загрузился\`);
  }

  return (await response.json());
};`,
      },
      {
        label: 'src/pages/AsyncPage.tsx',
        note: 'Асинхронный обработчик держит явные переходы idle -> loading -> success/error.',
        code: `const loadCatalog = async () => {
  setRequestState({ status: 'loading', payload: null, error: '' });

  try {
    const payload = await fetchCatalog(mode);
    setRequestState({ status: 'success', payload, error: '' });
  } catch (error) {
    setRequestState({ status: 'error', payload: null, error: toRequestError(error) });
  }
};`,
      },
    ],
  },
  immutability: {
    files: [
      {
        path: 'src/lib/immutability-model.ts',
        note: 'Обе стратегии обновления данных лежат рядом: неправильная мутация и правильное копирование структуры.',
      },
      {
        path: 'src/pages/ImmutabilityPage.tsx',
        note: 'Интерфейс даёт сравнить скрытую мутацию и корректное immutable-обновление на соседних панелях.',
      },
      {
        path: 'src/lib/learning-model.test.ts',
        note: 'Unit tests отдельно подтверждают разницу ссылок между стратегиями.',
      },
    ],
    snippets: [
      {
        label: 'src/lib/immutability-model.ts',
        note: 'Один helper возвращает тот же root object, второй создаёт новый root, новый массив и новый элемент.',
        code: `export const mutateLessonInPlace = (board, lessonId) => {
  const lesson = board.lessons.find((item) => item.id === lessonId);
  if (lesson) lesson.done = !lesson.done;
  board.summary.done = countDone(board.lessons);
  return board;
};

export const toggleLessonImmutably = (board, lessonId) => {
  const lessons = board.lessons.map((lesson) =>
    lesson.id === lessonId ? { ...lesson, done: !lesson.done } : lesson,
  );

  return { ...board, lessons, summary: buildSummary(lessons) };
};`,
      },
      {
        label: 'src/pages/ImmutabilityPage.tsx',
        note: 'Неправильный обработчик оставлен намеренно как контролируемая демонстрация React-bailout на той же ссылке.',
        code: `const runBrokenMutation = () => {
  setBrokenBoard((current) => mutateLessonInPlace(current, selectedLessonId));
};

const runImmutableUpdate = () => {
  setSafeBoard((current) => toggleLessonImmutably(current, selectedLessonId));
};`,
      },
    ],
  },
} as const;
