import { describe, expect, it } from 'vitest';

import { dataPlaybooks, describeLabFromPath } from './data-router-domain';
import { lessonLabs } from './learning-model';
import {
  buildComparisonScenario,
  filterPlaybooksByTrack,
  parseErrorMode,
  parseTrack,
  recommendDataOwnership,
  validateMutationInput,
} from './data-router-runtime';

describe('lesson model', () => {
  it('keeps overview lab pointing to the route-owned entry screen', () => {
    const overviewLab = lessonLabs.find((item) => item.id === 'overview');

    expect(overviewLab?.href).toBe('/data-router-overview?track=all');
  });
});

describe('data router domain', () => {
  it('resolves lab id from pathname', () => {
    expect(describeLabFromPath('/loader-tree/route-loaders')).toBe('nested');
    expect(describeLabFromPath('/error-routes/stable')).toBe('errors');
    expect(describeLabFromPath('/unknown')).toBeNull();
  });

  it('keeps playbooks describing loaders, actions and errors', () => {
    expect(dataPlaybooks.some((item) => item.track === 'loaders')).toBe(true);
    expect(dataPlaybooks.some((item) => item.track === 'actions')).toBe(true);
    expect(dataPlaybooks.some((item) => item.track === 'errors')).toBe(true);
  });
});

describe('runtime helpers', () => {
  it('normalizes invalid track and error mode values', () => {
    expect(parseTrack('broken')).toBe('all');
    expect(parseTrack('actions')).toBe('actions');
    expect(parseErrorMode('missing')).toBe('stable');
    expect(parseErrorMode('throw-error')).toBe('throw-error');
  });

  it('filters playbooks by track', () => {
    const items = filterPlaybooksByTrack('actions');

    expect(items).toHaveLength(1);
    expect(items[0]?.id).toBe('form-actions');
  });

  it('validates action payload and trims successful values', () => {
    const invalid = validateMutationInput({
      topicId: 'unknown',
      owner: 'A',
      note: 'too short',
    });

    expect(invalid.ok).toBe(false);
    expect(invalid.errors.topicId).toBeDefined();
    expect(invalid.errors.owner).toBeDefined();
    expect(invalid.errors.note).toBeDefined();

    const valid = validateMutationInput({
      topicId: 'form-flow',
      owner: '  Нина  ',
      note: '  Нужен устойчивый submit flow с route revalidation.  ',
    });

    expect(valid.ok).toBe(true);
    expect(valid.values).toEqual({
      topicId: 'form-flow',
      owner: 'Нина',
      note: 'Нужен устойчивый submit flow с route revalidation.',
    });
  });

  it('builds route-vs-component comparison scenarios', () => {
    const scenario = buildComparisonScenario('submit');

    expect(scenario.routeSteps[0]).toContain('Form');
    expect(scenario.componentSteps[0]).toContain('вручную');
  });

  it('recommends ownership by scenario pressure', () => {
    expect(
      recommendDataOwnership({
        dependsOnUrl: false,
        blocksScreen: false,
        submittedFromForm: false,
        shouldRevalidateRoute: false,
        purelyDerived: true,
        tiedToOneWidget: false,
        shouldUseRouteBoundary: false,
      }).model,
    ).toBe('Plain compute');

    expect(
      recommendDataOwnership({
        dependsOnUrl: true,
        blocksScreen: true,
        submittedFromForm: false,
        shouldRevalidateRoute: true,
        purelyDerived: false,
        tiedToOneWidget: false,
        shouldUseRouteBoundary: true,
      }).model,
    ).toBe('Loader');

    expect(
      recommendDataOwnership({
        dependsOnUrl: false,
        blocksScreen: false,
        submittedFromForm: true,
        shouldRevalidateRoute: true,
        purelyDerived: false,
        tiedToOneWidget: false,
        shouldUseRouteBoundary: true,
      }).model,
    ).toBe('Action');
  });
});
