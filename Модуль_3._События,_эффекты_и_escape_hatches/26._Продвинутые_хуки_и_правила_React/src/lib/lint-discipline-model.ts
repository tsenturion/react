import type { StatusTone } from './learning-model';
import type { RulePreset } from './rule-store';

export type DisciplineMode = 'review-only' | 'lint-first' | 'ci-gate';
export type LintIssueId =
  | 'hook-in-condition'
  | 'missing-dependency'
  | 'impure-render'
  | 'ref-mutation-in-render';

export const lintIssueCatalog: readonly {
  id: LintIssueId;
  label: string;
  rule: string;
  minimumPreset: RulePreset;
  why: string;
}[] = [
  {
    id: 'hook-in-condition',
    label: 'Hook внутри условия',
    rule: 'react-hooks/rules-of-hooks',
    minimumPreset: 'recommended',
    why: 'React теряет стабильный порядок вызова hooks между рендерами.',
  },
  {
    id: 'missing-dependency',
    label: 'Пропущенная dependency',
    rule: 'react-hooks/exhaustive-deps',
    minimumPreset: 'recommended',
    why: 'Effect начинает читать устаревшие значения и теряет причинно-следственную связь.',
  },
  {
    id: 'impure-render',
    label: 'Нечистый рендер',
    rule: 'react-hooks/purity',
    minimumPreset: 'recommended-latest',
    why: 'Компонент перестаёт быть предсказуемой функцией от props и state.',
  },
  {
    id: 'ref-mutation-in-render',
    label: 'Мутация ref в рендере',
    rule: 'react-hooks/refs',
    minimumPreset: 'recommended-latest',
    why: 'Скрытый побочный эффект в рендере делает поведение труднообъяснимым.',
  },
] as const;

function presetCoversIssue(preset: RulePreset, issueId: LintIssueId) {
  const issue = lintIssueCatalog.find((item) => item.id === issueId);
  if (!issue) {
    return false;
  }

  return preset === 'recommended-latest' || issue.minimumPreset === 'recommended';
}

export function evaluateLintDiscipline(
  preset: RulePreset,
  mode: DisciplineMode,
  issueIds: readonly LintIssueId[],
): {
  tone: StatusTone;
  headline: string;
  blocked: LintIssueId[];
  slips: LintIssueId[];
  activeRules: string[];
} {
  const blocked =
    mode === 'review-only'
      ? []
      : issueIds.filter((issueId) => presetCoversIssue(preset, issueId));
  const slips = issueIds.filter((issueId) => !blocked.includes(issueId));
  const activeRules = lintIssueCatalog
    .filter((issue) => presetCoversIssue(preset, issue.id))
    .map((issue) => issue.rule);

  let tone: StatusTone = 'success';
  if (slips.length > 0) {
    tone = blocked.length > 0 ? 'warn' : 'error';
  }

  return {
    tone,
    headline:
      tone === 'success'
        ? 'Lint-слой перекрывает выбранные риски'
        : tone === 'warn'
          ? 'Часть проблем ловится автоматически, часть всё ещё проскальзывает'
          : 'Автоматический guardrail почти отсутствует',
    blocked,
    slips,
    activeRules,
  };
}
