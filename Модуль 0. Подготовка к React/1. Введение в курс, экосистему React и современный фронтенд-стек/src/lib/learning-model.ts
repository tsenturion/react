import { stackVersions } from './stack-meta';

export type StatusTone = 'success' | 'warn' | 'error';

export type EcosystemLayerId =
  | 'browser'
  | 'dom'
  | 'javascript'
  | 'react'
  | 'node'
  | 'npm'
  | 'vite'
  | 'react-router'
  | 'react-router-framework'
  | 'nextjs'
  | 'full-stack-react'
  | 'docker';

export interface EcosystemLayer {
  id: EcosystemLayerId;
  title: string;
  zone: 'browser' | 'tooling' | 'architecture';
  short: string;
}

export const ecosystemLayers: EcosystemLayer[] = [
  {
    id: 'browser',
    title: 'Браузер',
    zone: 'browser',
    short: 'Показывает интерфейс и выполняет клиентский JS.',
  },
  {
    id: 'dom',
    title: 'DOM',
    zone: 'browser',
    short: 'Дерево узлов, которое React и обычный JS обновляют.',
  },
  {
    id: 'javascript',
    title: 'JavaScript',
    zone: 'browser',
    short: 'Язык, на котором пишется логика интерфейса.',
  },
  {
    id: 'react',
    title: 'React',
    zone: 'architecture',
    short: 'Декларативный слой описания UI из компонентов.',
  },
  {
    id: 'node',
    title: 'Node.js',
    zone: 'tooling',
    short: 'Исполняет dev-серверы, сборку, тесты и CLI-инструменты.',
  },
  {
    id: 'npm',
    title: 'npm',
    zone: 'tooling',
    short: 'Каталог пакетов и пакетный менеджер вокруг экосистемы.',
  },
  {
    id: 'vite',
    title: 'Vite',
    zone: 'tooling',
    short: 'Делает dev server, HMR и production build.',
  },
  {
    id: 'react-router',
    title: 'React Router',
    zone: 'architecture',
    short: 'Даёт клиентский роутинг и data APIs поверх React-экранов.',
  },
  {
    id: 'react-router-framework',
    title: 'React Router framework mode',
    zone: 'architecture',
    short:
      'Поднимает React Router до framework-уровня: routes, loaders/actions, bundling и server/client границы.',
  },
  {
    id: 'nextjs',
    title: 'Next.js',
    zone: 'architecture',
    short:
      'Full-stack React framework с App Router, серверным рендерингом и server features.',
  },
  {
    id: 'full-stack-react',
    title: 'Full-stack React',
    zone: 'architecture',
    short:
      'Архитектурный слой, где React работает вместе с маршрутизацией, данными и сервером.',
  },
  {
    id: 'docker',
    title: 'Docker',
    zone: 'tooling',
    short: 'Упаковывает приложение и среду запуска в воспроизводимый образ.',
  },
];

export type RuntimeId = 'browser' | 'node' | 'build' | 'server' | 'container';

export interface RuntimeMarker {
  id: RuntimeId;
  label: string;
  detail: string;
}

export interface EcosystemTask {
  id: string;
  title: string;
  prompt: string;
  activeLayers: EcosystemLayerId[];
  runtimes: RuntimeMarker[];
  before: string;
  after: string;
  whyItMatters: string[];
  mistakes: string[];
}

