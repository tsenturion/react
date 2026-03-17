import type { StatusTone } from './common';
import { stackVersions } from './stack-meta';

export interface WorkspaceConfig {
  nodeVersion: 16 | 18 | 20 | 24;
  hasLockfile: boolean;
  hasDevScript: boolean;
  hasBuildScript: boolean;
  hasPreviewScript: boolean;
  hasTestScript: boolean;
  hasLintScript: boolean;
  hasFormatScript: boolean;
  hasModuleType: boolean;
  hasReactDeps: boolean;
  hasViteDep: boolean;
  hasTypeScript: boolean;
  hasEntryHtml: boolean;
  rootIdMatches: boolean;
  hasEslintConfig: boolean;
  hasPrettierConfig: boolean;
}

export interface WorkspaceDiagnostic {
  status: StatusTone;
  title: string;
  message: string;
  fix: string;
}

export type WorkspaceCommandId =
  | 'install'
  | 'dev'
  | 'build'
  | 'preview'
  | 'lint'
  | 'format-check'
  | 'test';

export interface WorkspaceCommandResult {
  status: StatusTone;
  title: string;
  lines: string[];
  fix: string;
}

export function collectWorkspaceDiagnostics(
  config: WorkspaceConfig,
): WorkspaceDiagnostic[] {
  const diagnostics: WorkspaceDiagnostic[] = [];

  if (config.nodeVersion < 20) {
    diagnostics.push({
      status: 'error',
      title: 'Node.js слишком старый',
      message: `Текущий проект использует Vite ${stackVersions.vite}, поэтому Node 16/18 здесь уже считается устаревшим runtime.`,
      fix: 'Поднимите Node как минимум до 20 и держите версию одинаковой локально, в CI и в Docker.',
    });
  }

  if (!config.hasLockfile) {
    diagnostics.push({
      status: 'warn',
      title: 'Нет lockfile',
      message:
        'Установка пройдёт, но воспроизводимость окружения ухудшится: на другой машине дерево пакетов может отличаться.',
      fix: 'Зафиксируйте package-lock.json и обновляйте его вместе с manifest.',
    });
  }

  if (!config.hasDevScript || !config.hasBuildScript || !config.hasPreviewScript) {
    diagnostics.push({
      status: 'warn',
      title: 'Scripts покрывают не весь жизненный цикл',
      message:
        'Проекту нужны явные точки входа для dev, build и preview, иначе запуск и проверка будут разъезжаться.',
      fix: 'Опишите команды в package.json и запускайте их как единый workflow.',
    });
  }

  if (!config.hasModuleType) {
    diagnostics.push({
      status: 'warn',
      title: 'ES-модульный режим проекта не зафиксирован',
      message:
        'В этом проекте root-конфиги и tooling рассчитывают на `type: module`, поэтому отсутствие этого поля размывает правила чтения конфигов и imports.',
      fix: 'Зафиксируйте `"type": "module"` в package.json, если проект использует ESM-конфиги и современный Vite workflow.',
    });
  }

  if (!config.hasReactDeps || !config.hasViteDep) {
    diagnostics.push({
      status: 'error',
      title: 'Ключевые зависимости не совпадают с кодом',
      message:
        'src-код уже рассчитан на React + Vite, но manifest не полностью описывает эти пакеты.',
      fix: 'Синхронизируйте dependencies/devDependencies с реальным кодом проекта.',
    });
  }

  if (!config.hasEntryHtml || !config.rootIdMatches) {
    diagnostics.push({
      status: 'error',
      title: 'Стартовая HTML-цепочка сломана',
      message:
        'Если index.html отсутствует или root id не совпадает с main.tsx, первый экран не смонтируется.',
      fix: 'Сверьте index.html и src/main.tsx: entry script и root element должны быть согласованы.',
    });
  }

  if (!config.hasLintScript || !config.hasEslintConfig) {
    diagnostics.push({
      status: 'warn',
      title: 'Lint-слой неполный',
      message:
        'Вы теряете раннюю диагностику ошибок уровня imports, hooks и инженерной дисциплины.',
      fix: 'Добавьте script `lint` и реальный eslint config в репозиторий.',
    });
  }

  if (!config.hasFormatScript || !config.hasPrettierConfig) {
    diagnostics.push({
      status: 'warn',
      title: 'Format-слой не зафиксирован',
      message:
        'Без единого форматтера проект быстрее набирает шум в diff и спорит о стиле вместо логики.',
      fix: 'Добавьте prettier config и script для проверки/форматирования кода.',
    });
  }

  return diagnostics;
}

