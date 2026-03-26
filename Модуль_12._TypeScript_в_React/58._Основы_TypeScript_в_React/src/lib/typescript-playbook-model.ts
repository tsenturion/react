export type AppStage = 'new-feature' | 'legacy-screen' | 'shared-ui';
export type BugPattern = 'props-mismatch' | 'state-branching' | 'dom-imperative';
export type TeamLevel = 'starting' | 'working' | 'confident';

export type PlaybookInput = {
  readonly appStage: AppStage;
  readonly bugPattern: BugPattern;
  readonly teamLevel: TeamLevel;
};

export type PlaybookResult = {
  readonly title: string;
  readonly tone: 'success' | 'warn' | 'error';
  readonly summary: string;
  readonly steps: readonly string[];
};

export function buildTypeScriptPlaybook(input: PlaybookInput): PlaybookResult {
  if (input.teamLevel === 'starting') {
    return {
      title: 'Начните с component contracts и UI states',
      tone: 'warn',
      summary:
        'На старте важнее типизировать props, события и конечные состояния интерфейса, чем пытаться покрыть типами весь проект одним большим рывком.',
      steps: [
        'Сначала оформите props и children у компонентов общего пользования.',
        'Затем добавьте typed events и state union у форм и экранов.',
        'Только потом переходите к более глубоким abstraction layers.',
      ] as const,
    };
  }

  if (input.bugPattern === 'dom-imperative') {
    return {
      title: 'Сфокусируйтесь на refs, currentTarget и безопасных DOM-boundaries',
      tone: 'error',
      summary:
        'Если ошибки приходят из DOM и imperative кода, полезнее типизировать refs и обработчики событий, чем расширять общие utility types.',
      steps: [
        'Уточните типы refs под конкретные HTML-элементы.',
        'Переведите обработчики на `currentTarget` и typed event signatures.',
        'Уберите `any` из DOM-границ и таймеров.',
      ] as const,
    };
  }

  return {
    title: 'TypeScript можно расширять как часть архитектуры',
    tone: 'success',
    summary:
      'Когда база уже освоена, типы начинают поддерживать дизайн компонентов, устойчивые UI-состояния и более честные границы данных.',
    steps: [
      'Укрепляйте shared UI-компоненты через unions и ограниченные props contracts.',
      'Поддерживайте state-машины экранов через discriminated unions.',
      'Используйте type errors как сигнал пересмотра API, а не как повод добавить `as any`.',
    ] as const,
  };
}
