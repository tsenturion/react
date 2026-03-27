import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithLessonProviders } from '../../test/test-utils';
import { ProviderHarnessLab } from './ProviderHarnessLab';

describe('ProviderHarnessLab', () => {
  it('uses the shared custom render helper to provide router and context state', async () => {
    const { user } = renderWithLessonProviders(<ProviderHarnessLab />, {
      route: '/custom-render?tab=providers',
      preferenceState: { density: 'compact', reviewMode: 'strict' },
    });

    expect(screen.getByText('/custom-render')).toBeInTheDocument();
    expect(screen.getByText('?tab=providers')).toBeInTheDocument();
    expect(screen.getAllByText('compact').length).toBeGreaterThan(0);
    expect(screen.getAllByText('strict').length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: 'Показать contract summary' }));

    expect(screen.getByText(/focused custom render helper/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Переключить density' }));

    expect(screen.getAllByText('comfortable').length).toBeGreaterThan(0);
  });
});