export function runWorkspaceCommand(
  config: WorkspaceConfig,
  command: WorkspaceCommandId,
): WorkspaceCommandResult {
  if (config.nodeVersion < 20 && command !== 'format-check') {
    return {
      status: 'error',
      title: 'Команда упирается в версию Node.js',
      lines: [
        '> npm run ' + command,
        'error: current Node.js version is not supported by this toolchain',
      ],
      fix: `Используйте Node 20+ для проекта на Vite ${stackVersions.vite}.`,
    };
  }

  if (command === 'install') {
    return {
      status: config.hasLockfile ? 'success' : 'warn',
      title: config.hasLockfile
        ? 'Установка окружения детерминирована'
        : 'Установка пройдёт, но без lockfile',
      lines: [
        '> npm install',
        config.hasLockfile
          ? 'package-lock.json is present -> stable dependency tree'
          : 'package-lock.json is missing -> dependency tree may drift',
        'node_modules populated',
      ],
      fix: config.hasLockfile
        ? 'Среда готова к запуску scripts.'
        : 'Зафиксируйте lockfile, если хотите одинаковое окружение у всей команды.',
    };
  }

  if (command === 'dev') {
    if (!config.hasDevScript) {
      return {
        status: 'error',
        title: 'npm не знает, как запускать dev server',
        lines: ['> npm run dev', 'npm ERR! Missing script: "dev"'],
        fix: 'Добавьте script `dev`, например `vite`.',
      };
    }

    if (!config.hasReactDeps || !config.hasViteDep) {
      return {
        status: 'error',
        title: 'Старт dev-сервера ломается на зависимостях',
        lines: ['> npm run dev', 'failed to resolve entry dependencies for React/Vite'],
        fix: 'Проверьте dependencies и выполните установку пакетов заново.',
      };
    }

    if (!config.hasEntryHtml) {
      return {
        status: 'error',
        title: 'Vite не находит стартовую HTML-страницу',
        lines: ['> npm run dev', 'error: failed to load index.html'],
        fix: 'Верните index.html в корень проекта или исправьте entry-конфигурацию.',
      };
    }

    if (!config.rootIdMatches) {
      return {
        status: 'error',
        title: 'Сервер поднят, но React не может смонтироваться',
        lines: [
          '> npm run dev',
          `VITE v${stackVersions.vite} ready in 230 ms`,
          'Uncaught Error: Target container is not a DOM element.',
        ],
        fix: 'Сверьте `document.getElementById(...)` в main.tsx и id в index.html.',
      };
    }

    return {
      status: 'success',
      title: 'Локальная среда разработки запущена',
      lines: [
        '> npm run dev',
        `VITE v${stackVersions.vite} ready in 210 ms`,
        'Local: http://localhost:5173/',
        'browser: root mounted, HMR connected',
      ],
      fix: 'Можно переходить к правкам кода и наблюдать HMR в браузере.',
    };
  }

  if (command === 'build') {
    if (!config.hasBuildScript) {
      return {
        status: 'error',
        title: 'Build script отсутствует',
        lines: ['> npm run build', 'npm ERR! Missing script: "build"'],
        fix: 'Добавьте production-сборку в scripts.',
      };
    }

    if (!config.hasReactDeps || !config.hasViteDep || !config.hasTypeScript) {
      return {
        status: 'error',
        title: 'Production build не может стартовать',
        lines: ['> npm run build', 'error during build: toolchain is incomplete'],
        fix: 'Проверьте зависимости React/Vite/TypeScript и синхронизируйте manifest с кодом.',
      };
    }

    return {
      status: 'success',
      title: 'Production build собран',
      lines: [
        '> npm run build',
        'tsc --noEmit',
        'transforming modules...',
        'dist/index.html and hashed assets generated successfully',
      ],
      fix: 'После этого можно запускать preview или собирать Docker-образ.',
    };
  }

  if (command === 'preview') {
    if (!config.hasPreviewScript) {
      return {
        status: 'error',
        title: 'Preview script отсутствует',
        lines: ['> npm run preview', 'npm ERR! Missing script: "preview"'],
        fix: 'Добавьте script `preview`, чтобы проверять dist локально.',
      };
    }

    if (!config.hasBuildScript) {
      return {
        status: 'warn',
        title: 'Preview есть, но build-слой не оформлен',
        lines: [
          '> npm run preview',
          'server starts, but there is no guaranteed fresh dist build before preview',
        ],
        fix: 'Держите build и preview как связанный workflow, а не как разрозненные команды.',
      };
    }

    return {
      status: 'success',
      title: 'Собранная версия открыта локально',
      lines: [
        '> npm run preview',
        'serving dist/ on http://localhost:4173/',
        'browser: production bundle loaded without HMR',
      ],
      fix: 'Сравните это поведение с dev server: здесь уже нет живой пересборки исходников.',
    };
  }

  if (command === 'lint') {
    if (!config.hasLintScript) {
      return {
        status: 'error',
        title: 'Lint script отсутствует',
        lines: ['> npm run lint', 'npm ERR! Missing script: "lint"'],
        fix: 'Добавьте script `lint` и запускайте его перед build или в CI.',
      };
    }

    if (!config.hasEslintConfig) {
      return {
        status: 'error',
        title: 'ESLint установлен как идея, но не как реальный слой проекта',
        lines: ['> npm run lint', 'ESLint could not find an eslint.config.js file'],
        fix: 'Добавьте eslint config в корень проекта.',
      };
    }

    if (!config.hasModuleType) {
      return {
        status: 'error',
        title: 'Root-конфиг читается не в том модульном режиме',
        lines: [
          '> npm run lint',
          'SyntaxError: Cannot use import statement outside a module in eslint.config.js',
        ],
        fix: 'Согласуйте package.json и root-конфиги: для текущего проекта нужен `type: module`.',
      };
    }

    return {
      status: 'success',
      title: 'Статический анализ кода выполняется',
      lines: [
        '> npm run lint',
        'eslint .',
        '✓ imports, hooks rules and refresh rules checked',
      ],
      fix: 'Lint нужен для раннего отлова проблем, которые не обязаны ждать браузера или build.',
    };
  }

  if (command === 'format-check') {
    if (!config.hasFormatScript) {
      return {
        status: 'error',
        title: 'Format script отсутствует',
        lines: ['> npm run format:check', 'npm ERR! Missing script: "format:check"'],
        fix: 'Добавьте отдельную команду для проверки форматирования.',
      };
    }

    if (!config.hasPrettierConfig) {
      return {
        status: 'error',
        title: 'Форматтер не знает правил проекта',
        lines: [
          '> npm run format:check',
          'No prettier config found, using fallback defaults',
        ],
        fix: 'Зафиксируйте prettier config в репозитории, чтобы стиль не дрейфовал.',
      };
    }

    return {
      status: 'success',
      title: 'Форматирование проекта зафиксировано',
      lines: [
        '> npm run format:check',
        'prettier --check .',
        'All matched files use project formatting rules',
      ],
      fix: 'Такой слой уменьшает шум в diff и делает код проще для чтения всей командой.',
    };
  }

  if (!config.hasTestScript) {
    return {
      status: 'error',
      title: 'Test script отсутствует',
      lines: ['> npm test', 'npm ERR! Missing script: "test"'],
      fix: 'Добавьте test script и держите его рядом с остальными scripts.',
    };
  }

  return {
    status: 'success',
    title: 'Тестовый слой подключён',
    lines: ['> npm test', 'vitest run', '✓ workspace diagnostics', '✓ run mode analysis'],
    fix: 'Tests помогают проверять чистую предметную логику без ручного кликанья по интерфейсу.',
  };
}

