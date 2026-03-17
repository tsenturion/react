import type { StatusTone } from './common';
import { stackVersions } from './stack-meta';

export type BootNodeId =
  | 'terminal'
  | 'node'
  | 'npm'
  | 'package-json'
  | 'vite'
  | 'index-html'
  | 'es-modules'
  | 'main-tsx'
  | 'root-dom'
  | 'react-app'
  | 'docker';

export interface BootNode {
  id: BootNodeId;
  title: string;
  zone: 'cli' | 'tooling' | 'browser' | 'project';
  short: string;
}

export interface BootStep {
  id: string;
  label: string;
  status: StatusTone;
  note: string;
}

export interface BootScenario {
  id: string;
  title: string;
  command: string;
  prompt: string;
  activeNodes: BootNodeId[];
  steps: BootStep[];
  terminalLines: string[];
  before: string;
  after: string;
  mistakes: string[];
  importance: string[];
}

export const bootNodes: BootNode[] = [
  {
    id: 'terminal',
    title: 'Терминал',
    zone: 'cli',
    short: 'Именно отсюда стартуют install, dev, build, lint и test.',
  },
  {
    id: 'node',
    title: 'Node.js',
    zone: 'tooling',
    short: 'Исполняет CLI-инструменты и dev/build-окружение вне браузера.',
  },
  {
    id: 'npm',
    title: 'npm',
    zone: 'tooling',
    short: 'Читает package.json, ставит зависимости и запускает scripts.',
  },
  {
    id: 'package-json',
    title: 'package.json',
    zone: 'project',
    short: 'Описывает scripts, зависимости и тип проекта.',
  },
  {
    id: 'vite',
    title: 'Vite',
    zone: 'tooling',
    short: 'Запускает dev server, transform и production build.',
  },
  {
    id: 'index-html',
    title: 'index.html',
    zone: 'project',
    short: 'HTML-вход в приложение, где задаётся root и entry script.',
  },
  {
    id: 'es-modules',
    title: 'ES-модули',
    zone: 'browser',
    short: 'Связывают entry script, imports и модульный граф между браузером и Vite.',
  },
  {
    id: 'main-tsx',
    title: 'src/main.tsx',
    zone: 'project',
    short: 'Подключает React к DOM и монтирует App в root-элемент.',
  },
  {
    id: 'root-dom',
    title: 'DOM root',
    zone: 'browser',
    short: 'Конкретный HTML-узел, в который React монтирует приложение.',
  },
  {
    id: 'react-app',
    title: 'App / страницы',
    zone: 'project',
    short: 'Компоненты и предметная логика, которые в итоге видны на экране.',
  },
  {
    id: 'docker',
    title: 'Docker',
    zone: 'tooling',
    short: 'Упаковывает build и сервер раздачи в воспроизводимую поставку.',
  },
];

