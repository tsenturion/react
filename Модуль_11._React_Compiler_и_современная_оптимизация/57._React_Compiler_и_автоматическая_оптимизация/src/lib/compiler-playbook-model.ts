export type AppShape = 'dashboard' | 'content-studio' | 'canvas-tool';
export type PerfPain = 'localized' | 'recurring' | 'systemic';
export type CompilerConfidence = 'low' | 'medium' | 'high';
export type AdoptionRisk = 'low' | 'medium' | 'high';

export type PlaybookInput = {
  readonly appShape: AppShape;
  readonly perfPain: PerfPain;
  readonly compilerConfidence: CompilerConfidence;
  readonly adoptionRisk: AdoptionRisk;
};

export type PlaybookResult = {
  readonly title: string;
  readonly tone: 'success' | 'warn' | 'error';
  readonly summary: string;
  readonly steps: readonly string[];
  readonly watchouts: readonly string[];
};

export function buildCompilerPlaybook(input: PlaybookInput): PlaybookResult {
  if (input.perfPain === 'localized' && input.adoptionRisk === 'high') {
    return {
      title: 'Compiler не должен быть первой реакцией',
      tone: 'error',
      summary:
        'При локальной проблеме и высоком риске сначала зафиксируйте точечный bottleneck и проверьте, не решается ли он обычным state colocation или boundary split.',
      steps: [
        'Снимите profiler trace на конкретном interaction path.',
        'Уберите архитектурный шум: giant context, heavy effect, unnecessary parent state.',
        'Только потом включайте compiler на ограниченном surface.',
      ] as const,
      watchouts: [
        'Не превращайте compiler rollout в замену нормальной диагностике.',
        'Не удаляйте ручную мемоизацию, пока не поймёте, зачем она вообще была добавлена.',
      ] as const,
    };
  }

  if (input.compilerConfidence === 'low' || input.adoptionRisk === 'high') {
    return {
      title: 'Нужен постепенный rollout с проверкой гипотез',
      tone: 'warn',
      summary:
        'Команда ещё набирает уверенность или рядом слишком много library risk, поэтому rollout стоит вести от малых feature slices к более критичным экранам.',
      steps: [
        'Включите compiler plugin и `recommended-latest` lint preset.',
        'Выберите 1–2 экрана с повторяющимся render churn.',
        'Сравните profiler traces до и после и только затем расширяйте surface.',
      ] as const,
      watchouts: [
        'Не считайте compiler proof-of-concept доказательством, что manual memoization больше нигде не нужна.',
        'Держите список libraries и boundaries, где behaviour зависит от stable identity.',
      ] as const,
    };
  }

  return {
    title: 'Compiler можно включать как системный optimization layer',
    tone: 'success',
    summary:
      'Когда perf pain повторяется, команда понимает profiler workflow, а risk контролируемый, React Compiler становится хорошим слоем автоматической оптимизации поверх уже нормальной архитектуры.',
    steps: [
      'Сделайте compiler частью стандартного build pipeline.',
      'Смотрите на новые performance issues сначала через profiler и compiler diagnostics.',
      'Удаляйте manual memo helpers постепенно, подтверждая выигрыш по поведению, а не по вкусу кода.',
    ] as const,
    watchouts: [
      'Продолжайте инвестировать в architecture: compiler не чинит routing, data ownership и DOM volume.',
      'Оставляйте ручные оптимизации там, где библиотечный контракт или отдельный caching layer этого реально требуют.',
    ] as const,
  };
}
