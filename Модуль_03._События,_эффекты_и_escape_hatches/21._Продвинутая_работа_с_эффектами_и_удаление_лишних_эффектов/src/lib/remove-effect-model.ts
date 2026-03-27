import type { StatusTone } from './learning-model';

export type RemoveEffectMode = 'mirrored' | 'derived';

type RemoveEffectReport = {
  title: string;
  tone: StatusTone;
  summary: string;
  snippet: string;
};

const reports: Record<RemoveEffectMode, RemoveEffectReport> = {
  mirrored: {
    title: 'Derived data хранится в state',
    tone: 'error',
    summary:
      'Список и summary дублируют исходные данные. Любая пропущенная dependency создаёт drift между controls и интерфейсом.',
    snippet: [
      'const [visibleModules, setVisibleModules] = useState([]);',
      'const [summary, setSummary] = useState("");',
      '',
      'useEffect(() => {',
      '  setVisibleModules(filterModules(query, level));',
      '}, [query, level]);',
      '',
      'useEffect(() => {',
      '  setSummary(buildSummary(visibleModules));',
      '}, [visibleModules]);',
    ].join('\n'),
  },
  derived: {
    title: 'UI вычисляется прямо из текущих данных',
    tone: 'success',
    summary:
      'Когда данные полностью выводятся из query и level, их лучше не хранить отдельно. Так исчезают лишние effects и рассинхрон.',
    snippet: [
      'const visibleModules = filterModules(query, level);',
      'const summary = buildSummary(visibleModules);',
    ].join('\n'),
  },
};

export function buildRemoveEffectReport(mode: RemoveEffectMode) {
  return reports[mode];
}

export function hasDrift(actualIds: readonly string[], expectedIds: readonly string[]) {
  if (actualIds.length !== expectedIds.length) {
    return true;
  }

  return actualIds.some((id, index) => id !== expectedIds[index]);
}
