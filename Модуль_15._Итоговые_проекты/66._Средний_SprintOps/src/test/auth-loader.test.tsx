import { beforeEach, describe, expect, it } from 'vitest';

import { authStore } from '../lib/auth-store';
import { protectedLoader } from '../router';

describe('protectedLoader', () => {
  beforeEach(() => {
    authStore.reset();
    window.localStorage.clear();
  });

  it('redirects unauthenticated user to login and preserves intent path', async () => {
    try {
      await protectedLoader({
        request: new Request('http://localhost/app/incidents?status=blocked'),
        params: {},
        context: undefined,
      } as Parameters<typeof protectedLoader>[0]);
      throw new Error('Expected redirect to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(Response);

      const response = error as Response;
      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toBe(
        '/login?redirect=%2Fapp%2Fincidents%3Fstatus%3Dblocked',
      );
    }
  });
});
