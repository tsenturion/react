import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

const reactHooksRecommendedLatestRules =
  reactHooks.configs.flat?.['recommended-latest']?.rules ??
  reactHooks.configs['recommended-latest'].rules;

// В этом уроке lint-слой — часть самой темы.
// Поэтому проект подключает recommended-latest preset, чтобы rules, deps,
// purity и ref-проверки были не на словах, а в реальном guardrail-слое.
export default tseslint.config(
  {
    ignores: ['dist', 'coverage', 'node_modules'],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooksRecommendedLatestRules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
);