export const bootScenarios: BootScenario[] = [
  {
    id: 'install',
    title: 'Установить зависимости',
    command: 'npm install',
    prompt:
      'Здесь ещё нет React-экрана в браузере. Вы сначала поднимаете саму среду проекта: пакеты, lockfile и исполняемые CLI-инструменты.',
    activeNodes: ['terminal', 'node', 'npm', 'package-json'],
    steps: [
      {
        id: 'read-manifest',
        label: '1. npm читает package.json',
        status: 'success',
        note: 'Определяются runtime и dev dependencies, scripts и формат проекта.',
      },
      {
        id: 'resolve-tree',
        label: '2. Строится дерево зависимостей',
        status: 'success',
        note: 'npm вычисляет, какие пакеты и версии нужны проекту.',
      },
      {
        id: 'materialize',
        label: '3. Формируется node_modules',
        status: 'success',
        note: 'После этого команды vite, vitest, eslint и prettier вообще становятся доступными.',
      },
    ],
    terminalLines: [
      '> npm install',
      'added packages for react, vite, tailwind, vitest, eslint and prettier',
      'package-lock.json updated',
    ],
    before:
      'До install легко думать, что проект уже "есть" просто потому, что в репозитории лежит src-код.',
    after:
      'После install становится видно, что без node_modules и lockfile исходники ещё не превращаются в рабочую среду.',
    mistakes: [
      'Ожидать запуск `npm run dev`, когда зависимости ещё не установлены.',
      'Игнорировать lockfile и потом удивляться, почему у команды разные версии пакетов.',
    ],
    importance: [
      'Эта стадия отвечает за воспроизводимость: одинаковое дерево зависимостей локально, в CI и в контейнере.',
      'Без неё все дальнейшие разговоры про React, Vite и тесты просто не стартуют.',
    ],
  },
  {
    id: 'dev',
    title: 'Поднять dev server',
    command: 'npm run dev',
    prompt:
      'Вы запускаете локальную среду разработки: Vite поднимает сервер, обрабатывает entry и начинает отдавать модули браузеру.',
    activeNodes: [
      'terminal',
      'node',
      'npm',
      'package-json',
      'vite',
      'index-html',
      'es-modules',
      'main-tsx',
      'root-dom',
      'react-app',
    ],
    steps: [
      {
        id: 'script',
        label: '1. npm запускает script `dev`',
        status: 'success',
        note: 'Команда берётся прямо из package.json, а не из воздуха.',
      },
      {
        id: 'server',
        label: '2. Vite поднимает dev server',
        status: 'success',
        note: 'Исходники не копируются в dist: они отдаются через dev pipeline.',
      },
      {
        id: 'entry',
        label: '3. Браузер читает index.html -> type="module" -> src/main.tsx',
        status: 'success',
        note: 'Именно ES-модульный entry связывает HTML, модульный граф и React-приложение.',
      },
      {
        id: 'render',
        label: '4. React монтирует App в root',
        status: 'success',
        note: 'После createRoot появляется первый экран, а HMR поддерживает быстрый цикл правок.',
      },
    ],
    terminalLines: [
      '> npm run dev',
      `VITE v${stackVersions.vite} ready in 220 ms`,
      'Local: http://localhost:5173/',
      'HMR connected',
    ],
    before:
      'До разбора startup flow кажется, что браузер сам открывает `src/App.tsx` как обычный файл.',
    after:
      'После разборки становится видно: HTML запускает entry, entry монтирует root, а dev server подготавливает исходники для браузера.',
    mistakes: [
      'Путать Vite dev server с production build.',
      'Считать, что `index.html` и `src/main.tsx` второстепенны, хотя именно они образуют вход в приложение.',
    ],
    importance: [
      'Эта цепочка нужна для чтения ошибок старта: wrong root id, missing script, missing dependency, bad import.',
      'Без понимания entry point трудно отлаживать blank screen и стартовые runtime-сбои.',
    ],
  },
  {
    id: 'build',
    title: 'Собрать production-версию',
    command: 'npm run build',
    prompt:
      'Здесь цель уже не быстрый feedback loop, а подготовка оптимизированных ассетов для production.',
    activeNodes: [
      'terminal',
      'node',
      'npm',
      'package-json',
      'vite',
      'es-modules',
      'main-tsx',
      'react-app',
    ],
    steps: [
      {
        id: 'typecheck',
        label: '1. TypeScript проверяет проект',
        status: 'success',
        note: 'В текущем проекте build начинается с `tsc --noEmit`, поэтому типовая ошибка ломает сборку до появления dist.',
      },
      {
        id: 'bundle',
        label: '2. Vite как bundler собирает модульный граф',
        status: 'success',
        note: 'Здесь обрабатываются ES imports, CSS, JSX и production chunks.',
      },
      {
        id: 'emit',
        label: '3. В dist появляются готовые ассеты',
        status: 'success',
        note: 'Браузер уже не работает с `src/*.tsx`, а получает html, css и js из build-выхода.',
      },
    ],
    terminalLines: [
      '> npm run build',
      'tsc --noEmit',
      `vite v${stackVersions.vite} building for production...`,
      'dist/index.html and hashed assets generated successfully',
    ],
    before: 'До сравнения режимов легко принять dev server за уже готовый production.',
    after:
      'После build видно, что production-режим живёт через dist-ассеты, а не через живой исходный код.',
    mistakes: [
      'Проверять только `npm run dev` и считать, что сборка тоже пройдёт.',
      'Не различать исходники `src` и артефакты `dist`.',
    ],
    importance: [
      'Разница между dev и build объясняет, почему некоторые ошибки всплывают только перед деплоем.',
      'Хэшированные ассеты, минимизация и типовая проверка не относятся к обычному браузерному runtime.',
    ],
  },
  {
    id: 'preview',
    title: 'Проверить готовый build локально',
    command: 'npm run preview',
    prompt:
      'Вы уже не работаете с dev server. Цель — открыть собранный dist почти так же, как он будет жить после публикации.',
    activeNodes: [
      'terminal',
      'node',
      'npm',
      'package-json',
      'vite',
      'index-html',
      'es-modules',
      'root-dom',
      'react-app',
    ],
    steps: [
      {
        id: 'serve-dist',
        label: '1. Vite preview раздаёт dist',
        status: 'success',
        note: 'Это ближе к production-поверхности, чем `npm run dev`.',
      },
      {
        id: 'open-build',
        label: '2. Браузер загружает уже собранные ассеты',
        status: 'success',
        note: 'Если build устарел или сломан, preview покажет именно проблему готовых production-модулей и ассетов.',
      },
    ],
    terminalLines: [
      '> npm run preview',
      'serving dist/ on http://localhost:4173/',
      'browser: loaded production build without HMR',
    ],
    before: 'Легко пропустить эту стадию и тестировать только dev server.',
    after:
      'Preview помогает отделить проблемы исходников от проблем готового production-билда.',
    mistakes: [
      'Открывать `index.html` из dist вручную и ожидать корректное поведение во всех случаях.',
      'Не проверять production-сборку перед Docker или публикацией.',
    ],
    importance: [
      'Это самый быстрый способ поймать сбои между build и реальной раздачей ассетов.',
      'Preview особенно полезен для проверки env, базовых путей и итоговой загрузки чанков.',
    ],
  },
  {
    id: 'docker',
    title: 'Упаковать приложение как поставку',
    command: 'docker compose up --build',
    prompt:
      'Здесь React-проект рассматривается уже не как набор исходников, а как инженерная поставка с повторяемой средой запуска.',
    activeNodes: ['terminal', 'docker', 'node', 'vite', 'index-html', 'react-app'],
    steps: [
      {
        id: 'container-build',
        label: '1. Node-образ собирает dist',
        status: 'success',
        note: 'Build выполняется внутри контейнера, а не на вашей локальной машине.',
      },
      {
        id: 'runtime-image',
        label: '2. Nginx-образ раздаёт готовый build',
        status: 'success',
        note: 'В runtime-контейнер больше не нужны исходники и dev dependencies.',
      },
      {
        id: 'delivery',
        label: '3. Браузер получает production-поставку',
        status: 'success',
        note: 'Такой сценарий особенно важен для CI/CD и воспроизводимого деплоя.',
      },
    ],
    terminalLines: [
      '> docker compose up --build',
      'step build: npm ci && npm run build',
      'step runtime: nginx started on :80',
      'http://localhost:8080 -> production bundle',
    ],
    before:
      'До контейнеризации проект часто воспринимается только как локальный dev-сервер.',
    after:
      'После этой стадии видно, где заканчивается разработка и начинается воспроизводимая поставка интерфейса.',
    mistakes: [
      'Путать Docker с самим React или Vite: контейнер решает поставку, а не рендеринг.',
      'Забывать, что production-контейнер должен раздавать build, а не исходники.',
    ],
    importance: [
      'Контейнеризация связывает build, server config и delivery в одну инженерную систему.',
      'Именно здесь особенно хорошо видны проблемы с fallback, регистром путей и несинхронными версиями среды.',
    ],
  },
];
