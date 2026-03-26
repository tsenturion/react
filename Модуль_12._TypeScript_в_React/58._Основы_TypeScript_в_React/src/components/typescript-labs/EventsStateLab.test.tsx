import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { EventsStateLab } from './EventsStateLab';

describe('EventsStateLab', () => {
  it('shows validation error for short title on submit', async () => {
    const user = userEvent.setup();

    render(<EventsStateLab />);

    await user.clear(screen.getByLabelText('Title'));
    await user.type(screen.getByLabelText('Title'), 'No');
    await user.click(screen.getByRole('button', { name: 'Submit typed form' }));

    expect(screen.getAllByText('error').length).toBeGreaterThan(0);
    expect(screen.getByText(/слишком короткое/i)).toBeInTheDocument();
  });
});
