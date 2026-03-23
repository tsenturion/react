import { describe, expect, it } from 'vitest';

import {
  canAccessRole,
  describeLabFromPath,
  filterAuthPlaybooksByFocus,
} from './auth-domain';
import { lessonLabs } from './learning-model';
import {
  parseFocus,
  recommendAccessArchitecture,
  resolveSafeNextPath,
} from './auth-runtime';

describe('lesson model', () => {
  it('keeps protected lab pointing to a real protected branch path', () => {
    const protectedLab = lessonLabs.find((item) => item.id === 'protected');

    expect(protectedLab?.href).toBe('/protected-workspace/dashboard');
  });
});

describe('auth domain', () => {
  it('resolves lab id from pathname', () => {
    expect(describeLabFromPath('/role-access/admin-panel')).toBe('roles');
    expect(describeLabFromPath('/session-lifecycle')).toBe('session');
    expect(describeLabFromPath('/unknown')).toBeNull();
  });

  it('filters playbooks by focus', () => {
    expect(
      filterAuthPlaybooksByFocus('roles').every((item) => item.focus === 'roles'),
    ).toBe(true);
    expect(filterAuthPlaybooksByFocus('all').length).toBeGreaterThan(4);
  });

  it('checks role hierarchy correctly', () => {
    expect(canAccessRole('admin', 'editor')).toBe(true);
    expect(canAccessRole('member', 'editor')).toBe(false);
  });
});

describe('auth runtime', () => {
  it('normalizes invalid focus values', () => {
    expect(parseFocus('broken')).toBe('all');
    expect(parseFocus('ux')).toBe('ux');
  });

  it('sanitizes next path for safe login redirects', () => {
    expect(resolveSafeNextPath(null)).toBe('/protected-workspace/dashboard');
    expect(resolveSafeNextPath('//evil.example')).toBe('/protected-workspace/dashboard');
    expect(resolveSafeNextPath('/auth-ux?next=/role-access/admin-panel')).toBe(
      '/protected-workspace/dashboard',
    );
    expect(resolveSafeNextPath('/role-access/admin-panel')).toBe(
      '/role-access/admin-panel',
    );
  });

  it('recommends route guard loader for route-critical auth', () => {
    expect(
      recommendAccessArchitecture({
        dependsOnRoute: true,
        mustPreserveIntent: true,
        roleBased: false,
        blocksScreen: true,
        needsSessionRefresh: false,
        affectsSingleWidget: false,
        purelyPresentational: false,
      }).model,
    ).toBe('Route guard loader');
  });

  it('recommends role gate and plain compute in the right cases', () => {
    expect(
      recommendAccessArchitecture({
        dependsOnRoute: true,
        mustPreserveIntent: false,
        roleBased: true,
        blocksScreen: false,
        needsSessionRefresh: false,
        affectsSingleWidget: false,
        purelyPresentational: false,
      }).model,
    ).toBe('Role gate + layout branch');

    expect(
      recommendAccessArchitecture({
        dependsOnRoute: false,
        mustPreserveIntent: false,
        roleBased: false,
        blocksScreen: false,
        needsSessionRefresh: false,
        affectsSingleWidget: false,
        purelyPresentational: true,
      }).model,
    ).toBe('Plain compute');
  });
});
