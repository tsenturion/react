import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { MutationValidationLab } from './MutationValidationLab';

describe('MutationValidationLab', () => {
  it('shows validation issues for malformed form payload', async () => {
    const user = userEvent.setup();

    render(<MutationValidationLab />);

    await user.clear(screen.getByLabelText('Title'));
    await user.type(screen.getByLabelText('Title'), 'No');
    await user.clear(screen.getByLabelText('Owner'));
    await user.type(screen.getByLabelText('Owner'), 'N');
    await user.clear(screen.getByLabelText('Score'));
    await user.type(screen.getByLabelText('Score'), '11');
    await user.click(screen.getByRole('button', { name: 'Submit mutation' }));

    expect(await screen.findByText(/Title должен быть длиннее/i)).toBeInTheDocument();
  });
});
