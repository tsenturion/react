import { describe, expect, it } from 'vitest';

import { childrenApiTakeaways, describeOnlyChildMode } from './children-api-model';
import { describeCloneMode } from './clone-element-model';
import { buildFactorySnippet, describeFactoryState } from './create-element-model';
import { parseOverviewFocus } from './legacy-api-overview-model';
import { describeContextRecommendation } from './context-interop-model';
import { describeRefMigration } from './ref-migration-model';

describe('lesson 62 learning models', () => {
  it('parses overview focus safely', () => {
    expect(parseOverviewFocus('refs')).toBe('refs');
    expect(parseOverviewFocus('unknown')).toBe('all');
  });

  it('describes Children.only scenarios', () => {
    expect(describeOnlyChildMode('text-node').title).toContain('text');
    expect(childrenApiTakeaways).toHaveLength(4);
  });

  it('describes cloneElement modes and createElement factory state', () => {
    expect(describeCloneMode(true).title).toContain('compose');
    expect(describeFactoryState('article', true)).toContain('article');
    expect(buildFactorySnippet('section', false, true)).toContain(
      "createElement(\n  'section'",
    );
  });

  it('returns ref migration and context recommendations', () => {
    expect(describeRefMigration('ref-as-prop').tone).toBe('success');
    expect(describeContextRecommendation('legacy-class-shell').steps[0]).toContain(
      'provider',
    );
  });
});
