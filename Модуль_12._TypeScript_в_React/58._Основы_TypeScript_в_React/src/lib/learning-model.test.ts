import { describe, expect, it } from 'vitest';

import { buildEditingState, validateReviewDraft } from './events-state-model';
import { buildContractReports, getPropsScenario } from './props-contract-model';
import { buildTypeScriptPlaybook } from './typescript-playbook-model';
import { filterOverviewCardsByFocus } from './typescript-overview-domain';
import { buildCatalogState, describeCatalogState } from './ui-states-model';

describe('typescript lesson models', () => {
  it('filters overview cards by requested focus', () => {
    const cards = filterOverviewCardsByFocus('events');

    expect(cards).toHaveLength(1);
    expect(cards[0]?.focus).toBe('events');
  });

  it('marks typed contract as recommended', () => {
    const reports = buildContractReports();

    expect(reports.find((item) => item.id === 'typed')?.recommendation).toBe(
      'recommended',
    );
    expect(getPropsScenario('lesson-card').wins).toHaveLength(2);
  });

  it('builds editing state from changed draft fields', () => {
    const next = buildEditingState(
      { title: 'Typed card', score: 8, urgent: true },
      { title: 'Typed feedback', score: 7, urgent: false },
    );

    expect(next.status).toBe('editing');
    expect(next.status === 'editing' ? next.dirtyFields : []).toContain('urgent');
  });

  it('returns validation error for short title', () => {
    const state = validateReviewDraft({ title: 'No', score: 7, urgent: false });

    expect(state.status).toBe('error');
    expect(state.status === 'error' ? state.field : null).toBe('title');
  });

  it('builds empty catalog state and describes it', () => {
    const state = buildCatalogState({ fetchMode: 'empty', query: 'typed' });

    expect(state.status).toBe('empty');
    expect(describeCatalogState(state)).toContain('не нашлось');
  });

  it('recommends refs-first branch for dom imperative bugs', () => {
    const result = buildTypeScriptPlaybook({
      appStage: 'legacy-screen',
      bugPattern: 'dom-imperative',
      teamLevel: 'working',
    });

    expect(result.tone).toBe('error');
    expect(result.title).toContain('refs');
  });
});
