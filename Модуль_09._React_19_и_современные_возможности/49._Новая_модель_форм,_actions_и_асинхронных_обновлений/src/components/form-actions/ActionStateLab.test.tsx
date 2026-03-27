import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ActionStateLab } from './ActionStateLab';

describe('ActionStateLab', () => {
  it('shows validation errors returned by useActionState', async () => {
    const user = userEvent.setup();

    render(<ActionStateLab />);

    await user.clear(screen.getByLabelText('Title'));
    await user.type(screen.getByLabelText('Title'), 'abc');
    await user.clear(screen.getByLabelText('Owner'));
    await user.type(screen.getByLabelText('Owner'), 'D');
    await user.clear(screen.getByLabelText('Cohort'));
    await user.type(screen.getByLabelText('Cohort'), '1');
    await user.clear(screen.getByLabelText('Notes'));
    await user.type(screen.getByLabelText('Notes'), 'short');
    await user.click(screen.getByRole('button', { name: 'Submit with useActionState' }));

    expect(
      await screen.findByText('Название должно содержать минимум 4 символа.'),
    ).toBeInTheDocument();
  });
});
