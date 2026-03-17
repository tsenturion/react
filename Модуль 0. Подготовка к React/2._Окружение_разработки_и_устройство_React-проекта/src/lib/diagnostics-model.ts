import type { StatusTone } from './common';

export interface DiagnosticScenario {
  id: string;
  title: string;
  tone: StatusTone;
  stage: string;
  command: string;
  files: string[];
  symptom: string;
  terminalLines: string[];
  fix: string;
  whyItMatters: string[];
}

export const diagnosticScenarios: DiagnosticScenario[] = [
  {
    id: 'missing-dev-script',
    title: 'Нет script `dev`',
    tone: 'error',
    stage: 'npm / package.json',
    command: 'npm run dev',
    files: ['package.json'],
    symptom: 'Проект не стартует вообще: npm не знает, какую команду запускать.',
    terminalLines: ['> npm run dev', 'npm ERR! Missing script: "dev"'],
    fix: 'Добавьте script `dev`, который реально поднимает Vite dev server.',
    whyItMatters: [
      'Scripts — это контракт проекта, а не удобная мелочь.',
      'Без scripts у команды и CI быстро расходятся реальные способы запуска.',
    ],
  },
  {
    id: 'missing-package',
    title: 'Пакет упомянут в коде, но не установлен',
    tone: 'error',
    stage: 'dependency graph',
    command: 'npm run dev',
    files: ['package.json', 'src/main.tsx'],
    symptom: 'Vite не может построить модульный граф, потому что import ведёт в пустоту.',
    terminalLines: [
      '> npm run dev',
      "Failed to resolve import 'react' from src/main.tsx",
    ],
    fix: 'Синхронизируйте manifest и imports: код и dependencies должны описывать один и тот же проект.',
    whyItMatters: [
      'Эта ошибка отлично показывает, что npm и imports — не два независимых мира.',
    ],
  },
  {
    id: 'wrong-root-id',
    title: 'id root-элемента не совпадает',
    tone: 'error',
    stage: 'HTML entry / main.tsx',
    command: 'npm run dev',
    files: ['index.html', 'src/main.tsx'],
    symptom: 'Страница открывается, но React не может смонтироваться в DOM.',
    terminalLines: [
      '> npm run dev',
      'Uncaught Error: Target container is not a DOM element.',
    ],
    fix: 'Сделайте одинаковыми id в index.html и вызов document.getElementById(...) в main.tsx.',
    whyItMatters: [
      'Это одно из лучших упражнений на понимание real entry point приложения.',
    ],
  },
  {
    id: 'case-mismatch',
    title: 'Импорт отличается регистром',
    tone: 'warn',
    stage: 'build / linux runtime',
    command: 'npm run build',
    files: ['src/App.tsx', 'src/pages/*.tsx'],
    symptom: 'На Windows локально может работать, а в Linux/Docker сборка падает.',
    terminalLines: [
      '> npm run build',
      "error: Could not resolve './Pages/BootFlowPage' from src/App.tsx",
    ],
    fix: 'Всегда сверяйте регистр файлов и импортов, особенно если публикация идёт в Linux.',
    whyItMatters: ['Это типичная разница между локальной машиной и production-средой.'],
  },
  {
    id: 'bad-env-prefix',
    title: 'Клиентская env-переменная без `VITE_`',
    tone: 'warn',
    stage: 'dev/build config',
    command: 'npm run build',
    files: ['src/lib/workspace-model.ts', 'vite.config.ts'],
    symptom:
      'Приложение может собраться, но часть клиентской конфигурации в браузере станет undefined.',
    terminalLines: [
      '> npm run build',
      'warning: import.meta.env.MY_FLAG is undefined in client bundle',
    ],
    fix: 'Для клиентского кода используйте только env с префиксом `VITE_`.',
    whyItMatters: [
      'Ошибка показывает границу между env в Node/Vite и тем, что реально попадает в браузер.',
    ],
  },
  {
    id: 'broken-entry',
    title: 'Entry script в index.html пропал',
    tone: 'error',
    stage: 'HTML entry',
    command: 'npm run dev',
    files: ['index.html'],
    symptom: 'HTML открывается, но приложение не стартует: browser не получает main.tsx.',
    terminalLines: [
      '> npm run dev',
      'browser: loaded html shell, but no module entry was requested',
    ],
    fix: 'Верните `<script type="module" src="/src/main.tsx"></script>` в index.html.',
    whyItMatters: [
      'Даже в современном React-проекте HTML entry остаётся реальным участником запуска.',
    ],
  },
  {
    id: 'wrong-module-mode',
    title: 'Root-конфиг читается не как ES-модуль',
    tone: 'error',
    stage: 'package.json / root configs',
    command: 'npm run lint',
    files: ['package.json', 'eslint.config.js'],
    symptom:
      'Команда запускается, но Node пытается прочитать ESM-конфиг как CommonJS и падает до браузера.',
    terminalLines: [
      '> npm run lint',
      'SyntaxError: Cannot use import statement outside a module in eslint.config.js',
    ],
    fix: 'Согласуйте модульный режим проекта: для текущего стека нужен `type: module` в package.json.',
    whyItMatters: [
      'Это показывает, что ES-модули в современном проекте важны не только в браузере, но и в root-конфигах tooling.',
      'Ошибка хорошо отделяет проблемы модульного режима от ошибок React-компонентов и runtime UI.',
    ],
  },
  {
    id: 'no-preview-build',
    title: 'Preview проверяет устаревший dist',
    tone: 'warn',
    stage: 'preview / dist lifecycle',
    command: 'npm run preview',
    files: ['package.json', 'dist/*'],
    symptom: 'Открывается production-версия, но она не соответствует текущему src-коду.',
    terminalLines: [
      '> npm run preview',
      'serving dist/',
      'warning: preview is using previously built assets',
    ],
    fix: 'Пересоберите проект перед preview, если меняли исходники.',
    whyItMatters: [
      'Именно здесь становится ясна разница между src и dist как двумя разными состояниями проекта.',
    ],
  },
  {
    id: 'docker-fallback',
    title: 'В контейнере нет SPA fallback',
    tone: 'warn',
    stage: 'delivery / nginx',
    command: 'docker compose up --build',
    files: ['Dockerfile', 'nginx.conf'],
    symptom: 'Главная страница работает, но прямой переход на вложенный URL отдаёт 404.',
    terminalLines: [
      '> docker compose up --build',
      'nginx: GET /quality -> 404 Not Found',
    ],
    fix: 'Настройте fallback на index.html для клиентских маршрутов.',
    whyItMatters: [
      'Deployment тоже часть устройства frontend-проекта, а не внешний постскриптум.',
    ],
  },
];
