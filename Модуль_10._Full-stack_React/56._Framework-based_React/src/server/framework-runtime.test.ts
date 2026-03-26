import { describe, expect, it } from 'vitest';

import { simulateFrameworkRequest } from './framework-runtime';

describe('framework runtime', () => {
  it('includes server action file for Next mutation route', () => {
    const report = simulateFrameworkRequest({
      framework: 'next-app-router',
      routeKind: 'editor',
      hasMutation: true,
      renderIntent: 'streaming',
    });

    expect(report.serverFiles).toContain('app/editor/actions.ts');
    expect(report.steps[1]).toContain('потоково');
  });

  it('uses route action file for React Router mutation route', () => {
    const report = simulateFrameworkRequest({
      framework: 'react-router-framework',
      routeKind: 'dashboard',
      hasMutation: true,
      renderIntent: 'ssr',
    });

    expect(report.serverFiles).toContain('app/routes/dashboard.action.ts');
  });
});