export const ecosystemTasks: EcosystemTask[] = [
  {
    id: 'first-screen',
    title: 'Показать первый экран в браузере',
    prompt: 'Вы меняете исходники и хотите сразу увидеть UI на странице.',
    activeLayers: ['browser', 'dom', 'javascript', 'react', 'vite', 'node'],
    runtimes: [
      {
        id: 'node',
        label: 'Node.js',
        detail: 'Запускает Vite dev server и раздаёт модули.',
      },
      {
        id: 'build',
        label: 'Transform',
        detail: 'Vite преобразует JSX и строит модульный граф.',
      },
      {
        id: 'browser',
        label: 'Browser',
        detail: 'Браузер исполняет итоговые модули и рисует интерфейс.',
      },
    ],
    before: 'Легко спутать React с магией: как будто код сам появляется в браузере.',
    after:
      'На деле есть цепочка: исходники -> dev server/build tool -> модульный граф -> браузер -> DOM.',
    whyItMatters: [
      'Понимание цепочки ускоряет отладку импортов, env-переменных и ошибок сборки.',
      'Становится ясно, почему JSX и bare imports не исполняются браузером без подготовки.',
    ],
    mistakes: [
      'Ожидать, что HTML-файл сам понимает JSX.',
      'Не различать, где код работает: в Node.js или уже в браузере.',
    ],
  },
  {
    id: 'install-package',
    title: 'Подключить стороннюю библиотеку',
    prompt: 'Нужно добавить пакет из экосистемы и использовать его в UI.',
    activeLayers: ['npm', 'node', 'vite', 'javascript', 'react'],
    runtimes: [
      {
        id: 'node',
        label: 'Node.js',
        detail: 'Пакетный менеджер и установка живут вне браузера.',
      },
      {
        id: 'build',
        label: 'Dependency graph',
        detail: 'Vite резолвит пакет и собирает его в приложение.',
      },
      {
        id: 'browser',
        label: 'Browser',
        detail: 'Браузер получает уже подготовленный код пакета.',
      },
    ],
    before: 'Кажется, что npm и React живут в одном месте и работают одинаково.',
    after:
      'npm нужен для поставки кода, React нужен для описания UI, а Vite связывает это в рабочий pipeline.',
    whyItMatters: [
      'Это объясняет, почему без `npm install` import может существовать в коде, но не работать в сборке.',
      'Становится понятна разница между dependency и devDependency.',
    ],
    mistakes: [
      'Пытаться импортировать пакет, которого нет в `package.json` и `node_modules`.',
      'Считать, что браузер сам умеет резолвить имя `react` как пакет из npm.',
    ],
  },
  {
    id: 'ship-build',
    title: 'Подготовить production build',
    prompt:
      'Вы готовите приложение к production: его нужно собрать, оптимизировать и корректно доставить в браузер.',
    activeLayers: ['vite', 'node', 'react', 'javascript', 'browser', 'docker'],
    runtimes: [
      {
        id: 'build',
        label: 'Build step',
        detail: 'Сборщик минимизирует код, делит чанки и хэширует ассеты.',
      },
      {
        id: 'container',
        label: 'Docker',
        detail: 'Готовый билд можно упаковать в воспроизводимый контейнер.',
      },
      {
        id: 'browser',
        label: 'Browser',
        detail: 'Вы открываете уже оптимизированные статические файлы в браузере.',
      },
    ],
    before: 'Есть иллюзия, что dev server и production ведут себя одинаково.',
    after:
      'В production нет HMR и внутренних проверок: важны статические ассеты, маршруты и конфигурация сервера.',
    whyItMatters: [
      'Ошибки, которые не видны в деве, часто всплывают на build-этапе или внутри Docker/Linux.',
      'Это критично для SPA-роутинга, env-переменных и корректной раздачи `index.html`.',
    ],
    mistakes: [
      'Считать `npm run dev` достаточной проверкой перед деплоем.',
      'Забывать настроить fallback на `index.html` для клиентских маршрутов.',
    ],
  },
  {
    id: 'client-routing',
    title: 'Добавить навигацию без полной перезагрузки',
    prompt: 'Интерфейс разрастается и его нужно разделить на экраны.',
    activeLayers: ['react', 'react-router', 'browser', 'javascript', 'vite'],
    runtimes: [
      {
        id: 'browser',
        label: 'Browser',
        detail: 'Адрес меняется без полной загрузки новой HTML-страницы.',
      },
      {
        id: 'build',
        label: 'Bundler',
        detail: 'Маршруты и чанки связываются в единое SPA-приложение.',
      },
    ],
    before: 'Можно подумать, что роутинг сам по себе уже означает full-stack приложение.',
    after:
      'Клиентский React Router управляет экранами в браузере, но не добавляет автоматически SSR и framework-level server data.',
    whyItMatters: [
      'Это помогает не путать SPA-роутинг с framework-first архитектурой.',
      'Становится яснее, зачем для сложных data flows иногда нужен уже не только Vite, а React Router framework mode или Next.js.',
    ],
    mistakes: [
      'Путать клиентский роутинг с серверным рендерингом.',
      'Не учитывать, что прямой переход на вложенный URL требует серверного SPA fallback.',
    ],
  },
  {
    id: 'server-rendering',
    title: 'Нужны SSR, loader/action или server functions',
    prompt:
      'Проект требует не только клиентский UI, но и серверный слой в той же архитектуре.',
    activeLayers: [
      'full-stack-react',
      'react',
      'react-router-framework',
      'nextjs',
      'node',
      'browser',
    ],
    runtimes: [
      {
        id: 'server',
        label: 'Server runtime',
        detail: 'Часть React-логики и загрузки данных выполняется на сервере.',
      },
      {
        id: 'browser',
        label: 'Browser',
        detail: 'Клиент гидрирует интерфейс и продолжает взаимодействие.',
      },
    ],
    before: 'Легко ожидать, что Vite сам превратит SPA в full-stack решение.',
    after:
      'Для SSR и server data нужен full-stack React слой: например, React Router framework mode или Next.js, а не только Vite SPA.',
    whyItMatters: [
      'Это помогает выбрать правильный уровень абстракции до того, как приложение перерастёт простой SPA.',
      'Понимание границ client/server уменьшает архитектурные тупики.',
    ],
    mistakes: [
      'Думать, что SSR появляется автоматически после подключения клиентского React Router к Vite-приложению.',
      'Смешивать клиентские `useEffect`-запросы и полноценную серверную стратегию данных.',
    ],
  },
  {
    id: 'team-delivery',
    title: 'Запустить единый workflow команды',
    prompt: 'Нужно, чтобы проект одинаково запускался локально, в CI и в контейнере.',
    activeLayers: ['node', 'npm', 'vite', 'docker', 'react'],
    runtimes: [
      {
        id: 'node',
        label: 'Local/CI Node.js',
        detail:
          'Одинаковые версии Node и scripts убирают класс ошибок "у меня работает".',
      },
      {
        id: 'container',
        label: 'Docker',
        detail: 'Контейнер фиксирует окружение и способ доставки приложения.',
      },
    ],
    before: 'Среду разработки часто воспринимают как второстепенную деталь.',
    after:
      'На практике `package.json`, scripts, версия Node и Docker напрямую влияют на воспроизводимость проекта.',
    whyItMatters: [
      'Это критично для onboarding, CI, сборки и последующего деплоя.',
      'Даже сильный UI-код теряет ценность, если проект нестабилен как инженерная система.',
    ],
    mistakes: [
      'Не фиксировать команды запуска и тестирования в scripts.',
      'Игнорировать Linux-sensitive проблемы с регистром путей и серверным fallback.',
    ],
  },
];

export interface ArtifactCheck {
  id: string;
  title: string;
  directOwner: string;
  needsStep: string;
  practice: string;
}

export const artifactChecks: ArtifactCheck[] = [
  {
    id: 'plain-html',
    title: 'HTML + обычный JS',
    directOwner: 'Браузер понимает это напрямую.',
    needsStep: 'Дополнительный build-этап не обязателен.',
    practice:
      'Хорошо для простых виджетов и понимания платформы, но быстро упирается в масштабируемость UI.',
  },
  {
    id: 'jsx',
    title: 'JSX-компонент',
    directOwner: 'Браузер напрямую JSX не исполняет.',
    needsStep: 'Нужен transform: Vite/Babel/компилятор превращает JSX в JS.',
    practice:
      'Это ключ к пониманию, почему React почти всегда изучают вместе со сборщиком.',
  },
  {
    id: 'typescript',
    title: 'TypeScript-аннотации',
    directOwner: 'TypeScript живёт на этапе разработки, не в рантайме браузера.',
    needsStep: 'Нужен transpile/strip типов до обычного JS.',
    practice:
      'Поэтому типы помогают разработке, но не заменяют понимание реального runtime-поведения.',
  },
  {
    id: 'npm-package',
    title: 'Импорт `react` из npm',
    directOwner: 'Имя пакета резолвится инструментами, а не "магией браузера".',
    needsStep:
      'Пакет должен быть установлен, затем сборщик или dev server подключает его в граф модулей.',
    practice:
      'Это объясняет типичный `Cannot find package` при проблемах с зависимостями.',
  },
  {
    id: 'dockerfile',
    title: 'Dockerfile и контейнер',
    directOwner: 'Docker вообще вне браузера и даже вне React.',
    needsStep: 'Он описывает, как собрать и запустить приложение как инженерную систему.',
    practice: 'Важно для CI/CD, повторяемости окружения и корректного деплоя SPA.',
  },
];

