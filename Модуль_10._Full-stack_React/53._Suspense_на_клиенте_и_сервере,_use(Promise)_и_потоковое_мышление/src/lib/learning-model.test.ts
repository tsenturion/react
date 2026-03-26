import { describe, expect, it } from 'vitest';

import {
  compareServerSuspenseStrategies,
  getServerScenario,
} from './server-suspense-model';
import { describeLabFromPath, lessonLabs } from './learning-model';
import { describeBoundaryMode, lazyChunks } from './lazy-boundary-model';
import {
  filterOverviewCardsByFocus,
  parseOverviewFocus,
} from './suspense-overview-domain';
import { chooseSuspenseStrategy } from './suspense-playbook-model';
import { getClientScene, getScenePanel, getStudyCard } from './suspense-resource-model';

describe('lesson route model', () => {
  it('keeps all lesson 53 labs in route map', () => {
    expect(lessonLabs.map((item) => item.id)).toEqual([
      'overview',
      'client',
      'lazy',
      'use-promise',
      'server',
      'playbook',
    ]);
  });

  it('maps pathname to matching lab id', () => {
    expect(describeLabFromPath('/use-promise')).toBe('use-promise');
    expect(describeLabFromPath('/server-suspense-and-streaming')).toBe('server');
    expect(describeLabFromPath('/unknown')).toBe('overview');
  });
});

describe('overview model', () => {
  it('parses URL focus safely', () => {
    expect(parseOverviewFocus('use')).toBe('use');
    expect(parseOverviewFocus('x')).toBe('all');
  });

  it('filters cards by focus', () => {
    expect(filterOverviewCardsByFocus('lazy')).toHaveLength(1);
    expect(filterOverviewCardsByFocus('all').length).toBeGreaterThan(4);
  });
});

describe('resource model', () => {
  it('returns client scene panels and study cards', () => {
    expect(getClientScene('academy').panels).toHaveLength(3);
    expect(getScenePanel('support', 'activity').title).toContain('Timeline');
    expect(getStudyCard('use-promise').server).toContain('сервере');
  });
});

describe('lazy boundary model', () => {
  it('describes boundary mode and chunk list', () => {
    expect(lazyChunks).toHaveLength(2);
    expect(describeBoundaryMode('local')).toContain('Локальные');
  });
});

describe('server suspense model', () => {
  it('builds strategy comparison for server scenarios', () => {
    const reports = compareServerSuspenseStrategies({
      scenarioId: 'catalog',
      networkMs: 90,
      jsBootMs: 220,
      serverMs: 170,
    });

    expect(reports).toHaveLength(3);
    expect(getServerScenario('article').label).toContain('Editorial');
    expect(reports[2].htmlVisibleMs).toBeLessThan(reports[1].htmlVisibleMs);
  });
});

describe('suspense playbook', () => {
  it('recommends server streaming when shell must arrive before JS', () => {
    expect(
      chooseSuspenseStrategy({
        codeSplitNeeded: false,
        dataReadInRender: false,
        htmlNeededBeforeJs: true,
        screenRevealsInParts: true,
        oneSlowBlockShouldNotHideWholeScreen: true,
        serverCanStream: true,
      }).primaryTool,
    ).toBe('server-streaming');
  });

  it('recommends use(Promise) + split boundaries composition when render reads data and one slow block must stay local', () => {
    expect(
      chooseSuspenseStrategy({
        codeSplitNeeded: false,
        dataReadInRender: true,
        htmlNeededBeforeJs: false,
        screenRevealsInParts: false,
        oneSlowBlockShouldNotHideWholeScreen: true,
        serverCanStream: false,
      }).primaryTool,
    ).toBe('compose-tools');
  });
});
