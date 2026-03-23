import { describe, expect, it } from 'vitest';

import { splitPathname, getMatchedTreePaths } from './path-model';
import {
  describeLabFromPath,
  findRouteLesson,
  recommendRoutePlacement,
  routeTree,
} from './routing-domain';
import { lessonLabs } from './learning-model';

describe('learning model', () => {
  it('keeps param lab pointing to a concrete param route', () => {
    const paramsLab = lessonLabs.find((item) => item.id === 'params');

    expect(paramsLab?.href).toBe('/params/module-6');
  });
});

describe('routing domain', () => {
  it('resolves lab id from pathname', () => {
    expect(describeLabFromPath('/params/module-6')).toBe('params');
    expect(describeLabFromPath('/route-tree')).toBe('tree');
    expect(describeLabFromPath('/unknown')).toBeNull();
  });

  it('finds route lesson by param value', () => {
    expect(findRouteLesson('profile-editor')?.title).toContain('профиля');
    expect(findRouteLesson('missing-id')).toBeNull();
  });

  it('recommends route for shareable screen with history expectations', () => {
    expect(
      recommendRoutePlacement({
        hasShareableUrl: true,
        representsScreen: true,
        needsBrowserHistory: true,
        deepLinkingMatters: true,
        onlyTogglesUiFragment: false,
      }).approach,
    ).toBe('Route');
  });

  it('keeps local fragment in local UI state', () => {
    expect(
      recommendRoutePlacement({
        hasShareableUrl: false,
        representsScreen: false,
        needsBrowserHistory: false,
        deepLinkingMatters: false,
        onlyTogglesUiFragment: true,
      }).approach,
    ).toBe('Local UI state');
  });
});

describe('path model', () => {
  it('splits pathname into clean segments', () => {
    expect(splitPathname('/params/module-6')).toEqual(['params', 'module-6']);
    expect(splitPathname('/')).toEqual([]);
  });

  it('marks active route tree branch for param route', () => {
    expect(getMatchedTreePaths(routeTree, '/params/module-6')).toEqual([
      'root',
      'params',
      'params-id',
    ]);
  });
});