export type EcosystemReferencePointId =
  | 'cra'
  | 'vite'
  | 'react-router-framework'
  | 'nextjs'
  | 'full-stack-react';

export interface EcosystemReferencePoint {
  id: EcosystemReferencePointId;
  label: string;
  tone: StatusTone;
  status: string;
  summary: string;
  layerNote: string;
  activeLayers: EcosystemLayerId[];
  whenUseful: string;
  watchOut: string;
}

// Эти точки входа нужны не для "справочника названий", а чтобы наглядно показать,
// где именно сегодня располагаются Vite, framework mode и Next.js относительно React.
export const ecosystemReferencePoints: EcosystemReferencePoint[] = [
  {
    id: 'cra',
    label: 'Create React App (CRA)',
    tone: 'warn',
    status: 'Legacy стартовая точка',
    summary:
      'CRA исторически важен, но для новых приложений и нового обучения больше не считается базовой отправной точкой.',
    layerNote:
      'Это старый scaffolding-подход вокруг React, Node.js и npm. Он не объясняет современную картину так прозрачно, как Vite и framework-first инструменты.',
    activeLayers: ['react', 'node', 'npm'],
    whenUseful:
      'Полезно узнавать его при чтении старых codebase и миграциях, где CRA уже присутствует.',
    watchOut:
      'Не путайте поддержку старого проекта с выбором стартовой точки для нового приложения или нового курса.',
  },
  {
    id: 'vite',
    label: 'Vite',
    tone: 'success',
    status: 'Основная client-side отправная точка',
    summary:
      'Vite закрывает современный React pipeline для клиентского приложения: dev server, transform, npm-граф, HMR и production build.',
    layerNote:
      'Это build tool и dev toolchain, а не full-stack framework. Он живёт между исходниками и браузером.',
    activeLayers: ['vite', 'node', 'npm', 'react', 'browser'],
    whenUseful:
      'Подходит для изучения React, для SPA, админок, кабинетов и интерфейсов, где не требуется framework-level server layer.',
    watchOut:
      'Не ожидайте от Vite встроенный SSR, route loaders, server actions или App Router только потому, что проект уже собран современным toolchain.',
  },
  {
    id: 'react-router-framework',
    label: 'React Router framework mode',
    tone: 'success',
    status: 'Framework-first вариант на базе React Router',
    summary:
      'Framework mode поднимает React Router выше клиентского роутинга и связывает маршруты, данные, server/client границы и build-процесс в единую систему.',
    layerNote:
      'Это уже не просто SPA-router. Здесь React Router становится частью full-stack React архитектуры.',
    activeLayers: [
      'react-router-framework',
      'react-router',
      'full-stack-react',
      'react',
      'node',
      'browser',
    ],
    whenUseful:
      'Подходит, когда нужны route-level data, формы и мутации через серверный слой, SSR или более цельная архитектура вокруг маршрутов.',
    watchOut:
      'Не путайте framework mode с обычным подключением `react-router-dom` внутри Vite SPA: уровень абстракции и ответственности здесь выше.',
  },
  {
    id: 'nextjs',
    label: 'Next.js App Router',
    tone: 'success',
    status: 'Full-stack React framework',
    summary:
      'Next.js располагается в той же framework-first зоне: React здесь работает вместе с маршрутизацией, серверным рендерингом, серверными функциями и стратегиями доставки.',
    layerNote:
      'Это не build tool вместо Vite, а более высокий full-stack слой со своей архитектурой и runtime-моделью.',
    activeLayers: ['nextjs', 'full-stack-react', 'react', 'node', 'browser'],
    whenUseful:
      'Подходит для гибридного рендеринга, SEO-нагруженных приложений и продуктовых систем, где клиент и сервер проектируются как единая платформа.',
    watchOut:
      'Не стоит выбирать Next.js только из-за слова "framework": если задача чисто клиентская, этот слой может быть избыточен.',
  },
  {
    id: 'full-stack-react',
    label: 'Full-stack React',
    tone: 'success',
    status: 'Архитектурная зона, а не один пакет',
    summary:
      'Full-stack React означает не конкретную библиотеку, а класс решений, где React связан с роутингом, сервером, загрузкой данных и delivery-стратегией.',
    layerNote:
      'На этой карте Vite находится ниже как build tool, а React Router framework mode и Next.js находятся внутри этой более высокой архитектурной зоны.',
    activeLayers: ['full-stack-react', 'react', 'node', 'browser'],
    whenUseful:
      'Важно держать эту рамку в голове, когда требования выходят за пределы чистого client-side SPA.',
    watchOut:
      'Не используйте термин "full-stack React" как синоним любого React-проекта: большинство проектов начинают с более простого client-side слоя.',
  },
];

export type ReactFeatureId =
  | 'shared-state'
  | 'repeated-blocks'
  | 'async-states'
  | 'team-reuse'
  | 'cross-screen-consistency';

export interface ReactFeatureOption {
  id: ReactFeatureId;
  label: string;
  hint: string;
}

export const reactFeatureOptions: ReactFeatureOption[] = [
  {
    id: 'shared-state',
    label: 'Общее состояние',
    hint: 'Одни и те же данные влияют на несколько частей экрана.',
  },
  {
    id: 'repeated-blocks',
    label: 'Повторяющиеся блоки',
    hint: 'Один UI-паттерн нужен много раз с разными данными.',
  },
  {
    id: 'async-states',
    label: 'Loading/Error/Empty',
    hint: 'Экран должен держать несколько состояний интерфейса.',
  },
  {
    id: 'team-reuse',
    label: 'Переиспользование в команде',
    hint: 'Компоненты становятся инженерным API, а не разовой разметкой.',
  },
  {
    id: 'cross-screen-consistency',
    label: 'Единое поведение на разных экранах',
    hint: 'Важно не копировать логику по DOM-обработчикам.',
  },
];