export function buildPackagePreview(config: WorkspaceConfig): string {
  const scripts = [
    config.hasDevScript ? '    "dev": "vite",' : null,
    config.hasBuildScript ? '    "build": "tsc --noEmit && vite build",' : null,
    config.hasPreviewScript
      ? '    "preview": "vite preview --host 0.0.0.0 --port 4173",'
      : null,
    config.hasLintScript ? '    "lint": "eslint .",' : null,
    config.hasFormatScript ? '    "format:check": "prettier --check .",' : null,
    config.hasTestScript ? '    "test": "vitest run"' : null,
  ]
    .filter(Boolean)
    .join('\n');

  const dependencies = [
    config.hasReactDeps ? `    "react": "${stackVersions.react}",` : null,
    config.hasReactDeps ? `    "react-dom": "${stackVersions.reactDom}"` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const devDependencies = [
    config.hasViteDep ? `    "vite": "${stackVersions.vite}",` : null,
    config.hasTypeScript ? `    "typescript": "${stackVersions.typescript}",` : null,
    config.hasEslintConfig ? `    "eslint": "${stackVersions.eslint}",` : null,
    config.hasPrettierConfig ? `    "prettier": "${stackVersions.prettier}",` : null,
    config.hasTestScript ? `    "vitest": "${stackVersions.vitest}"` : null,
  ]
    .filter(Boolean)
    .join('\n');

  return [
    '{',
    config.hasModuleType ? '  "type": "module",' : '  // type field is missing',
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

export function buildIndexHtmlPreview(config: WorkspaceConfig): string {
  return [
    '<!doctype html>',
    '<html lang="ru">',
    '  <head>',
    '    <meta charset="UTF-8" />',
    '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    '    <title>React Project Anatomy Lab</title>',
    '  </head>',
    '  <body>',
    config.rootIdMatches ? '    <div id="root"></div>' : '    <div id="app"></div>',
    config.hasEntryHtml
      ? '    <script type="module" src="/src/main.tsx"></script>'
      : '    <!-- entry script is missing -->',
    '  </body>',
    '</html>',
  ].join('\n');
}
