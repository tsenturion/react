export type ProjectFileId =
  | 'package-json'
  | 'index-html'
  | 'main-tsx'
  | 'app-tsx'
  | 'pages'
  | 'learning-model'
  | 'vite-config'
  | 'eslint-config'
  | 'dockerfile';

export interface ProjectFileRole {
  id: ProjectFileId;
  path: string;
  title: string;
  zone: 'root' | 'src' | 'tooling' | 'delivery';
  purpose: string;
  startPhase: string;
  ifBreaks: string;
  relatedIds: ProjectFileId[];
  chain: string[];
  mistakes: string[];
  importance: string[];
}

const projectFileRoles: ProjectFileRole[] = [
  {
    id: 'package-json',
    path: 'package.json',
    title: 'Manifest проекта',
    zone: 'root',
    purpose:
      'Хранит scripts, зависимости и тип проекта. Это главный вход для npm и всей dev-среды.',
    startPhase: 'Участвует с первой же команды install/dev/build/test/lint.',
    ifBreaks:
      'Команды перестают запускаться, зависимости расходятся с кодом, а инструменты не знают, как вести проект.',
    relatedIds: ['vite-config', 'eslint-config', 'dockerfile'],
    chain: [
      'npm install',
      'package.json',
      'scripts / deps',
      'node_modules',
      'project commands',
    ],
    mistakes: [
      'Держать scripts только "в голове" и запускать всё вручную разными командами.',
      'Не обновлять package.json вместе с реальным устройством проекта.',
    ],
    importance: [
      'Manifest превращает проект из набора файлов в воспроизводимую систему команд и зависимостей.',
    ],
  },
  {
    id: 'index-html',
    path: 'index.html',
    title: 'HTML entry',
    zone: 'root',
    purpose:
      'Это не просто оболочка страницы: здесь лежит root-узел и `script type="module"` для Vite/браузера.',
    startPhase: 'Участвует в dev, preview и production-delivery.',
    ifBreaks:
      'Браузер может открыть страницу, но React не смонтируется или вообще не стартует entry-chain.',
    relatedIds: ['main-tsx', 'app-tsx'],
    chain: [
      'browser opens /',
      'index.html',
      'script type="module"',
      'src/main.tsx',
      'DOM root',
    ],
    mistakes: [
      'Считать index.html неважным только потому, что основная логика живёт в src.',
      'Менять id root-узла и забывать обновить main.tsx.',
    ],
    importance: [
      'Entry HTML показывает, как frontend-проект физически входит в браузерную страницу и начинает ES-модульную цепочку.',
    ],
  },
  {
    id: 'main-tsx',
    path: 'src/main.tsx',
    title: 'Точка входа React',
    zone: 'src',
    purpose:
      'Связывает ReactDOM, StrictMode, App и конкретный DOM-элемент из index.html как первый исполняемый React ES-модуль.',
    startPhase:
      'Это первый TypeScript/React-файл, который реально выполняется при старте приложения.',
    ifBreaks:
      'Получаете blank screen или ошибку `Target container is not a DOM element`.',
    relatedIds: ['index-html', 'app-tsx'],
    chain: ['index.html', 'src/main.tsx', 'createRoot(...)', '<App />'],
    mistakes: [
      'Воспринимать main.tsx как формальность и не понимать, зачем здесь createRoot.',
      'Скрывать в main.tsx побочную логику, которая должна жить в приложении или tooling.',
    ],
    importance: [
      'Этот файл наглядно показывает границу между HTML-платформой, ES-модулями и React-приложением.',
    ],
  },
  {
    id: 'app-tsx',
    path: 'src/App.tsx',
    title: 'Shell приложения',
    zone: 'src',
    purpose:
      'Собирает общую страницу темы: header, меню лабораторий, активную страницу и footer.',
    startPhase: 'Включается сразу после main.tsx, когда React уже получил root.',
    ifBreaks:
      'Приложение стартует, но структура экрана, меню лабораторий или общий каркас ломаются.',
    relatedIds: ['pages', 'learning-model'],
    chain: ['main.tsx', 'App.tsx', 'active lab state', 'selected page component'],
    mistakes: [
      'Сваливать сюда всю предметную логику вместо делегирования страницам и model-слою.',
      'Дублировать одну и ту же разметку в каждой лаборатории вместо общего shell.',
    ],
    importance: [
      'Показывает, как выглядит управляемая композиция React-проекта даже в учебном one-page формате.',
    ],
  },
  {
    id: 'pages',
    path: 'src/pages/*.tsx',
    title: 'Страницы лабораторий',
    zone: 'src',
    purpose:
      'Каждая лаборатория — отдельный экран темы со своим состоянием и интерактивной проверкой сценариев.',
    startPhase:
      'Подключаются через App.tsx только когда соответствующая лаборатория активна.',
    ifBreaks:
      'Ломается отдельный сценарий темы, даже если остальная оболочка приложения остаётся целой.',
    relatedIds: ['app-tsx', 'learning-model'],
    chain: [
      'App.tsx',
      'selected page',
      'local UI state',
      'rendered explanations and diagnostics',
    ],
    mistakes: [
      'Держать расчёты метрик и правил прямо в JSX, а потом терять читаемость и тестируемость.',
      'Не разделять shell и содержимое конкретной лаборатории.',
    ],
    importance: [
      'Именно здесь тема превращается из структуры проекта в живое поведение интерфейса.',
    ],
  },
  {
    id: 'learning-model',
    path: 'src/lib/learning-model.ts',
    title: 'Предметная модель темы',
    zone: 'src',
    purpose:
      'Собирает под одним экспортом сценарии, чистые функции анализа и вычисления, на которых строятся лаборатории.',
    startPhase: 'Используется страницами во время рендера, но сам не зависит от JSX.',
    ifBreaks:
      'Становятся неверными выводы лабораторий, расчёты режимов и диагностика типовых ошибок.',
    relatedIds: ['pages', 'package-json'],
    chain: ['page state', 'pure function', 'analysis object', 'visualized UI'],
    mistakes: [
      'Считать этот слой вторичным, хотя именно он делает UI предсказуемым и тестируемым.',
      'Смешивать чистые функции и browser-side effects в одном месте.',
    ],
    importance: [
      'Это тот слой, который особенно хорошо показывает устройство учебного проекта как инженерной системы.',
    ],
  },
  {
    id: 'vite-config',
    path: 'vite.config.ts',
    title: 'Build / dev config',
    zone: 'tooling',
    purpose:
      'Подключает React и Tailwind к Vite и описывает, как dev server и bundler трансформируют исходники.',
    startPhase: 'Участвует на старте dev server и production build.',
    ifBreaks:
      'Приложение может перестать собираться, теряет transform-слой или работает не так, как ожидает tooling.',
    relatedIds: ['package-json', 'main-tsx'],
    chain: ['npm run dev/build', 'vite.config.ts', 'plugins', 'transform pipeline'],
    mistakes: [
      'Воспринимать Vite как чёрный ящик и не понимать, что plugins — часть реального конфига проекта.',
    ],
    importance: [
      'Конфиг раскрывает, что современный React-проект не стартует только за счёт JSX-файлов: между исходниками и браузером работает tooling-слой.',
    ],
  },
  {
    id: 'eslint-config',
    path: 'eslint.config.js',
    title: 'Lint-конфиг',
    zone: 'tooling',
    purpose:
      'Определяет статические правила проекта: hooks, refresh-export discipline и базовую инженерную проверку.',
    startPhase: 'Участвует до браузера — на `npm run lint` и в IDE-интеграции.',
    ifBreaks:
      'Команда теряет ранний слой сигналов о проблемах кода и получает больше шума уже в runtime.',
    relatedIds: ['package-json', 'learning-model'],
    chain: ['editor / lint command', 'eslint.config.js', 'rules', 'static feedback'],
    mistakes: [
      'Считать lint косметикой, а не уровнем безопасности для hooks, imports и архитектурной дисциплины.',
    ],
    importance: [
      'Показывает, что устройство React-проекта включает не только сборку, но и quality-gates.',
    ],
  },
  {
    id: 'dockerfile',
    path: 'Dockerfile',
    title: 'Контейнерная поставка',
    zone: 'delivery',
    purpose:
      'Разделяет build-stage и runtime-stage, чтобы проект публиковался как production-артефакт, а не как dev-окружение.',
    startPhase: 'Участвует на этапе доставки, после build и до браузера пользователя.',
    ifBreaks:
      'Поставленный проект может раздаваться неверно, тянуть лишние зависимости или не стартовать в контейнере.',
    relatedIds: ['vite-config', 'package-json'],
    chain: [
      'docker build',
      'node image builds dist',
      'nginx serves dist',
      'browser receives production assets',
    ],
    mistakes: [
      'Пытаться запускать исходники в production-контейнере вместо готового build.',
    ],
    importance: [
      'Этот файл завершает картину: frontend-проект — это ещё и способ поставки результата в среду запуска.',
    ],
  },
];

export interface ProjectFileAnalysis {
  selected: ProjectFileRole;
  related: ProjectFileRole[];
}

export const projectFileOptions = projectFileRoles.map((item) => ({
  id: item.id,
  path: item.path,
  title: item.title,
  zone: item.zone,
}));

export function analyzeProjectFile(fileId: ProjectFileId): ProjectFileAnalysis {
  const selected =
    projectFileRoles.find((item) => item.id === fileId) ?? projectFileRoles[0];
  const related = selected.relatedIds
    .map((relatedId) => projectFileRoles.find((item) => item.id === relatedId))
    .filter((item): item is ProjectFileRole => Boolean(item));

  return { selected, related };
}
