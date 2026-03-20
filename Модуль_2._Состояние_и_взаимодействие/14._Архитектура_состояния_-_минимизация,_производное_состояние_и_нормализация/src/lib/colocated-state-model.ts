import type { SectionCard } from './state-architecture-domain';
import type { StatusTone } from './learning-model';

export type ColocationMode = 'local' | 'hoisted';

export type ColocationReport = {
  tone: StatusTone;
  rootStateSize: number;
  summaryLabel: string;
  summary: string;
  snippet: string;
};

export function buildColocationReport(
  sections: SectionCard[],
  mode: ColocationMode,
  needsParentSummary: boolean,
  expandedCount: number,
): ColocationReport {
  if (mode === 'local') {
    return {
      tone: needsParentSummary ? 'warn' : 'success',
      rootStateSize: 0,
      summaryLabel: needsParentSummary ? 'summary blocked' : 'local is enough',
      summary: needsParentSummary
        ? 'Когда родителю нужно знать, какие карточки открыты, purely local state перестаёт быть достаточным. Тогда состояние либо поднимается, либо дети сообщают о себе наверх.'
        : 'Если состояние нужно только одному leaf-компоненту, colocated state уменьшает размер родительского state и число прокинутых props.',
      snippet: [
        'function Card() {',
        '  const [open, setOpen] = useState(false);',
        '  return <button onClick={() => setOpen((current) => !current)} />;',
        '}',
      ].join('\n'),
    };
  }

  return {
    tone: 'success',
    rootStateSize: sections.length,
    summaryLabel: `${expandedCount} expanded in parent`,
    summary:
      'Подъём state в родителя оправдан тогда, когда это знание реально нужно siblings или summary-блоку. Иначе root начинает хранить флаги, которые относятся только к leaf-узлам.',
    snippet: [
      'const [expandedById, setExpandedById] = useState({});',
      '',
      '<Card',
      '  open={Boolean(expandedById[id])}',
      '  onToggle={() => toggleId(id)}',
      '/>',
    ].join('\n'),
  };
}
