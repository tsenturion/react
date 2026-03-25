import type { StatusTone } from './learning-model';

export type RenderTrigger = 'typing' | 'filter' | 'route-change' | 'theme-toggle';
export type TreeMode = 'wide-parent' | 'isolated-branch';
export type TreeBranch = 'toolbar' | 'sidebar' | 'list';

export function analyzeComponentTree({
  treeMode,
  trigger,
  highlightedBranch,
}: {
  treeMode: TreeMode;
  trigger: RenderTrigger;
  highlightedBranch: TreeBranch;
}): {
  tone: StatusTone;
  headline: string;
  explanation: string;
  devtoolsClue: string;
} {
  if (treeMode === 'wide-parent') {
    return {
      tone: 'warn',
      headline: 'Обновление поднимается слишком высоко по дереву',
      explanation:
        highlightedBranch === 'list'
          ? 'Список получает новый pass даже там, где пользователь менял только внешний shell signal.'
          : 'Широкий parent state приводит к cascade renders в соседних ветках tree.',
      devtoolsClue:
        trigger === 'typing'
          ? 'В DevTools стоит смотреть, какие sibling branches мигают вместе с input.'
          : 'Profiler покажет серию коротких, но лишних commits по нескольким веткам.',
    };
  }

  return {
    tone: 'success',
    headline: 'Источник обновления изолирован рядом с проблемной веткой',
    explanation:
      trigger === 'theme-toggle'
        ? 'Theme signal остаётся shell-level, но heavy list не втягивается в unrelated render wave.'
        : 'State colocation и narrow props помогают DevTools показывать более чистое дерево обновлений.',
    devtoolsClue:
      highlightedBranch === 'list'
        ? 'Highlight updates концентрируется на list branch вместо всего workspace.'
        : 'В tree легче увидеть, какой subtree действительно меняется и почему.',
  };
}
