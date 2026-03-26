import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { StreamingHydrationLab } from './StreamingHydrationLab';

describe('StreamingHydrationLab', () => {
  it('marks selected boundary as user intent', async () => {
    const user = userEvent.setup();

    render(<StreamingHydrationLab />);

    await user.click(screen.getByRole('button', { name: 'Facet sidebar' }));

    expect(
      within(screen.getByTestId('segment-row-filters')).getByText('User intent'),
    ).toBeInTheDocument();
  });
});
