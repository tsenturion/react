import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { CodemodReleaseLab } from './CodemodReleaseLab';

describe('CodemodReleaseLab', () => {
  it('warns when experimental channel is selected', async () => {
    const user = userEvent.setup();

    render(<CodemodReleaseLab />);
    await user.click(screen.getByRole('button', { name: 'Experimental' }));

    expect(
      screen.getByText(/Experimental не подходит для production migration/i),
    ).toBeInTheDocument();
  });
});
