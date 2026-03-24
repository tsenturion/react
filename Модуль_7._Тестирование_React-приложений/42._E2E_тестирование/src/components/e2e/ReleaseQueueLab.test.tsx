import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderWithJourneyProviders } from '../../test/test-utils';
import { ReleaseQueueLab } from './ReleaseQueueLab';

describe('ReleaseQueueLab', () => {
  it('recovers from flaky queue after retry', async () => {
    const { user } = renderWithJourneyProviders(<ReleaseQueueLab />, {
      route: '/data-journeys',
    });

    await user.selectOptions(screen.getByLabelText('Профиль очереди'), 'flaky');
    await user.click(screen.getByRole('button', { name: 'Загрузить очередь' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Транспортный слой не подтвердил очередь с первой попытки.',
    );

    await user.click(screen.getByRole('button', { name: 'Повторить загрузку' }));

    expect(await screen.findByText('Auth redirect regression pack')).toBeInTheDocument();
  });
});
