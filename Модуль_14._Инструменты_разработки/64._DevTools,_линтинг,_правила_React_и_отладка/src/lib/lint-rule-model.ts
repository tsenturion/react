import type { StatusTone } from './learning-model';

export type LintConfigMode = 'baseline' | 'strict';
export type LintFindingId =
  | 'exhaustive-deps'
  | 'set-state-in-render'
  | 'purity'
  | 'refs'
  | 'static-components'
  | 'unsupported-syntax';

export const lintFindingCatalog: readonly {
  id: LintFindingId;
  title: string;
  bucket: 'hooks' | 'rendering' | 'architecture';
  baseline: boolean;
  summary: string;
  whyItHurts: string;
}[] = [
  {
    id: 'exhaustive-deps',
    title: 'Missing dependency in effect',
    bucket: 'hooks',
    baseline: true,
    summary: 'Эффект опирается на значение, которое не объявлено в dependency list.',
    whyItHurts:
      'Так появляются stale closures и несинхронизированное состояние интерфейса.',
  },
  {
    id: 'set-state-in-render',
    title: 'setState during render',
    bucket: 'rendering',
    baseline: true,
    summary: 'Рендер перестаёт быть чистым и начинает сам запускать новые обновления.',
    whyItHurts: 'Это ломает mental model render → commit и быстро приводит к циклам.',
  },
  {
    id: 'purity',
    title: 'Impure render logic',
    bucket: 'rendering',
    baseline: false,
    summary: 'Компонент читает или мутирует внешнее состояние во время render.',
    whyItHurts: 'Такие компоненты труднее отлаживать и анализировать через DevTools.',
  },
  {
    id: 'refs',
    title: 'Ref misuse during render',
    bucket: 'architecture',
    baseline: false,
    summary:
      'Ref используется как скрытый канал данных или читается/пишется в render phase.',
    whyItHurts: 'Ref должен быть escape hatch, а не замена props/state.',
  },
  {
    id: 'static-components',
    title: 'Component factory inside render',
    bucket: 'architecture',
    baseline: false,
    summary:
      'Компонент или hook-factory создаётся на лету в render и каждый раз получает новую identity.',
    whyItHurts: 'Это усложняет tree reasoning и может ломать предсказуемость обновлений.',
  },
  {
    id: 'unsupported-syntax',
    title: 'Unsupported syntax for React analysis',
    bucket: 'architecture',
    baseline: false,
    summary:
      'Синтаксис мешает инструментам корректно анализировать компонентные границы и правила.',
    whyItHurts:
      'Tooling перестаёт давать надёжные сигналы и теряется качество guardrails.',
  },
] as const;

export function summarizeLintFindings(
  activeFindings: readonly LintFindingId[],
  mode: LintConfigMode,
): {
  total: number;
  baselineVisible: number;
  strictVisible: number;
  tone: StatusTone;
  title: string;
  copy: string;
} {
  const visibleFindings = lintFindingCatalog.filter(
    (item) => activeFindings.includes(item.id) && (mode === 'strict' || item.baseline),
  );

  const baselineVisible = visibleFindings.filter((item) => item.baseline).length;
  const strictVisible = visibleFindings.filter((item) => !item.baseline).length;
  const total = visibleFindings.length;

  if (total === 0) {
    return {
      total,
      baselineVisible,
      strictVisible,
      tone: 'success',
      title: 'Lint stack молчит осмысленно',
      copy: 'В текущем наборе smells конфиг не видит критичных нарушений React-модели.',
    };
  }

  if (strictVisible > 0) {
    return {
      total,
      baselineVisible,
      strictVisible,
      tone: 'warn',
      title: 'Strict linting находит дополнительные architectural issues',
      copy: 'Это полезный сигнал: базовый hooks lint уже не покрывает все риски текущей codebase.',
    };
  }

  return {
    total,
    baselineVisible,
    strictVisible,
    tone: 'error',
    title: 'Даже базовый lint видит явные нарушения',
    copy: 'Проблема уже находится в зоне hooks/render discipline и не должна доходить до runtime debugging.',
  };
}

export const lintTakeaways = [
  'Базовый lint полезен, но в зрелом проекте нужен и более широкий набор react-specific checks.',
  'Если finding связан с purity или refs, это почти всегда вопрос архитектуры, а не косметики.',
  'Хороший lint config уменьшает число багов ещё до DevTools и тестов.',
  'Strict mode линтинга имеет смысл тогда, когда команда читает сигналы как инженерные решения, а не как шум.',
] as const;
