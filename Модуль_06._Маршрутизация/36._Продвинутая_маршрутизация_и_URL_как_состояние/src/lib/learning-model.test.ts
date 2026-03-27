import { describe, expect, it } from 'vitest';

import { lessonLabs } from './learning-model';
import { getMatchedTreePaths, splitPathname } from './path-model';
import { recommendUrlPlacement } from './route-placement-model';
import {
  advancedRouteTree,
  describeLabFromPath,
  findRoutingModule,
} from './routing-domain';
import {
  getCatalogItems,
  getWorkspaceRows,
  resolveCatalogSearchState,
  resolveEntityUrlState,
  resolveWorkspaceUrlState,
} from './url-state-model';

describe('lesson model', () => {
  it('keeps nested lab pointing to a concrete child route', () => {
    const nestedLab = lessonLabs.find((item) => item.id === 'nested');

    expect(nestedLab?.href).toBe('/nested-routes/module-6');
  });
});

describe('routing domain', () => {
  it('resolves lab id from pathname', () => {
    expect(describeLabFromPath('/layout-routes/activity')).toBe('layouts');
    expect(describeLabFromPath('/entities/module-6')).toBe('entities');
    expect(describeLabFromPath('/unknown')).toBeNull();
  });

  it('finds routing entity by route param value', () => {
    expect(findRoutingModule('search-sync')?.title).toContain('URL');
    expect(findRoutingModule('missing-id')).toBeNull();
  });
});

describe('url state model', () => {
  it('normalizes invalid catalog search params', () => {
    const state = resolveCatalogSearchState(
      new URLSearchParams('level=broken&sort=weird&view=grid'),
    );

    expect(state).toEqual({
      level: 'all',
      sort: 'popular',
      view: 'cards',
    });
  });

  it('filters catalog items by search params', () => {
    const state = resolveCatalogSearchState(
      new URLSearchParams('level=advanced&sort=title&view=cards'),
    );

    const items = getCatalogItems(
      [
        {
          id: 'a',
          title: 'Beta',
          level: 'advanced',
          status: 'todo',
          popularity: 1,
          progress: 20,
          focus: '',
          screens: [],
          routingNotes: [],
          pitfallNotes: [],
        },
        {
          id: 'b',
          title: 'Alpha',
          level: 'advanced',
          status: 'done',
          popularity: 5,
          progress: 90,
          focus: '',
          screens: [],
          routingNotes: [],
          pitfallNotes: [],
        },
      ],
      state,
    );

    expect(items.map((item) => item.id)).toEqual(['b', 'a']);
  });

  it('resolves workspace and entity url state', () => {
    expect(
      resolveWorkspaceUrlState(
        new URLSearchParams('tab=activity&status=done&sort=title'),
      ),
    ).toEqual({
      tab: 'activity',
      status: 'done',
      sort: 'title',
    });

    expect(resolveEntityUrlState(new URLSearchParams('tab=routing&panel=links'))).toEqual(
      {
        tab: 'routing',
        panel: 'links',
      },
    );
  });

  it('derives workspace rows from query-driven filters', () => {
    const rows = getWorkspaceRows(
      [
        {
          id: 'a',
          title: 'Alpha',
          level: 'base',
          status: 'done',
          popularity: 2,
          progress: 80,
          focus: 'Focus A',
          screens: [],
          routingNotes: ['Routing A'],
          pitfallNotes: ['Pitfall A'],
        },
      ],
      {
        tab: 'notes',
        status: 'done',
        sort: 'progress',
      },
    );

    expect(rows[0]).toEqual({
      id: 'a',
      title: 'Alpha',
      tone: 'Pitfall A',
    });
  });
});

describe('route placement model', () => {
  it('recommends path param for selected shareable entity', () => {
    expect(
      recommendUrlPlacement({
        shareable: true,
        hierarchical: false,
        selectedEntity: true,
        needsBackButton: true,
        mustSurviveReload: true,
        ephemeral: false,
        changesWhileTyping: false,
      }).model,
    ).toBe('Path param');
  });

  it('keeps ephemeral fragment in local state', () => {
    expect(
      recommendUrlPlacement({
        shareable: false,
        hierarchical: false,
        selectedEntity: false,
        needsBackButton: false,
        mustSurviveReload: false,
        ephemeral: true,
        changesWhileTyping: true,
      }).model,
    ).toBe('Local state');
  });
});

describe('path model', () => {
  it('splits pathname into clean segments', () => {
    expect(splitPathname('/entities/module-6')).toEqual(['entities', 'module-6']);
    expect(splitPathname('/')).toEqual([]);
  });

  it('marks active nested route branch for dynamic route', () => {
    expect(getMatchedTreePaths(advancedRouteTree, '/entities/module-6')).toEqual([
      'root',
      'entities',
      'entity-id',
    ]);
  });
});
