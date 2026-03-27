import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { LegacyContextLab } from './LegacyContextLab';

describe('LegacyContextLab', () => {
  it('updates class contextType consumer when theme changes', async () => {
    const user = userEvent.setup();

    render(<LegacyContextLab />);

    await user.click(screen.getByRole('button', { name: 'Contrast theme' }));

    expect(
      screen.getByText('Theme from contextType: contrast / cozy'),
    ).toBeInTheDocument();
  });
});
