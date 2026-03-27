import type { StatusTone } from './learning-model';

export type BranchMode = 'same-type' | 'different-type';

export type BranchIdentityReport = {
  tone: StatusTone;
  title: string;
  summary: string;
  consequence: string;
  snippet: string;
};

export function buildBranchIdentityReport(mode: BranchMode): BranchIdentityReport {
  if (mode === 'same-type') {
    return {
      tone: 'success',
      title: 'Один type в одном slot',
      summary:
        'Если в обеих ветках остаётся один и тот же component type, React сохраняет экземпляр и обновляет только props.',
      consequence:
        'Локальный draft и счётчики сохраняются при переключении веток, потому что identity не меняется.',
      snippet: [
        '{isAdvanced ? (',
        '  <SharedTrackPanel track="advanced" />',
        ') : (',
        '  <SharedTrackPanel track="basic" />',
        ')}',
      ].join('\n'),
    };
  }

  return {
    tone: 'error',
    title: 'Разные component types',
    summary:
      'Когда в том же slot React видит разные function components, старое поддерево снимается полностью.',
    consequence:
      'Локальный state сбрасывается, а эффекты прежней ветки проходят через cleanup и mount заново.',
    snippet: ['{isAdvanced ? <AdvancedTrackPanel /> : <BasicTrackPanel />}'].join('\n'),
  };
}
