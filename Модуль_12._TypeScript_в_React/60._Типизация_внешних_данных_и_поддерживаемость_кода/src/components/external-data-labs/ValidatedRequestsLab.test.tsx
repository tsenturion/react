import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ValidatedRequestsLab } from './ValidatedRequestsLab';

describe('ValidatedRequestsLab', () => {
  it('shows schema error when response contract is broken', async () => {
    const user = userEvent.setup();

    render(<ValidatedRequestsLab />);

    await user.click(screen.getByRole('button', { name: 'Broken item' }));
    await user.click(screen.getByRole('button', { name: 'Run validated request' }));

    expect(await screen.findByText(/items\.1\.stage/i)).toBeInTheDocument();
  });
});
