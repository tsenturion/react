export interface StudyFile {
  path: string;
  note: string;
}

export interface StudySnippet {
  label: string;
  note: string;
  code: string;
}

export interface StudyMaterial {
  files: StudyFile[];
  snippets: StudySnippet[];
}

export const bootStudy: StudyMaterial = {
  files: [
    {
      path: 'src/pages/BootFlowPage.tsx',
      note: 'Экран цепочки запуска: выбор сценария, активные участники и терминальный след.',
    },
    {
      path: 'src/lib/boot-model.ts',
      note: 'Здесь собраны реальные стадии запуска: install, dev, build, preview и Docker.',
    },
    {
      path: 'index.html',
      note: 'Показывает HTML-вход в приложение, `script type="module"` и связь с entry script.',
    },
    {
      path: 'src/main.tsx',
      note: 'Связывает HTML root с ReactDOM и App.',
    },
  ],
  snippets: [
    {
      label: 'src/lib/boot-model.ts',
      note: 'Цепочка запуска описана как отдельная модель, а не как жёстко зашитая разметка страницы.',
      code: [
        'export const bootScenarios: BootScenario[] = [',
        '  {',
        "    id: 'dev',",
        "    command: 'npm run dev',",
        "    activeNodes: ['terminal', 'node', 'npm', 'package-json', 'vite', 'index-html', 'es-modules', 'main-tsx', 'root-dom', 'react-app'],",
        "    steps: [{ id: 'script', label: '1. npm запускает script `dev`', status: 'success', note: '...' }],",
        '  },',
        '];',
      ].join('\n'),
    },
    {
      label: 'src/pages/BootFlowPage.tsx',
      note: 'Страница хранит только выбранный сценарий, а содержимое подтягивает из предметной модели.',
      code: [
        'const [scenarioId, setScenarioId] = useState(bootScenarios[1].id);',
        '',
        'const scenario =',
        '  bootScenarios.find((item) => item.id === scenarioId) ?? bootScenarios[0];',
        '',
        '{scenario.steps.map((step) => (',
        '  <div key={step.id}>',
        '    <p>{step.label}</p>',
        '  </div>',
        '))}',
      ].join('\n'),
    },
    {
      label: 'src/main.tsx',
      note: 'Физическая точка входа React-проекта в браузере находится не в App.tsx, а именно здесь.',
      code: [
        "import ReactDOM from 'react-dom/client';",
        '',
        "import { App } from './App';",
        '',
        "ReactDOM.createRoot(document.getElementById('root')!).render(",
        '  <React.StrictMode>',
        '    <App />',
        '  </React.StrictMode>,',
        ');',
      ].join('\n'),
    },
  ],
};

export const workspaceStudy: StudyMaterial = {
  files: [
    {
      path: 'package.json',
      note: 'Реальные scripts, `type: module` и зависимости проекта темы 2.',
    },
    {
      path: 'index.html',
      note: 'Стартовая HTML-цепочка: root-узел и `type="module"` entry script.',
    },
    {
      path: 'src/pages/PackageScriptsPage.tsx',
      note: 'UI-конфигуратор manifest и вывод команд.',
    },
    {
      path: 'src/lib/workspace-model.ts',
      note: 'Чистая логика анализа scripts, manifest и entry-файлов.',
    },
    {
      path: 'eslint.config.js',
      note: 'Lint-слой подключён как реальный участник проекта, а не как абстракция.',
    },
    {
      path: 'prettier.config.mjs',
      note: 'Format-слой тоже живёт в проекте как настоящий конфиг.',
    },
  ],
  snippets: [
    {
      label: 'package.json',
      note: 'Scripts и модульный режим в этой теме выражены реальными настройками проекта.',
      code: [
        '"type": "module",',
        '',
        '"scripts": {',
        '  "dev": "vite",',
        '  "build": "tsc --noEmit && vite build",',
        '  "preview": "vite preview --host 0.0.0.0 --port 4173",',
        '  "lint": "eslint .",',
        '  "format:check": "prettier --check .",',
        '  "test": "vitest run"',
        '}',
      ].join('\n'),
    },
    {
      label: 'src/lib/workspace-model.ts',
      note: 'Поведение команд вычисляется как pure function, а не разбрасывается по JSX-условиям.',
      code: [
        'export function runWorkspaceCommand(config: WorkspaceConfig, command: WorkspaceCommandId): WorkspaceCommandResult {',
        "  if (command === 'dev' && !config.hasDevScript) {",
        "    return { status: 'error', title: 'npm не знает, как запускать dev server', ... };",
        '  }',
        '',
        "  if (command === 'lint' && !config.hasModuleType) {",
        "    return { status: 'error', title: 'Root-конфиг читается не в том модульном режиме', ... };",
        '  }',
        '',
        "  if (command === 'lint' && !config.hasEslintConfig) {",
        "    return { status: 'error', title: 'ESLint ... не как реальный слой проекта', ... };",
        '  }',
        '}',
      ].join('\n'),
    },
    {
      label: 'eslint.config.js',
      note: 'Lint-конфиг — не теория: проект реально использует hooks rules и react-refresh checks.',
      code: [
        "import js from '@eslint/js';",
        "import reactHooks from 'eslint-plugin-react-hooks';",
        "import reactRefresh from 'eslint-plugin-react-refresh';",
        '',
        'export default tseslint.config(',
        "  { ignores: ['dist', 'coverage', 'node_modules'] },",
        '  {',
        '    extends: [js.configs.recommended, ...tseslint.configs.recommended],',
        '    rules: {',
        '      ...reactHooks.configs.recommended.rules,',
        "      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],",
        '    },',
        '  },',
        ');',
      ].join('\n'),
    },
  ],
};