export interface ReactValueAnalysis {
  manualSteps: number;
  manualRisk: number;
  reactUnits: number;
  reactPredictability: number;
  before: string;
  after: string;
  imperativeSnippet: string;
  reactSnippet: string;
  mistakes: string[];
  practicalWins: string[];
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

// Лаборатория про React должна показывать не только JSX, но и нормальную декомпозицию:
// компонент хранит состояние, а предметная функция переводит сценарий в метрики и выводы.
export function analyzeReactValue(
  complexity: number,
  features: ReactFeatureId[],
): ReactValueAnalysis {
  const featureSet = new Set(features);
  const featureCount = features.length;

  const manualSteps =
    complexity * 5 +
    featureCount * 4 +
    (featureSet.has('shared-state') ? 6 : 0) +
    (featureSet.has('async-states') ? 7 : 0) +
    (featureSet.has('cross-screen-consistency') ? 5 : 0);

  const manualRisk = clamp(
    22 +
      complexity * 11 +
      featureCount * 9 +
      (featureSet.has('shared-state') ? 8 : 0) +
      (featureSet.has('async-states') ? 10 : 0),
    12,
    96,
  );

  const reactUnits =
    3 +
    Math.ceil(complexity / 2) +
    featureCount +
    (featureSet.has('repeated-blocks') ? 1 : 0);

  const reactPredictability = clamp(
    54 +
      complexity * 5 +
      featureCount * 6 +
      (featureSet.has('shared-state') ? 7 : 0) +
      (featureSet.has('team-reuse') ? 8 : 0),
    52,
    97,
  );

  const mistakes = [
    'Обновлять несколько DOM-узлов вручную и забывать один из них.',
    'Дублировать условия видимости в разных обработчиках и получать рассинхрон UI.',
    featureSet.has('async-states')
      ? 'Смешивать загрузку, ошибку и успешный результат в одном наборе флагов без единой модели состояния.'
      : 'Добавлять новые UI-состояния поверх уже разросшихся обработчиков.',
    featureSet.has('shared-state')
      ? 'Хранить одно и то же значение в нескольких переменных и синхронизировать их вручную.'
      : 'Передавать данные через случайные DOM-селекторы вместо явной модели данных.',
  ];

  const practicalWins = [
    'Компоненты превращают повторяющиеся участки в переиспользуемый API вместо копипаста разметки.',
    'Данные и состояние становятся источником истины, а UI вычисляется из них.',
    featureSet.has('team-reuse')
      ? 'Команда получает общую модель экранов, а не набор разрозненных DOM-скриптов.'
      : 'Даже один разработчик быстрее наращивает экран без хаотичных DOM-мутаций.',
    featureSet.has('cross-screen-consistency')
      ? 'Поведение можно держать единым через композицию и props, а не через копии логики.'
      : 'Изменение требований реже ломает уже работающие части экрана.',
  ];

  const imperativeSnippet = [
    "const panel = document.querySelector('[data-panel]');",
    "const total = document.querySelector('[data-total]');",
    "const filter = document.querySelector('[data-filter]');",
    '',
    'function renderDashboard(state) {',
    '  panel.innerHTML = "";',
    featureSet.has('async-states')
      ? '  if (state.loading) showSpinner();'
      : '  if (!state.items.length) showEmptyState();',
    featureSet.has('shared-state')
      ? '  syncHeaderCount(state.items.length);'
      : '  total.textContent = String(state.items.length);',
    '  state.items.forEach((item) => panel.appendChild(renderCard(item)));',
    '}',
    '',
    'filter.addEventListener("input", (event) => {',
    '  state.query = event.target.value;',
    '  renderDashboard(state);',
    '});',
  ].join('\n');

  const reactSnippet = [
    'function Dashboard({ items }: DashboardProps) {',
    '  const [query, setQuery] = useState("");',
    featureSet.has('async-states')
      ? '  const status = data.loading ? "loading" : data.error ? "error" : "ready";'
      : '  const visibleItems = items.filter((item) => matches(item, query));',
    '',
    '  return (',
    '    <ScreenLayout>',
    '      <FilterBar query={query} onQueryChange={setQuery} />',
    featureSet.has('shared-state')
      ? '      <Summary total={visibleItems.length} />'
      : '      <ResultCount count={visibleItems.length} />',
    featureSet.has('repeated-blocks')
      ? '      <CardGrid items={visibleItems} />'
      : '      <ResultsList items={visibleItems} />',
    '    </ScreenLayout>',
    '  );',
    '}',
  ].join('\n');

  return {
    manualSteps,
    manualRisk,
    reactUnits,
    reactPredictability,
    before:
      'До React рост требований обычно означает новые селекторы, новые ветки условий и всё больше ручных DOM-изменений.',
    after:
      'После перехода к компонентной модели UI описывается структурой данных, состояниями и композицией, а не пошаговыми мутациями.',
    imperativeSnippet,
    reactSnippet,
    mistakes,
    practicalWins,
  };
}

export type PipelineModeId = 'no-build' | 'vite-dev' | 'vite-build' | 'framework-first';

export interface PipelineModeOption {
  id: PipelineModeId;
  label: string;
  hint: string;
}

export const pipelineModes: PipelineModeOption[] = [
  {
    id: 'no-build',
    label: 'No-build / script tag',
    hint: 'Почти чистый браузерный runtime без современного build-слоя.',
  },
  {
    id: 'vite-dev',
    label: 'Vite dev server',
    hint: 'Dev server, transform, HMR и быстрый feedback loop.',
  },
  {
    id: 'vite-build',
    label: 'Vite production build',
    hint: 'Production pipeline: чанки, минификация и ассеты.',
  },
  {
    id: 'framework-first',
    label: 'Framework-first (React Router / Next.js)',
    hint: 'Маршруты, данные и серверные возможности как часть full-stack платформы.',
  },
];

export type PipelineFeatureId =
  | 'jsx'
  | 'bare-imports'
  | 'css-imports'
  | 'typescript'
  | 'client-env'
  | 'code-splitting'
  | 'server-rendering';

export interface PipelineFeatureOption {
  id: PipelineFeatureId;
  label: string;
  hint: string;
}

export const pipelineFeatureOptions: PipelineFeatureOption[] = [
  {
    id: 'jsx',
    label: 'JSX',
    hint: 'Пишем компоненты как JSX, а не как голые DOM-операции.',
  },
  {
    id: 'bare-imports',
    label: 'Bare imports',
    hint: 'Импортируем пакеты вроде `react` по имени.',
  },
  { id: 'css-imports', label: 'CSS imports', hint: 'Тянем стили и ассеты из модулей.' },
  {
    id: 'typescript',
    label: 'TypeScript',
    hint: 'Используем типы и TS-синтаксис в исходниках.',
  },
  {
    id: 'client-env',
    label: 'Клиентские env-переменные',
    hint: 'Конфигурация приходит в приложение во время build/dev.',
  },
  {
    id: 'code-splitting',
    label: 'Code splitting',
    hint: 'Части приложения загружаются не все сразу.',
  },
  {
    id: 'server-rendering',
    label: 'SSR / loaders / server actions',
    hint: 'Нужен серверный слой, а не только клиентский SPA.',
  },
];

export type PipelineIssueId = 'missing-import' | 'missing-package' | 'bad-env-prefix';

export interface PipelineIssueOption {
  id: PipelineIssueId;
  label: string;
  hint: string;
}

export const pipelineIssueOptions: PipelineIssueOption[] = [
  { id: 'missing-import', label: 'Битый import', hint: 'Файл или путь не существуют.' },
  {
    id: 'missing-package',
    label: 'Пакет не установлен',
    hint: 'В коде import есть, а dependency нет.',
  },
  {
    id: 'bad-env-prefix',
    label: 'Неверный env-префикс',
    hint: 'В Vite клиент видит только `VITE_*`.',
  },
];

export interface PipelineStage {
  id: string;
  label: string;
  status: StatusTone;
  note: string;
}

export interface PipelineAnalysis {
  overall: StatusTone;
  stages: PipelineStage[];
  before: string;
  after: string;
  mistakes: string[];
  importance: string[];
}

const modeCapabilities: Record<PipelineModeId, Record<PipelineFeatureId, boolean>> = {
  'no-build': {
    jsx: false,
    'bare-imports': false,
    'css-imports': false,
    typescript: false,
    'client-env': false,
    'code-splitting': false,
    'server-rendering': false,
  },
  'vite-dev': {
    jsx: true,
    'bare-imports': true,
    'css-imports': true,
    typescript: true,
    'client-env': true,
    'code-splitting': true,
    'server-rendering': false,
  },
  'vite-build': {
    jsx: true,
    'bare-imports': true,
    'css-imports': true,
    typescript: true,
    'client-env': true,
    'code-splitting': true,
    'server-rendering': false,
  },
  'framework-first': {
    jsx: true,
    'bare-imports': true,
    'css-imports': true,
    typescript: true,
    'client-env': true,
    'code-splitting': true,
    'server-rendering': true,
  },
};

// Эта функция моделирует pipeline как последовательность стадий.
// На входе только режим, фичи и ошибки; на выходе полностью готовая картина для UI и тестов.
export function analyzePipeline(
  mode: PipelineModeId,
  features: PipelineFeatureId[],
  issues: PipelineIssueId[],
): PipelineAnalysis {
  const featureSet = new Set(features);
  const issueSet = new Set(issues);
  const unsupported = features.filter((feature) => !modeCapabilities[mode][feature]);
  const stages: PipelineStage[] = [];

  stages.push({
    id: 'authoring',
    label: '1. Исходники',
    status: 'success',
    note:
      features.length > 0
        ? `В проекте есть: ${features.join(', ')}.`
        : 'Почти чистый HTML/JS без дополнительных удобств.',
  });

  if (unsupported.length > 0) {
    stages.push({
      id: 'transform',
      label: '2. Transform / compile',
      status: 'error',
      note: `Режим ${mode} не закрывает требования: ${unsupported.join(', ')}.`,
    });
  } else if (issueSet.has('missing-import')) {
    stages.push({
      id: 'transform',
      label: '2. Transform / compile',
      status: 'error',
      note: 'Граф модулей ломается на несуществующем файле или ошибочном пути импорта.',
    });
  } else {
    stages.push({
      id: 'transform',
      label: '2. Transform / compile',
      status: mode === 'no-build' ? 'warn' : 'success',
      note:
        mode === 'no-build'
          ? 'Дополнительного transform-слоя почти нет: браузер должен понимать код напрямую.'
          : 'Исходники проходят через Vite/framework pipeline и становятся пригодны для runtime.',
    });
  }

  if (featureSet.has('bare-imports') && issueSet.has('missing-package')) {
    stages.push({
      id: 'deps',
      label: '3. Зависимости',
      status: 'error',
      note: 'Импорт пакета есть, но пакет не установлен. npm-экосистема разошлась с кодом.',
    });
  } else if (featureSet.has('bare-imports') && mode === 'no-build') {
    stages.push({
      id: 'deps',
      label: '3. Зависимости',
      status: 'error',
      note: 'Браузер не умеет сам резолвить bare import из npm без дополнительного инструмента.',
    });
  } else {
    stages.push({
      id: 'deps',
      label: '3. Зависимости',
      status: featureSet.has('bare-imports') ? 'success' : 'warn',
      note: featureSet.has('bare-imports')
        ? 'Пакеты и локальные файлы связаны в единый граф модулей.'
        : 'Внешние зависимости почти не участвуют, проект ближе к чистому platform-first сценарию.',
    });
  }

  if (featureSet.has('server-rendering') && mode !== 'framework-first') {
    stages.push({
      id: 'server',
      label: '4. Server layer',
      status: 'error',
      note: 'SSR/loaders/actions требуют framework-first архитектуру, а не только client bundler.',
    });
  } else if (
    featureSet.has('client-env') &&
    issueSet.has('bad-env-prefix') &&
    mode !== 'no-build'
  ) {
    stages.push({
      id: 'server',
      label: '4. Server layer',
      status: 'warn',
      note: 'Pipeline запустится, но в клиентском коде переменная будет `undefined`, если она не `VITE_*`.',
    });
  } else {
    stages.push({
      id: 'server',
      label: '4. Server layer',
      status: featureSet.has('server-rendering') ? 'success' : 'warn',
      note: featureSet.has('server-rendering')
        ? 'Сервер и клиент делят ответственность: часть логики идёт до гидрации.'
        : 'Серверный слой минимален или отсутствует, всё держится на клиентском приложении.',
    });
  }

  const hasError = stages.some((stage) => stage.status === 'error');
  const hasWarn = stages.some((stage) => stage.status === 'warn');

  stages.push({
    id: 'result',
    label: '5. Итог в браузере',
    status: hasError ? 'error' : hasWarn ? 'warn' : 'success',
    note: hasError
      ? 'Вы не увидите корректный UI, пока pipeline не починен.'
      : hasWarn
        ? 'Экран может открыться, но с архитектурными ограничениями или скрытыми проблемами.'
        : 'UI доходит до браузера предсказуемо: и в деве, и в production-модели.',
  });

  const overall: StatusTone = hasError ? 'error' : hasWarn ? 'warn' : 'success';

  return {
    overall,
    stages,
    before:
      'До понимания pipeline кажется, что React-приложение это просто JSX-файлы, которые браузер "как-то" открывает.',
    after:
      'После разборки pipeline видно, какой именно инструмент отвечает за transform, пакетный граф, env-переменные и финальную доставку в браузер.',
    mistakes: [
      'Смешивать возможности браузера и возможности build tool.',
      'Диагностировать runtime-ошибку как "ошибку React", хотя причина в импортe или конфигурации сборки.',
      'Ожидать framework-level SSR и server data только от наличия клиентского React Router внутри SPA.',
    ],
    importance: [
      'Это напрямую помогает читать stack traces и понимать, где сломалось: в коде, в инструментах или в архитектурном выборе.',
      'Понимание pipeline экономит часы на ошибках `Cannot resolve module`, `Unexpected token <` и `undefined env`.',
    ],
  };
}

export type DeliveryRequirementId =
  | 'marketing-seo'
  | 'interactive-dashboard'
  | 'server-data'
  | 'server-actions'
  | 'fast-start'
  | 'minimal-tooling'
  | 'team-scale'
  | 'long-lived-product';

export interface DeliveryRequirementOption {
  id: DeliveryRequirementId;
  label: string;
  hint: string;
}

export const deliveryRequirementOptions: DeliveryRequirementOption[] = [
  {
    id: 'marketing-seo',
    label: 'SEO и первый контент до гидрации',
    hint: 'Нужны индексируемые страницы и быстрый старт первого экрана.',
  },
  {
    id: 'interactive-dashboard',
    label: 'Насыщенная клиентская SPA-логика',
    hint: 'Много интерактивности, таблиц, фильтров, форм и экранов.',
  },
  {
    id: 'server-data',
    label: 'Данные должны грузиться на маршруте/сервере',
    hint: 'Нужна не только клиентская загрузка через `useEffect`.',
  },
  {
    id: 'server-actions',
    label: 'Формы и мутации хотят серверный слой',
    hint: 'Нужна архитектура ближе к full-stack React.',
  },
  {
    id: 'fast-start',
    label: 'Нужно быстро стартовать и учиться',
    hint: 'Минимальный порог входа и понятный developer experience.',
  },
  {
    id: 'minimal-tooling',
    label: 'Хотим минимум абстракций',
    hint: 'Команде пока важнее простота, чем все возможности платформы.',
  },
  {
    id: 'team-scale',
    label: 'Проект будет расти в команде',
    hint: 'Нужны стабильные соглашения и хорошая архитектурная база.',
  },
  {
    id: 'long-lived-product',
    label: 'Продукт будет жить долго',
    hint: 'Важно выбрать подход, который не упрётся в архитектурный потолок.',
  },
];

export interface DeliveryModeResult {
  id: string;
  label: string;
  score: number;
  summary: string;
  strengths: string[];
  cautions: string[];
}

export interface DeliveryRecommendation {
  winner: DeliveryModeResult;
  modes: DeliveryModeResult[];
}

// Архитектурный выбор здесь выражен обычным JavaScript-правилом:
// требования продукта конвертируются в score, а не прячутся в условной верстке.
function scoreDeliveryMode(
  requirements: Set<DeliveryRequirementId>,
  mode: 'script-tag' | 'vite-spa' | 'framework-first',
): DeliveryModeResult {
  const scores: Record<typeof mode, number> = {
    'script-tag': 0,
    'vite-spa': 0,
    'framework-first': 0,
  };

  if (requirements.has('minimal-tooling')) {
    scores['script-tag'] += 4;
    scores['vite-spa'] += 1;
    scores['framework-first'] -= 2;
  }

  if (requirements.has('fast-start')) {
    scores['script-tag'] += 2;
    scores['vite-spa'] += 4;
    scores['framework-first'] += 1;
  }

  if (requirements.has('interactive-dashboard')) {
    scores['script-tag'] -= 2;
    scores['vite-spa'] += 5;
    scores['framework-first'] += 2;
  }

  if (requirements.has('marketing-seo')) {
    scores['script-tag'] += 1;
    scores['vite-spa'] -= 1;
    scores['framework-first'] += 5;
  }

  if (requirements.has('server-data')) {
    scores['script-tag'] -= 3;
    scores['vite-spa'] -= 1;
    scores['framework-first'] += 5;
  }

  if (requirements.has('server-actions')) {
    scores['script-tag'] -= 4;
    scores['vite-spa'] -= 2;
    scores['framework-first'] += 6;
  }

  if (requirements.has('team-scale')) {
    scores['script-tag'] -= 1;
    scores['vite-spa'] += 3;
    scores['framework-first'] += 4;
  }

  if (requirements.has('long-lived-product')) {
    scores['script-tag'] -= 2;
    scores['vite-spa'] += 2;
    scores['framework-first'] += 4;
  }

  const common: Record<typeof mode, DeliveryModeResult> = {
    'script-tag': {
      id: 'script-tag',
      label: 'Без сборщика / script-tag',
      score: scores['script-tag'],
      summary:
        'Подходит для маленьких платформенных экспериментов и микро-виджетов, но быстро упирается в пределы экосистемы.',
      strengths: [
        'Прозрачно видно, что реально понимает браузер.',
        'Минимум инструментария и быстрый старт для простых демо.',
      ],
      cautions: [
        'Плохо масштабируется на JSX, npm-граф и сложные UI-сценарии.',
        'Не закрывает современный pipeline разработки, который нужен большинству React-проектов.',
      ],
    },
    'vite-spa': {
      id: 'vite-spa',
      label: 'Vite + React SPA',
      score: scores['vite-spa'],
      summary:
        'Оптимальная стартовая точка для современного клиентского React-приложения и учебного курса.',
      strengths: [
        'Даёт JSX/TS, dev server, HMR, удобный build и простой mental model.',
        'Хорошо подходит для панелей, админок, кабинетов и интерактивных интерфейсов.',
      ],
      cautions: [
        'SSR, route-level data и server actions не появляются автоматически.',
        'С ростом full-stack требований может понадобиться framework-first слой.',
      ],
    },
    'framework-first': {
      id: 'framework-first',
      label: 'Framework-first (React Router / Next.js)',
      score: scores['framework-first'],
      summary:
        'Нужен там, где React уже часть большей платформы: SSR, серверные данные, роуты и мутации как системная архитектура.',
      strengths: [
        'Даёт цельный full-stack workflow и сильнее связывает маршруты, данные и сервер.',
        'Сюда относятся React Router framework mode и Next.js App Router как реальные современные стартовые точки.',
        'Лучше подходит для SEO, гибридного рендеринга и долгоживущих продуктовых систем.',
      ],
      cautions: [
        'Порог входа и архитектурная стоимость выше, чем у простой SPA на Vite.',
        'Для введения в React и чистый клиентский UI может быть избыточен.',
      ],
    },
  };

  return common[mode];
}

export function recommendDeliveryModes(
  requirementIds: DeliveryRequirementId[],
): DeliveryRecommendation {
  const requirementSet = new Set(requirementIds);
  const modes = [
    scoreDeliveryMode(requirementSet, 'script-tag'),
    scoreDeliveryMode(requirementSet, 'vite-spa'),
    scoreDeliveryMode(requirementSet, 'framework-first'),
  ].sort((a, b) => b.score - a.score);

  return {
    winner: modes[0],
    modes,
  };
}

export interface ToolingConfig {
  nodeVersion: 16 | 18 | 20 | 22;
  hasDevScript: boolean;
  hasBuildScript: boolean;
  hasTestScript: boolean;
  hasReactDep: boolean;
  hasViteDep: boolean;
  hasRouterDep: boolean;
  hasVitestDep: boolean;
  usesRouter: boolean;
  envPrefixOk: boolean;
  importCaseMatches: boolean;
  dockerSpaFallback: boolean;
}

export interface ToolingDiagnostic {
  status: StatusTone;
  title: string;
  message: string;
  fix: string;
}

// Tooling-сценарии вынесены в чистые функции, чтобы одна и та же логика
// работала и в React-странице, и в unit tests без дублирования.
export function collectToolingDiagnostics(config: ToolingConfig): ToolingDiagnostic[] {
  const diagnostics: ToolingDiagnostic[] = [];

  if (config.nodeVersion < 20) {
    diagnostics.push({
      status: 'error',
      title: 'Node слишком старый',
      message: `Текущий проект использует Vite ${stackVersions.vite}, поэтому Node 16/18 здесь считается устаревшим runtime.`,
      fix: 'Поднять версию Node как минимум до 20 и выровнять её между локальной машиной, CI и Docker.',
    });
  }

  if (!config.hasDevScript || !config.hasBuildScript) {
    diagnostics.push({
      status: 'warn',
      title: 'Scripts неполные',
      message: 'Проекту не хватает предсказуемых входных точек для `dev` и `build`.',
      fix: 'Описать команды в `package.json`, чтобы локальный запуск и CI были одинаковыми.',
    });
  }

  if (config.usesRouter && !config.hasRouterDep) {
    diagnostics.push({
      status: 'error',
      title: 'Роутер используется, но dependency нет',
      message: 'Код рассчитывает на роутинг, а пакет не установлен.',
      fix: 'Добавить роутер в dependencies и синхронизировать package-lock.',
    });
  }

  if (!config.envPrefixOk) {
    diagnostics.push({
      status: 'warn',
      title: 'Клиентские env оформлены неправильно',
      message: 'В Vite клиентский код не увидит env без префикса `VITE_`.',
      fix: 'Переименовать переменные и читать их через `import.meta.env`.',
    });
  }

  if (!config.importCaseMatches) {
    diagnostics.push({
      status: 'warn',
      title: 'Путь отличается регистром',
      message:
        'На Windows это может незаметно проходить, а в Docker/Linux сломать сборку.',
      fix: 'Сверить реальное имя файла и import по регистру символов.',
    });
  }

  if (config.usesRouter && !config.dockerSpaFallback) {
    diagnostics.push({
      status: 'warn',
      title: 'Нет SPA fallback в контейнере',
      message:
        'Переход на вложенный URL напрямую отдаст 404, хотя локально роутер работает.',
      fix: 'Настроить сервер контейнера так, чтобы он отдавал `index.html` для клиентских маршрутов.',
    });
  }

  return diagnostics;
}

export type ToolingCommandId = 'dev' | 'build' | 'test' | 'docker';

export interface ToolingCommandResult {
  status: StatusTone;
  title: string;
  lines: string[];
  fix: string;
}

export function runToolingCommand(
  config: ToolingConfig,
  command: ToolingCommandId,
): ToolingCommandResult {
  if (config.nodeVersion < 20) {
    return {
      status: 'error',
      title: 'Команда не стартует из-за версии Node.js',
      lines: [
        '> npm run ' + command,
        'error: current Node.js version is not supported by this toolchain',
      ],
      fix: `Использовать Node 20+ для проекта на Vite ${stackVersions.vite} и выровнять версию между локальной машиной, CI и Docker.`,
    };
  }

  if (command === 'dev') {
    if (!config.hasDevScript) {
      return {
        status: 'error',
        title: 'npm не знает, как запускать dev-режим',
        lines: ['> npm run dev', 'npm ERR! Missing script: "dev"'],
        fix: 'Добавить script `dev`, например `vite`.',
      };
    }

    if (!config.hasReactDep || !config.hasViteDep) {
      return {
        status: 'error',
        title: 'Старт dev-сервера упирается в зависимости',
        lines: ['> npm run dev', 'failed to resolve dependencies for React/Vite entry'],
        fix: 'Проверить `dependencies` и `devDependencies`, затем выполнить установку заново.',
      };
    }

    if (config.usesRouter && !config.hasRouterDep) {
      return {
        status: 'error',
        title: 'Роутер заявлен в коде, но не установлен',
        lines: [
          '> npm run dev',
          "Cannot find package 'react-router-dom' imported by route-aware module",
        ],
        fix: 'Установить пакет роутера и обновить lockfile.',
      };
    }

    return {
      status: !config.envPrefixOk ? 'warn' : 'success',
      title: !config.envPrefixOk
        ? 'Dev server запущен, но часть конфигурации течёт в runtime'
        : 'Dev server запущен корректно',
      lines: [
        '> npm run dev',
        `VITE v${stackVersions.vite} ready in 220 ms`,
        config.envPrefixOk
          ? 'browser: app loaded with HMR and env configuration'
          : 'browser: app loaded, but import.meta.env.VITE_* is missing for one of the values',
      ],
      fix: config.envPrefixOk
        ? 'Можно переходить к работе с UI и HMR.'
        : 'Переименовать переменные окружения под клиентский формат `VITE_*`.',
    };
  }

  if (command === 'build') {
    if (!config.hasBuildScript) {
      return {
        status: 'error',
        title: 'Production build не описан в scripts',
        lines: ['> npm run build', 'npm ERR! Missing script: "build"'],
        fix: 'Добавить сборочную команду в `package.json`.',
      };
    }

    if (!config.hasReactDep || !config.hasViteDep) {
      return {
        status: 'error',
        title: 'Сборка не может стартовать без ключевых зависимостей',
        lines: [
          '> npm run build',
          'error during build: failed to resolve entry dependencies',
        ],
        fix: 'Починить состав зависимостей и lockfile.',
      };
    }

    if (config.usesRouter && !config.hasRouterDep) {
      return {
        status: 'error',
        title: 'Код зависит от роутера, которого нет в проекте',
        lines: [
          '> npm run build',
          "error: failed to resolve import 'react-router-dom' from route-aware module",
        ],
        fix: 'Добавить `react-router-dom` в dependencies.',
      };
    }

    if (!config.importCaseMatches) {
      return {
        status: 'error',
        title: 'Build падает из-за регистра пути',
        lines: [
          '> npm run build',
          "error: Could not resolve './Components/AppShell' from src/App.tsx",
        ],
        fix: 'Выровнять регистр файла и импорта, особенно если деплой идёт в Linux/Docker.',
      };
    }

    return {
      status: !config.envPrefixOk ? 'warn' : 'success',
      title: !config.envPrefixOk
        ? 'Build проходит, но конфигурация в браузере будет неполной'
        : 'Production build собран',
      lines: [
        '> npm run build',
        'transforming modules...',
        'rendered chunks and assets',
        !config.envPrefixOk
          ? 'warning: one client env value resolved to undefined'
          : 'dist/index.html and hashed assets generated successfully',
      ],
      fix: !config.envPrefixOk
        ? 'Починить env до деплоя, иначе часть UI получит `undefined`.'
        : 'Можно публиковать `dist/` или переходить к контейнеризации.',
    };
  }

  if (command === 'test') {
    if (!config.hasTestScript) {
      return {
        status: 'error',
        title: 'Unit tests не подключены как часть workflow',
        lines: ['> npm test', 'npm ERR! Missing script: "test"'],
        fix: 'Добавить `test` script и зафиксировать его для CI.',
      };
    }

    if (!config.hasVitestDep) {
      return {
        status: 'error',
        title: 'Тестовая команда не знает, чем запускать тесты',
        lines: ['> npm test', "Cannot find package 'vitest'"],
        fix: 'Добавить Vitest и базовую тестовую конфигурацию.',
      };
    }

    return {
      status: 'success',
      title: 'Тестовый слой подключён',
      lines: [
        '> npm test',
        'vitest run',
        '✓ ecosystem diagnostics',
        '✓ tooling command simulation',
      ],
      fix: 'Следующий шаг: держать сценарии и регрессии в тестах, а не только вручную в браузере.',
    };
  }

  if (config.usesRouter && !config.dockerSpaFallback) {
    return {
      status: 'warn',
      title: 'Контейнер запускается, но прямые URL сломаются',
      lines: [
        '> docker run -p 8080:80 react-ecosystem-lab',
        'container: nginx started',
        'GET /pipeline -> 404 Not Found',
      ],
      fix: 'Добавить SPA fallback на `index.html` в конфигурацию сервера контейнера.',
    };
  }

  return {
    status: 'success',
    title: 'Контейнер готов для публикации',
    lines: [
      '> docker run -p 8080:80 react-ecosystem-lab',
      'container: nginx started',
      'GET / -> 200',
      config.usesRouter
        ? 'GET /pipeline -> 200 (served via index.html fallback)'
        : 'GET / -> 200',
    ],
    fix: 'Контейнерная доставка воспроизводима: локально, в CI и на сервере.',
  };
}

// Превращает переключатели лаборатории в почти реальный package.json preview,
// чтобы было видно, как состояние UI отражается в инженерных артефактах проекта.
export function buildPackagePreview(config: ToolingConfig): string {
  const dependencies = [
    config.hasReactDep ? `    "react": "${stackVersions.react}",` : null,
    config.hasReactDep ? `    "react-dom": "${stackVersions.reactDom}",` : null,
    config.hasRouterDep
      ? `    "react-router-dom": "${stackVersions.reactRouterDom}",`
      : null,
  ]
    .filter(Boolean)
    .join('\n');

  const devDependencies = [
    config.hasViteDep ? `    "vite": "${stackVersions.vite}",` : null,
    config.hasVitestDep ? `    "vitest": "${stackVersions.vitest}",` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const scripts = [
    config.hasDevScript ? '    "dev": "vite",' : null,
    config.hasBuildScript ? '    "build": "tsc --noEmit && vite build",' : null,
    config.hasTestScript ? '    "test": "vitest run",' : null,
  ]
    .filter(Boolean)
    .join('\n');

  return [
    '{',
    '  "scripts": {',
    scripts || '    // scripts are missing',
    '  },',
    '  "dependencies": {',
    dependencies || '    // runtime deps are missing',
    '  },',
    '  "devDependencies": {',
    devDependencies || '    // dev deps are missing',
    '  }',
    '}',
  ].join('\n');
}

// Показывает тот же принцип для server config: toggles в UI -> итоговая конфигурация доставки.
export function buildDockerPreview(config: ToolingConfig): string {
  return [
    'server {',
    '  listen 80;',
    '  root /usr/share/nginx/html;',
    config.usesRouter && config.dockerSpaFallback
      ? '  location / { try_files $uri /index.html; }'
      : '  location / { try_files $uri =404; }',
    '}',
  ].join('\n');
}
