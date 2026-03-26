export type BuildTool = 'vite' | 'next' | 'mixed-monorepo';
export type CompilationMode = 'infer' | 'annotation' | 'all';
export type TeamReadiness = 'exploring' | 'partial' | 'broad';
export type LibraryRisk = 'low' | 'medium' | 'high';
export type PerfPain = 'low' | 'medium' | 'high';

export type RolloutInput = {
  readonly buildTool: BuildTool;
  readonly compilationMode: CompilationMode;
  readonly teamReadiness: TeamReadiness;
  readonly libraryRisk: LibraryRisk;
  readonly perfPain: PerfPain;
};

export type RolloutPlan = {
  readonly title: string;
  readonly compilerConfigSnippet: string;
  readonly lintSnippet: string;
  readonly steps: readonly string[];
  readonly risks: readonly string[];
  readonly firstSurface: string;
  readonly rolloutTone: 'success' | 'warn' | 'error';
};

export const projectCompilerSetup = {
  viteConfigPath: 'vite.config.ts',
  eslintConfigPath: 'eslint.config.js',
  compilerSnippet: `const reactCompilerPlugin = [
  'babel-plugin-react-compiler',
  {
    compilationMode: 'infer',
    panicThreshold: 'none',
  },
] as const;`,
  lintSnippet: `reactHooks.configs.flat['recommended-latest']`,
} as const;

function chooseFirstSurface(input: RolloutInput): string {
  if (input.perfPain === 'high' && input.libraryRisk !== 'high') {
    return 'Начните с экранов, где уже есть profiler evidence по лишним ререндерам.';
  }

  if (input.libraryRisk === 'high') {
    return 'Сначала включите compiler на isolated feature slices и libraries с минимальными side effects.';
  }

  return 'Начните с новых компонентов и feature folders, где ручная мемоизация ещё не разрослась.';
}

export function buildCompilerConfigSnippet(mode: CompilationMode): string {
  return `react({
  babel: {
    plugins: [[
      'babel-plugin-react-compiler',
      {
        compilationMode: '${mode}',
        panicThreshold: 'none',
      },
    ]],
  },
})`;
}

export function buildRolloutPlan(input: RolloutInput): RolloutPlan {
  const rolloutTone =
    input.libraryRisk === 'high'
      ? 'error'
      : input.teamReadiness === 'exploring'
        ? 'warn'
        : 'success';

  const title =
    input.compilationMode === 'annotation'
      ? 'Аккуратный rollout через annotation mode'
      : input.libraryRisk === 'high'
        ? 'Нужен gated rollout с дополнительной верификацией'
        : 'Compiler можно вводить как рабочий optimization layer';

  const steps = [
    'Включите compiler plugin и compiler-aware lint до массовых кодовых правок.',
    'Соберите profiler baseline на реальных interaction сценариях, а не на микробенчмарках.',
    'Проверьте libraries и custom abstractions: нет ли impure render, mutable contracts и скрытых side effects.',
    input.compilationMode === 'annotation'
      ? 'Разрешайте компиляцию точечно в компонентах, где команда уже понимает поведение и хочет минимальный риск.'
      : 'Включайте compiler на feature slices, где churn высокий, а архитектурные boundaries уже относительно чистые.',
    'Удаляйте manual memoization только после сравнения поведения и фиксации profiler improvement.',
  ] as const;

  const risks = [
    input.libraryRisk === 'high'
      ? 'Высокий library risk: сначала проверьте несовместимые contracts и скрытую мутабельность.'
      : 'Library risk контролируемый: основное внимание переключается на purity и lint diagnostics.',
    input.teamReadiness === 'exploring'
      ? 'Команда ещё привыкает к compiler mental model: держите rollout небольшими порциями.'
      : 'Команда готова читать compiler diagnostics и сравнивать поведение по profiler traces.',
    input.perfPain === 'low'
      ? 'Низкая острота проблемы: не превращайте compiler rollout в преждевременную оптимизацию.'
      : 'Проблема ощутима: фиксируйте baseline и не принимайте “стало чище” за “стало быстрее”.',
  ] as const;

  return {
    title,
    compilerConfigSnippet: buildCompilerConfigSnippet(input.compilationMode),
    lintSnippet: `export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat['recommended-latest'],
);`,
    steps,
    risks,
    firstSurface: chooseFirstSurface(input),
    rolloutTone,
  };
}