export const structureStudy: StudyMaterial = {
  files: [
    {
      path: 'index.html',
      note: 'Стартовый HTML-файл и browser-side точка входа для `src/main.tsx`.',
    },
    {
      path: 'src/App.tsx',
      note: 'Общий shell темы: header, меню лабораторий и активная страница.',
    },
    {
      path: 'src/main.tsx',
      note: 'Точка входа React в DOM.',
    },
    {
      path: 'src/lib/structure-model.ts',
      note: 'Файловая карта проекта и связи между его частями.',
    },
    {
      path: 'src/pages/StructurePage.tsx',
      note: 'Интерактивный разбор структуры по конкретным файлам.',
    },
  ],
  snippets: [
    {
      label: 'src/App.tsx',
      note: 'Даже shell темы показывает структуру проекта как композицию отдельных экранов.',
      code: [
        'const labs = [',
        "  { id: 'boot', label: '1. Старт проекта', component: BootFlowPage },",
        "  { id: 'manifest', label: '2. package.json и scripts', component: PackageScriptsPage },",
        '];',
        '',
        "const [activeLabId, setActiveLabId] = useState('boot');",
        'const activeLab = labs.find((item) => item.id === activeLabId) ?? labs[0];',
      ].join('\n'),
    },
    {
      label: 'src/lib/structure-model.ts',
      note: 'Структура проекта описана как карта ролей, а не как список в README без связи с кодом.',
      code: [
        'const projectFileRoles: ProjectFileRole[] = [',
        '  {',
        "    id: 'main-tsx',",
        "    path: 'src/main.tsx',",
        "    chain: ['index.html', 'script type=\"module\"', 'src/main.tsx', 'createRoot(...)', '<App />'],",
        '  },',
        '];',
      ].join('\n'),
    },
    {
      label: 'src/pages/StructurePage.tsx',
      note: 'Страница учит читать проект по одному выбранному файлу и его связям.',
      code: [
        "const [fileId, setFileId] = useState<ProjectFileId>('main-tsx');",
        '',
        'const analysis = analyzeProjectFile(fileId);',
        '',
        '{analysis.related.map((item) => (',
        '  <div key={item.id}>',
        '    <p>{item.title}</p>',
        '  </div>',
        '))}',
      ].join('\n'),
    },
  ],
};

export const modesStudy: StudyMaterial = {
  files: [
    {
      path: 'src/pages/ModesPage.tsx',
      note: 'Экран сравнения dev, build, preview и Docker-поставки.',
    },
    {
      path: 'src/lib/run-mode-model.ts',
      note: 'Capabilities режимов и анализ ожиданий.',
    },
    {
      path: 'vite.config.ts',
      note: 'Реальный build/dev конфиг текущего проекта.',
    },
    {
      path: 'Dockerfile',
      note: 'Production-поставка через multi-stage container build.',
    },
  ],
  snippets: [
    {
      label: 'src/lib/run-mode-model.ts',
      note: 'Сравнение режимов построено на capabilities-модели: что режим умеет, а чего не умеет.',
      code: [
        'const runModeCapabilities = {',
        "  'vite-dev': { 'instant-feedback': true, hmr: true, 'production-assets': false },",
        "  'vite-preview': { 'instant-feedback': false, hmr: false, 'production-assets': true },",
        '};',
        '',
        'const unsupported = expectations.filter(',
        '  (expectation) => !runModeCapabilities[mode][expectation],',
        ');',
      ].join('\n'),
    },
    {
      label: 'vite.config.ts',
      note: 'Тема про режимы опирается на реальный Vite-конфиг проекта, а не на абстрактный псевдокод.',
      code: [
        "import tailwindcss from '@tailwindcss/vite';",
        "import react from '@vitejs/plugin-react';",
        "import { defineConfig } from 'vite';",
        '',
        'export default defineConfig({',
        '  plugins: [react(), tailwindcss()],',
        '});',
      ].join('\n'),
    },
    {
      label: 'Dockerfile',
      note: 'Production-режим в теме выражен настоящей поставкой, а не отдельным текстовым описанием.',
      code: [
        'FROM node:22-alpine AS build',
        'WORKDIR /app',
        'COPY package*.json ./',
        'RUN npm ci',
        'COPY . .',
        'RUN npm run build',
        '',
        'FROM nginx:1.27-alpine',
        'COPY --from=build /app/dist /usr/share/nginx/html',
      ].join('\n'),
    },
  ],
};

