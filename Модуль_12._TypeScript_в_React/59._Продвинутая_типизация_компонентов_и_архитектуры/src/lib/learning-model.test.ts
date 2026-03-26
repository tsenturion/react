import { describe, expect, it } from 'vitest';

import { buildTypingRecommendation } from './advanced-typing-playbook-model';
import {
  endpointScenario,
  filterCollection,
  resolveSelection,
  tokenScenario,
} from './generic-components-model';
import { describeLabFromPath } from './learning-model';
import { describePolymorphicSemantics } from './polymorphic-components-model';
import { getPrimitiveRecipe, resolveRecipeTokens } from './design-system-typing-model';
import { createInitialComposerState, workflowReducer } from './reducer-union-model';

describe('lesson 59 learning model', () => {
  it('maps pathname to advanced typing lab id', () => {
    expect(describeLabFromPath('/generic-components-and-apis')).toBe('generics');
  });

  it('switches reducer branch and keeps typed defaults', () => {
    const state = workflowReducer(createInitialComposerState(), {
      type: 'select-kind',
      kind: 'approval',
    });

    expect(state.editor.kind).toBe('approval');
    if (state.editor.kind !== 'approval') {
      throw new Error('Expected approval branch');
    }
    expect(state.editor.approvers.length).toBeGreaterThan(0);
  });

  it('filters generic collections by normalized query', () => {
    const result = filterCollection(
      endpointScenario.items,
      'platform',
      endpointScenario.matches,
    );
    expect(result).toHaveLength(1);
    expect(result[0]?.owner).toBe('Platform');
  });

  it('resolves first visible item when selection is stale', () => {
    const selected = resolveSelection(
      tokenScenario.items,
      'missing',
      tokenScenario.getId,
    );
    expect(selected?.id).toBe('token-1');
  });

  it('describes polymorphic semantics explicitly', () => {
    expect(describePolymorphicSemantics('anchor')).toBe('navigation intent');
  });

  it('builds design-system and rollout recommendations from typed inputs', () => {
    const recipe = getPrimitiveRecipe('destroy');
    const recommendation = buildTypingRecommendation({
      pain: 'design-system',
      team: 'advanced',
      scope: 'shared-layer',
      ownsDesignSystem: true,
    });

    expect(resolveRecipeTokens(recipe).length).toBe(3);
    expect(recommendation.title).toMatch(/token maps/i);
  });
});
