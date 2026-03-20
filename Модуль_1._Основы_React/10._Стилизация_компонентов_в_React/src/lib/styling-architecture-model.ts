import type { StatusTone } from './learning-model';

export type ApproachId = 'class-css' | 'css-modules' | 'inline' | 'hybrid';

export type ArchitectureControls = {
  isolated: boolean;
  manyStates: boolean;
  runtimeValues: boolean;
  sharedTheme: boolean;
  pseudoStates: boolean;
  crossProjectReuse: boolean;
};

export type ArchitecturePresetId = 'landing' | 'ui-kit' | 'live-meter';

export type ApproachScore = {
  id: ApproachId;
  title: string;
  score: number;
  reason: string;
};

export type ArchitectureReport = {
  tone: StatusTone;
  recommended: ApproachScore;
  approaches: ApproachScore[];
  summary: string;
  antiPattern: string;
  cleanPattern: string;
};

export const defaultArchitectureControls: ArchitectureControls = {
  isolated: true,
  manyStates: true,
  runtimeValues: false,
  sharedTheme: true,
  pseudoStates: true,
  crossProjectReuse: true,
};

export const architecturePresets: Record<
  ArchitecturePresetId,
  { label: string; state: ArchitectureControls }
> = {
  landing: {
    label: 'Маркетинговый блок',
    state: {
      isolated: false,
      manyStates: false,
      runtimeValues: false,
      sharedTheme: true,
      pseudoStates: true,
      crossProjectReuse: false,
    },
  },
  'ui-kit': {
    label: 'UI-kit компонент',
    state: {
      isolated: true,
      manyStates: true,
      runtimeValues: false,
      sharedTheme: true,
      pseudoStates: true,
      crossProjectReuse: true,
    },
  },
  'live-meter': {
    label: 'Живой индикатор',
    state: {
      isolated: true,
      manyStates: false,
      runtimeValues: true,
      sharedTheme: false,
      pseudoStates: false,
      crossProjectReuse: false,
    },
  },
};

function scoreApproach(controls: ArchitectureControls, id: ApproachId): ApproachScore {
  if (id === 'class-css') {
    const score =
      5 +
      (controls.manyStates ? -2 : 2) +
      (controls.isolated ? -1 : 1) +
      (controls.sharedTheme ? 1 : 0) +
      (controls.runtimeValues ? -2 : 0);

    return {
      id,
      title: 'className + CSS-файл',
      score,
      reason:
        'Хорошо работает для простых экранов и маркетинговых блоков, но начинает шуметь, если компоненту нужно слишком много состояний и строгая изоляция.',
    };
  }

  if (id === 'css-modules') {
    const score =
      6 +
      (controls.isolated ? 3 : 0) +
      (controls.manyStates ? 2 : 0) +
      (controls.sharedTheme ? 1 : 0) +
      (controls.runtimeValues ? -1 : 0);

    return {
      id,
      title: 'CSS Modules',
      score,
      reason:
        'Подходит для прикладных компонентов с локальными классами, явными variant rules и защитой от случайных конфликтов.',
    };
  }

  if (id === 'inline') {
    const score =
      4 +
      (controls.runtimeValues ? 4 : -3) +
      (controls.pseudoStates ? -3 : 0) +
      (controls.sharedTheme ? -2 : 0) +
      (controls.crossProjectReuse ? -1 : 0);

    return {
      id,
      title: 'Inline styles',
      score,
      reason:
        'Лучше всего подходят для числовых runtime-значений. Плохо масштабируются, если нужны темы, псевдосостояния и длинные вариантные правила.',
    };
  }

  const score =
    7 +
    (controls.isolated ? 2 : 0) +
    (controls.manyStates ? 3 : 0) +
    (controls.runtimeValues ? 2 : 0) +
    (controls.sharedTheme ? 2 : 0) +
    (controls.crossProjectReuse ? 2 : 0);

  return {
    id,
    title: 'Гибрид: recipe + CSS',
    score,
    reason:
      'Лучший вариант для масштабируемых компонентов: статические части остаются в CSS, runtime-значения идут через `style`, а variant maps не разрастаются в длинные тернарные выражения.',
  };
}

export function buildArchitectureReport(
  controls: ArchitectureControls,
): ArchitectureReport {
  const approaches = (['class-css', 'css-modules', 'inline', 'hybrid'] as const)
    .map((id) => scoreApproach(controls, id))
    .sort((left, right) => right.score - left.score);

  return {
    tone: approaches[0].id === 'inline' && controls.manyStates ? 'warn' : 'success',
    recommended: approaches[0],
    approaches,
    summary:
      'Архитектура стилизации выбирается не по вкусу, а по ограничениям задачи: нужны ли темы, изоляция, псевдосостояния, runtime-значения и повторное использование.',
    antiPattern: [
      'className={',
      '  selected',
      '    ? busy',
      '      ? disabled',
      '        ? "..."',
      '        : "..."',
      '      : "..."',
      '    : "..."',
      '}',
    ].join('\n'),
    cleanPattern: [
      'const className = clsx(',
      '  styles.button,',
      '  toneClasses[tone],',
      '  densityClasses[density],',
      '  selected && styles.selected,',
      '  disabled && styles.disabled,',
      ');',
    ].join('\n'),
  };
}