export const diagnosticsStudy: StudyMaterial = {
  files: [
    {
      path: 'src/pages/DiagnosticsPage.tsx',
      note: 'UI для выбора поломки и чтения терминального вывода.',
    },
    {
      path: 'src/lib/diagnostics-model.ts',
      note: 'Каталог типовых ошибок текущей темы.',
    },
    {
      path: 'package.json',
      note: 'Источник scripts и зависимостей, на которые завязаны многие ошибки запуска.',
    },
    {
      path: 'nginx.conf',
      note: 'Связан с deployment-сценарием и SPA fallback.',
    },
  ],
  snippets: [
    {
      label: 'src/lib/diagnostics-model.ts',
      note: 'Ошибки описаны как самостоятельные диагностические сценарии с командой, слоями и файлами.',
      code: [
        'export const diagnosticScenarios: DiagnosticScenario[] = [',
        '  {',
        "    id: 'wrong-module-mode',",
        "    command: 'npm run lint',",
        "    files: ['package.json', 'eslint.config.js'],",
        "    symptom: 'Node пытается прочитать ESM-конфиг как CommonJS.',",
        '  },',
        '];',
      ].join('\n'),
    },
    {
      label: 'src/pages/DiagnosticsPage.tsx',
      note: 'Страница не вычисляет ошибки сама: она выбирает готовый сценарий и визуализирует его.',
      code: [
        'const [scenarioId, setScenarioId] = useState(diagnosticScenarios[0].id);',
        '',
        'const scenario =',
        '  diagnosticScenarios.find((item) => item.id === scenarioId) ?? diagnosticScenarios[0];',
        '',
        '<CodeBlock label="terminal output" code={scenario.terminalLines.join("\\n")} />',
      ].join('\n'),
    },
  ],
};

export const qualityStudy: StudyMaterial = {
  files: [
    {
      path: 'src/pages/QualityPage.tsx',
      note: 'Экран сравнения quality-gates по типу проблемы.',
    },
    {
      path: 'src/lib/quality-model.ts',
      note: 'Модель того, какой инструмент на каком слое ловит проблему.',
    },
    {
      path: 'eslint.config.js',
      note: 'Реальный статический quality-layer проекта.',
    },
    {
      path: 'prettier.config.mjs',
      note: 'Реальный форматирующий quality-layer проекта.',
    },
    {
      path: 'vitest.config.ts',
      note: 'Тестовый слой проекта.',
    },
  ],
  snippets: [
    {
      label: 'src/lib/quality-model.ts',
      note: 'Каждой проблеме сопоставляется свой слой раннего обнаружения.',
      code: [
        "const catchesType = issue === 'type-mismatch' && toolSet.has('typescript');",
        "const catchesLint = issue === 'unused-import' && toolSet.has('eslint');",
        "const catchesFormat = issue === 'format-drift' && toolSet.has('prettier');",
        "const catchesTest = issue === 'logic-regression' && toolSet.has('vitest');",
        "const catchesStrict = issue === 'impure-render' && toolSet.has('strict-mode');",
      ].join('\n'),
    },
    {
      label: 'prettier.config.mjs',
      note: 'Format-слой темы выражен не текстом, а настоящим конфигом проекта.',
      code: [
        'export default {',
        '  semi: true,',
        '  singleQuote: true,',
        "  trailingComma: 'all',",
        '  printWidth: 90,',
        '};',
      ].join('\n'),
    },
    {
      label: 'vitest.config.ts',
      note: 'Тесты — это реальный слой темы: модель можно проверять без браузера.',
      code: [
        "import { defineConfig } from 'vitest/config';",
        '',
        'export default defineConfig({',
        '  test: {',
        "    environment: 'jsdom',",
        '    css: true,',
        '    globals: true,',
        '  },',
        '});',
      ].join('\n'),
    },
  ],
};
